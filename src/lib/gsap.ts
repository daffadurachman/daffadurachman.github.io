'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let isRegistered = false;
let refreshRafId: number | null = null;

export const MOTION_TIMING = {
  wordDuration: 0.78,
  wordMountDuration: 0.72,
  wordStagger: 0.055,
  wordEase: 'power3.out',
  revealDuration: 0.88,
  revealStagger: 0.13,
  revealDistance: 22,
  revealEase: 'power3.out',
  scrollTriggerStart: 'top 88%',
  cardEnterDuration: 0.72,
  cardEnterEase: [0.22, 1, 0.36, 1] as const,
  cardHoverSpring: { type: 'spring' as const, visualDuration: 0.34, bounce: 0 },
  cardTapSpring: { type: 'spring' as const, visualDuration: 0.14, bounce: 0 },
  layoutSpring: { type: 'spring' as const, visualDuration: 0.38, bounce: 0 },
} as const;

export function ensureGsapPlugins(): typeof gsap {
  if (typeof window !== 'undefined' && !isRegistered) {
    gsap.registerPlugin(ScrollTrigger);
    isRegistered = true;
  }
  return gsap;
}

export function scheduleScrollTriggerRefresh(): void {
  if (typeof window === 'undefined') return;
  ensureGsapPlugins();
  if (refreshRafId !== null) {
    window.cancelAnimationFrame(refreshRafId);
  }
  refreshRafId = window.requestAnimationFrame(() => {
    refreshRafId = null;
    ScrollTrigger.refresh();
  });
}

export function notifyLayoutShift(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('portfolio:layout-shift'));
}

export { gsap, ScrollTrigger };
