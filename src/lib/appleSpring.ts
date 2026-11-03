/**
 * Lightweight Apple-inspired fluid spring & gesture physics utilities
 * Distilled from WWDC "Designing Fluid Interfaces" (damping + response,
 * velocity handoff, exponential momentum projection, and rubber-banding).
 */

export interface SpringConfig {
  /** Damping ratio: 1.0 = critically damped (no overshoot), ~0.8 = momentum bounce */
  damping?: number;
  /** Frequency response in seconds (lower = snappier, typically 0.3–0.4s) */
  response?: number;
  /** Rest threshold in units & units/s */
  precision?: number;
}

export interface SpringAnimateOptions extends SpringConfig {
  /** Initial velocity handoff in units/second (e.g. px/s from pointer release) */
  velocity?: number;
  /** Fired when the spring settles at its target */
  onRest?: () => void;
}

export interface SpringController {
  getValue: () => number;
  getVelocity: () => number;
  set: (value: number, velocity?: number) => void;
  animateTo: (target: number, options?: SpringAnimateOptions) => void;
  stop: () => void;
  isAnimating: () => boolean;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Apple's exponential scroll/flick projection formula (SKILL.md §6):
 * projects where a gesture is going based on release velocity (px/s).
 */
export function projectMomentum(initialVelocity: number, decelerationRate = 0.998): number {
  return ((initialVelocity / 1000) * decelerationRate) / (1 - decelerationRate);
}

/**
 * Progressive boundary resistance (SKILL.md §9):
 * slows movement smoothly past an edge instead of hard-stopping.
 */
export function rubberband(overshoot: number, dimension: number, constant = 0.55): number {
  if (dimension <= 0 || overshoot === 0) return 0;
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
}

interface PointerSample {
  x: number;
  y: number;
  time: number;
}

/**
 * Short pointer history buffer (~100ms) for accurate release velocity in px/s (SKILL.md §2).
 */
export function createVelocityTracker() {
  let samples: PointerSample[] = [];

  return {
    reset() {
      samples = [];
    },
    addPoint(x: number, y: number, time = performance.now()) {
      samples.push({ x, y, time });
      const cutoff = time - 110;
      while (samples.length > 2 && samples[0].time < cutoff) {
        samples.shift();
      }
    },
    getVelocity(now = performance.now()): { vx: number; vy: number } {
      if (samples.length < 2) return { vx: 0, vy: 0 };
      const latest = samples[samples.length - 1];
      // If pointer paused before lifting, velocity has decayed to rest
      if (now - latest.time > 80) return { vx: 0, vy: 0 };

      let anchor = samples[0];
      for (let i = samples.length - 2; i >= 0; i -= 1) {
        const dt = latest.time - samples[i].time;
        anchor = samples[i];
        if (dt >= 28) break;
      }

      const dtSeconds = (latest.time - anchor.time) / 1000;
      if (dtSeconds <= 0.001) return { vx: 0, vy: 0 };

      return {
        vx: (latest.x - anchor.x) / dtSeconds,
        vy: (latest.y - anchor.y) / dtSeconds,
      };
    },
  };
}

/**
 * Interruptible requestAnimationFrame spring parameterized by Apple's
 * designer-friendly `damping` + `response`. Always continues from the live
 * presentation value and velocity when re-targeted mid-flight (SKILL.md §3–§5).
 */
export function createSpring(
  initialValue: number,
  onUpdate: (value: number, velocity: number) => void,
  defaultConfig: SpringConfig = {}
): SpringController {
  let currentValue = initialValue;
  let currentVelocity = 0;
  let targetValue = initialValue;
  let activeDamping = defaultConfig.damping ?? 1.0;
  let activeResponse = defaultConfig.response ?? 0.38;
  let activePrecision = defaultConfig.precision ?? 0.25;
  let onRestCallback: (() => void) | undefined;
  let rafId: number | null = null;
  let lastFrameTime = 0;

  const cancelFrame = () => {
    if (rafId !== null && typeof window !== 'undefined') {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
  };

  const stepFrame = (now: number) => {
    const rawDt = lastFrameTime > 0 ? (now - lastFrameTime) / 1000 : 1 / 60;
    lastFrameTime = now;
    // Clamp frame delta to avoid jumps after background tab resume
    const clampedDt = Math.min(Math.max(rawDt, 0.001), 0.032);

    const omega = (2 * Math.PI) / Math.max(activeResponse, 0.05);
    const stiffness = omega * omega;
    const dampingCoeff = 2 * Math.max(activeDamping, 0.05) * omega;

    // Sub-step <= 4ms for unconditional stability across high-frequency springs
    const subSteps = Math.max(1, Math.ceil(clampedDt / 0.004));
    const subDt = clampedDt / subSteps;

    for (let i = 0; i < subSteps; i += 1) {
      const displacement = currentValue - targetValue;
      const acceleration = -stiffness * displacement - dampingCoeff * currentVelocity;
      currentVelocity += acceleration * subDt;
      currentValue += currentVelocity * subDt;
    }

    const isSettled =
      Math.abs(targetValue - currentValue) <= activePrecision &&
      Math.abs(currentVelocity) <= activePrecision * 6;

    if (isSettled) {
      currentValue = targetValue;
      currentVelocity = 0;
      rafId = null;
      onUpdate(currentValue, 0);
      const cb = onRestCallback;
      onRestCallback = undefined;
      cb?.();
      return;
    }

    onUpdate(currentValue, currentVelocity);
    rafId = window.requestAnimationFrame(stepFrame);
  };

  return {
    getValue: () => currentValue,
    getVelocity: () => currentVelocity,
    set(value: number, velocity = 0) {
      cancelFrame();
      onRestCallback = undefined;
      currentValue = value;
      targetValue = value;
      currentVelocity = velocity;
      onUpdate(currentValue, currentVelocity);
    },
    animateTo(target: number, options: SpringAnimateOptions = {}) {
      targetValue = target;
      activeDamping = options.damping ?? defaultConfig.damping ?? 1.0;
      activeResponse = options.response ?? defaultConfig.response ?? 0.38;
      activePrecision = options.precision ?? defaultConfig.precision ?? 0.25;
      onRestCallback = options.onRest;

      if (typeof options.velocity === 'number') {
        currentVelocity = options.velocity;
      }

      if (typeof window === 'undefined' || prefersReducedMotion()) {
        cancelFrame();
        currentValue = targetValue;
        currentVelocity = 0;
        onUpdate(currentValue, 0);
        const cb = onRestCallback;
        onRestCallback = undefined;
        cb?.();
        return;
      }

      if (
        Math.abs(targetValue - currentValue) <= activePrecision &&
        Math.abs(currentVelocity) <= activePrecision * 6
      ) {
        cancelFrame();
        currentValue = targetValue;
        currentVelocity = 0;
        onUpdate(currentValue, 0);
        const cb = onRestCallback;
        onRestCallback = undefined;
        cb?.();
        return;
      }

      if (rafId === null) {
        lastFrameTime = performance.now();
        rafId = window.requestAnimationFrame(stepFrame);
      }
    },
    stop() {
      cancelFrame();
      onRestCallback = undefined;
    },
    isAnimating: () => rafId !== null,
  };
}

