'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { prefersReducedMotion } from '@/lib/appleSpring';
import {
  ensureGsapPlugins,
  gsap,
  scheduleScrollTriggerRefresh,
  ScrollTrigger,
} from '@/lib/gsap';

const ANCHOR_OFFSET = -84;

function normalizePath(pathname: string): string {
  return pathname.replace(/\/+$/, '') || '/';
}

export function SmoothScrollProvider() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    ensureGsapPlugins();

    const motionQuery =
      typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : null;

    let unsubscribeScroll: (() => void) | null = null;
    let tickerCallback: ((time: number) => void) | null = null;

    const destroyLenis = () => {
      if (tickerCallback) {
        gsap.ticker.remove(tickerCallback);
        tickerCallback = null;
      }
      unsubscribeScroll?.();
      unsubscribeScroll = null;
      lenisRef.current?.destroy();
      lenisRef.current = null;
      scheduleScrollTriggerRefresh();
    };

    const initLenis = () => {
      if (prefersReducedMotion()) {
        destroyLenis();
        return;
      }
      if (lenisRef.current) return;

      const lenis = new Lenis({
        lerp: 0.088,
        wheelMultiplier: 1,
        touchMultiplier: 1,
        smoothWheel: true,
        autoRaf: false,
        stopInertiaOnNavigate: true,
        respectReducedMotion: true,
        prevent: (node) =>
          node.closest('[role="dialog"]') !== null ||
          node.hasAttribute('data-lenis-prevent'),
      });

      lenisRef.current = lenis;

      unsubscribeScroll = lenis.on('scroll', (instance) => {
        ScrollTrigger.update();
        window.dispatchEvent(
          new CustomEvent('portfolio:lenis-scroll', {
            detail: { scroll: instance.scroll, velocity: instance.velocity },
          })
        );
      });

      tickerCallback = (time: number) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(tickerCallback);
      gsap.ticker.lagSmoothing(0);
      scheduleScrollTriggerRefresh();
    };

    const handleScrollToTop = () => {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { duration: 0.95 });
      } else {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
      }
    };

    const handleLock = () => {
      lenisRef.current?.stop();
    };

    const handleUnlock = () => {
      lenisRef.current?.start();
    };

    const handleLayoutShift = () => {
      lenisRef.current?.resize();
      scheduleScrollTriggerRefresh();
    };

    const handleAnchorClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest('a[href]');
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target && anchor.target !== '_self') return;

      let parsedUrl: URL;
      try {
        parsedUrl = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }

      if (
        parsedUrl.origin !== window.location.origin ||
        normalizePath(parsedUrl.pathname) !== normalizePath(window.location.pathname) ||
        !parsedUrl.hash
      ) {
        return;
      }

      const hashId = decodeURIComponent(parsedUrl.hash.slice(1));
      if (!hashId) return;

      const targetEl =
        hashId === 'beranda' ? null : document.getElementById(hashId);
      if (hashId !== 'beranda' && !targetEl) return;

      event.preventDefault();
      if (window.location.hash !== parsedUrl.hash) {
        window.history.pushState(null, '', `${parsedUrl.pathname}${parsedUrl.hash}`);
      }

      if (prefersReducedMotion() || !lenisRef.current) {
        if (hashId === 'beranda') {
          window.scrollTo({ top: 0, behavior: 'auto' });
        } else if (targetEl) {
          const top =
            targetEl.getBoundingClientRect().top + window.scrollY + ANCHOR_OFFSET;
          window.scrollTo({ top: Math.max(0, top), behavior: 'auto' });
        }
        return;
      }

      if (hashId === 'beranda') {
        lenisRef.current.scrollTo(0, { duration: 1.05 });
      } else if (targetEl) {
        lenisRef.current.scrollTo(targetEl, {
          offset: ANCHOR_OFFSET,
          duration: 1.05,
        });
      }
    };

    const handleMotionChange = () => {
      if (motionQuery?.matches) {
        destroyLenis();
      } else {
        initLenis();
      }
    };

    initLenis();

    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(() => {
        scheduleScrollTriggerRefresh();
      });
    }

    window.addEventListener('portfolio:scroll-to-top', handleScrollToTop);
    window.addEventListener('portfolio:lenis-lock', handleLock);
    window.addEventListener('portfolio:lenis-unlock', handleUnlock);
    window.addEventListener('portfolio:layout-shift', handleLayoutShift);
    document.addEventListener('click', handleAnchorClick, { capture: true });
    motionQuery?.addEventListener?.('change', handleMotionChange);

    return () => {
      window.removeEventListener('portfolio:scroll-to-top', handleScrollToTop);
      window.removeEventListener('portfolio:lenis-lock', handleLock);
      window.removeEventListener('portfolio:lenis-unlock', handleUnlock);
      window.removeEventListener('portfolio:layout-shift', handleLayoutShift);
      document.removeEventListener('click', handleAnchorClick, { capture: true });
      motionQuery?.removeEventListener?.('change', handleMotionChange);
      destroyLenis();
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const rafId = window.requestAnimationFrame(() => {
      lenisRef.current?.resize();
      scheduleScrollTriggerRefresh();

      if (window.location.hash) {
        const id = decodeURIComponent(window.location.hash.slice(1));
        const targetEl = id === 'beranda' ? null : document.getElementById(id);
        if (lenisRef.current && !prefersReducedMotion()) {
          if (id === 'beranda') {
            lenisRef.current.scrollTo(0, { immediate: true });
          } else if (targetEl) {
            lenisRef.current.scrollTo(targetEl, {
              offset: ANCHOR_OFFSET,
              duration: 0.9,
            });
          }
        }
        return;
      }

      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
    });

    return () => window.cancelAnimationFrame(rafId);
  }, [pathname]);

  return null;
}
