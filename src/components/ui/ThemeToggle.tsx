'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { prefersReducedMotion } from '@/lib/appleSpring';
import { useLocale } from '@/components/i18n/LocaleContext';
import styles from './ThemeToggle.module.css';

export type PortfolioTheme = 'light' | 'dark';

const STORAGE_KEY = 'portfolio-theme';
const THEME_EVENT = 'portfolio:theme-change';

function readDomTheme(): PortfolioTheme {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

function readSystemTheme(): PortfolioTheme {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyDomTheme(theme: PortfolioTheme) {
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  root.style.colorScheme = theme;
}

interface ThemeToggleProps {
  className?: string;
  tabIndex?: number;
}

export function ThemeToggle({ className, tabIndex }: ThemeToggleProps) {
  const { t } = useLocale();
  const [theme, setTheme] = useState<PortfolioTheme>('light');
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const fallbackTimerRef = useRef<number | null>(null);
  const transitionInFlightRef = useRef(false);
  const maskId = useId();

  useEffect(() => {
    setTheme(readDomTheme());

    const observer =
      typeof MutationObserver !== 'undefined'
        ? new MutationObserver(() => {
            setTheme(readDomTheme());
          })
        : null;
    observer?.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      const next: PortfolioTheme =
        event.newValue === 'dark' || event.newValue === 'light'
          ? event.newValue
          : readSystemTheme();
      applyDomTheme(next);
      setTheme(next);
    };

    const handleSameTabThemeChange = (event: Event) => {
      const detail = (event as CustomEvent<{ theme?: PortfolioTheme }>).detail;
      const next = detail?.theme ?? readDomTheme();
      setTheme(next);
    };

    const colorQuery =
      typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-color-scheme: dark)')
        : null;

    const handleSystemChange = (event: MediaQueryListEvent) => {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored === 'light' || stored === 'dark') return;
      } catch {
        // Ignore storage read failure
      }
      const next: PortfolioTheme = event.matches ? 'dark' : 'light';
      applyDomTheme(next);
      setTheme(next);
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener(THEME_EVENT, handleSameTabThemeChange);
    colorQuery?.addEventListener?.('change', handleSystemChange);

    return () => {
      observer?.disconnect();
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(THEME_EVENT, handleSameTabThemeChange);
      colorQuery?.removeEventListener?.('change', handleSystemChange);
      if (fallbackTimerRef.current !== null) {
        window.clearTimeout(fallbackTimerRef.current);
      }
    };
  }, []);

  const handleToggle = () => {
    const current = readDomTheme();
    const next: PortfolioTheme = current === 'dark' ? 'light' : 'dark';

    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore storage write failure in restricted contexts
    }

    const commitTheme = () => {
      applyDomTheme(next);
      setTheme(next);
      window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: { theme: next } }));
    };

    const reduceMotion = prefersReducedMotion();
    const docWithTransition = document as Document & {
      startViewTransition?: (cb: () => void) => { ready: Promise<void>; finished?: Promise<void> };
    };

    if (
      !reduceMotion &&
      !transitionInFlightRef.current &&
      typeof docWithTransition.startViewTransition === 'function'
    ) {
      transitionInFlightRef.current = true;
      const btn = buttonRef.current;
      const rect = btn?.getBoundingClientRect();
      const originX = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
      const originY = rect ? rect.top + rect.height / 2 : 36;
      const endRadius = Math.hypot(
        Math.max(originX, window.innerWidth - originX),
        Math.max(originY, window.innerHeight - originY)
      );

      const transition = docWithTransition.startViewTransition(commitTheme);
      transition.ready
        .then(() => {
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${originX.toFixed(1)}px ${originY.toFixed(1)}px)`,
                `circle(${endRadius.toFixed(1)}px at ${originX.toFixed(1)}px ${originY.toFixed(1)}px)`,
              ],
            },
            {
              duration: 460,
              easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
              pseudoElement: '::view-transition-new(root)',
            }
          );
        })
        .catch(() => {})
        .finally(() => {
          window.setTimeout(() => {
            transitionInFlightRef.current = false;
          }, 480);
        });
      return;
    }

    if (!reduceMotion) {
      document.documentElement.classList.add('themeTransitioning');
      if (fallbackTimerRef.current !== null) {
        window.clearTimeout(fallbackTimerRef.current);
      }
      fallbackTimerRef.current = window.setTimeout(() => {
        document.documentElement.classList.remove('themeTransitioning');
        fallbackTimerRef.current = null;
      }, 260);
    }

    commitTheme();
  };

  const isDark = theme === 'dark';
  const label = isDark ? t.nav.switchThemeToLight : t.nav.switchThemeToDark;

  return (
    <button
      ref={buttonRef}
      type="button"
      className={`${styles.toggleBtn} ${className ?? ''}`}
      onClick={handleToggle}
      aria-label={label}
      aria-pressed={isDark}
      title={label}
      tabIndex={tabIndex}
      data-theme-toggle="true"
    >
      <svg
        width={18}
        height={18}
        viewBox="0 0 24 24"
        fill="none"
        className={styles.orbitalSvg}
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <mask id={maskId}>
            <rect x="0" y="0" width="24" height="24" fill="white" />
            <circle className={styles.eclipseCutout} cx="21" cy="3" r="6.2" fill="black" />
          </mask>
        </defs>

        <circle
          className={styles.orbitalCore}
          cx="12"
          cy="12"
          r="5"
          fill="currentColor"
          mask={`url(#${maskId})`}
        />

        <g
          className={styles.orbitalRays}
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
        >
          <line x1="12" y1="2" x2="12" y2="4" />
          <line x1="12" y1="20" x2="12" y2="22" />
          <line x1="2" y1="12" x2="4" y2="12" />
          <line x1="20" y1="12" x2="22" y2="12" />
          <line x1="4.93" y1="4.93" x2="6.34" y2="6.34" />
          <line x1="17.66" y1="17.66" x2="19.07" y2="19.07" />
          <line x1="19.07" y1="4.93" x2="17.66" y2="6.34" />
          <line x1="6.34" y1="17.66" x2="4.93" y2="19.07" />
        </g>
      </svg>
    </button>
  );
}
