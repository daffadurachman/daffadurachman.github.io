'use client';

import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { ensureGsapPlugins, MOTION_TIMING } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/appleSpring';

interface RevealSequenceProps {
  children: React.ReactNode;
  className?: string;
  trigger?: 'mount' | 'scroll';
  delay?: number;
  stagger?: number;
  duration?: number;
  distance?: number;
  start?: string;
  revealKey?: string;
}

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function RevealSequence({
  children,
  className,
  trigger = 'scroll',
  delay = 0,
  stagger = MOTION_TIMING.revealStagger,
  duration = MOTION_TIMING.revealDuration,
  distance = MOTION_TIMING.revealDistance,
  start = MOTION_TIMING.scrollTriggerStart,
  revealKey = 'default',
}: RevealSequenceProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const gsap = ensureGsapPlugins();
    const items = gsap.utils.toArray<HTMLElement>('[data-reveal-item]', container);
    if (items.length === 0) return;

    if (prefersReducedMotion()) {
      gsap.set(items, { y: 0, opacity: 1, clearProps: 'transform,willChange' });
      return;
    }

    const ctx = gsap.context(() => {
      const tweenVars: gsap.TweenVars = {
        y: 0,
        opacity: 1,
        duration,
        stagger,
        delay,
        ease: MOTION_TIMING.revealEase,
        clearProps: 'transform,willChange',
      };

      if (trigger === 'scroll') {
        tweenVars.scrollTrigger = {
          trigger: container,
          start,
          once: true,
        };
      }

      gsap.fromTo(
        items,
        {
          y: distance,
          opacity: 0,
          willChange: 'transform, opacity',
        },
        tweenVars
      );
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [trigger, delay, stagger, duration, distance, start, revealKey]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
