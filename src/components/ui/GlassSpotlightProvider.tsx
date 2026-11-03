'use client';

import { useEffect } from 'react';

export function GlassSpotlightProvider() {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const reducedTransparency = window.matchMedia('(prefers-reduced-transparency: reduce)');

    if (!finePointer.matches || reducedMotion.matches || reducedTransparency.matches) {
      return;
    }

    let activeCard: HTMLElement | null = null;
    let rafId = 0;
    let lastClientX = 0;
    let lastClientY = 0;
    let pendingTarget: EventTarget | null = null;

    const clearActive = () => {
      if (activeCard) {
        activeCard.removeAttribute('data-spotlight');
        activeCard = null;
      }
    };

    const flushPointer = () => {
      rafId = 0;
      const el = pendingTarget instanceof Element ? pendingTarget.closest<HTMLElement>('.glass-card') : null;

      if (el !== activeCard) {
        clearActive();
        activeCard = el;
      }

      if (activeCard) {
        const rect = activeCard.getBoundingClientRect();
        const x = Math.round(lastClientX - rect.left);
        const y = Math.round(lastClientY - rect.top);
        activeCard.style.setProperty('--cursor-x', `${x}px`);
        activeCard.style.setProperty('--cursor-y', `${y}px`);
        activeCard.setAttribute('data-spotlight', 'active');
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      lastClientX = e.clientX;
      lastClientY = e.clientY;
      pendingTarget = e.target;
      if (!rafId) {
        rafId = window.requestAnimationFrame(flushPointer);
      }
    };

    const handlePointerLeave = () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
      clearActive();
    };

    document.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('blur', handlePointerLeave);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('blur', handlePointerLeave);
      clearActive();
    };
  }, []);

  return null;
}
