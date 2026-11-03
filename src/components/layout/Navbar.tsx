'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PROFILE_DATA } from '@/data/profile';
import { trackEvent, withBasePath } from '@/lib/analytics';
import { useLocale } from '@/components/i18n/LocaleContext';
import { useCvModal } from '@/components/cv/CvModalContext';
import { useCommandPalette } from '@/components/command/CommandPaletteContext';
import { UiIcon } from '@/components/ui/UiIcon';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LocaleToggle } from '@/components/ui/LocaleToggle';
import styles from './Navbar.module.css';

interface NavbarProps {
  onOpenCvPreview?: () => void;
}

export function Navbar({ onOpenCvPreview }: NavbarProps) {
  const pathname = usePathname();
  const { t } = useLocale();
  const { openCvModal } = useCvModal();
  const { openCommandPalette } = useCommandPalette();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const [isMenuMounted, setIsMenuMounted] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);
  const lastScrollYRef = useRef(0);
  const scrollStreakRef = useRef(0);
  const tickingRef = useRef(false);
  const closeMenuTimerRef = useRef<number | null>(null);

  const handleOpenCv = () => {
    trackEvent('cv_preview_open', { default_tab: 'html_summary', source: 'navbar' });
    if (onOpenCvPreview) {
      onOpenCvPreview();
    } else {
      openCvModal();
    }
  };

  useEffect(() => {
    if (isMenuExpanded && !isCollapsed) {
      if (closeMenuTimerRef.current !== null) {
        window.clearTimeout(closeMenuTimerRef.current);
        closeMenuTimerRef.current = null;
      }
      setIsMenuMounted(true);
    } else if (isMenuMounted) {
      closeMenuTimerRef.current = window.setTimeout(() => {
        setIsMenuMounted(false);
        closeMenuTimerRef.current = null;
      }, 180);
    }

    return () => {
      if (closeMenuTimerRef.current !== null) {
        window.clearTimeout(closeMenuTimerRef.current);
      }
    };
  }, [isMenuExpanded, isCollapsed, isMenuMounted]);

  // Close mobile dropdown on Escape or outside click
  useEffect(() => {
    if (!isMenuExpanded) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuExpanded(false);
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsMenuExpanded(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isMenuExpanded]);

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;
    setIsScrolled(window.scrollY > 12);

    const updateNavbarState = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollYRef.current;

      setIsScrolled(currentY > 12);

      if (currentY <= 72) {
        scrollStreakRef.current = 0;
        setIsCollapsed(false);
      } else if (delta !== 0) {
        if ((delta > 0 && scrollStreakRef.current < 0) || (delta < 0 && scrollStreakRef.current > 0)) {
          scrollStreakRef.current = delta;
        } else {
          scrollStreakRef.current += delta;
        }

        const isKeyboardFocusedInside =
          navRef.current !== null && navRef.current.contains(document.activeElement);

        if (currentY > 96 && scrollStreakRef.current >= 14 && !isKeyboardFocusedInside) {
          setIsCollapsed(true);
          setIsMenuExpanded(false);
          scrollStreakRef.current = 0;
        } else if (scrollStreakRef.current <= -10) {
          setIsCollapsed(false);
          scrollStreakRef.current = 0;
        }
      }

      lastScrollYRef.current = currentY;
      tickingRef.current = false;
    };

    const handleScroll = () => {
      if (!tickingRef.current) {
        window.requestAnimationFrame(updateNavbarState);
        tickingRef.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHomePage = pathname === '/' || pathname === '';

  const handleBrandClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isCollapsed && isHomePage) {
      e.preventDefault();
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduceMotion) {
        window.scrollTo({ top: 0, behavior: 'auto' });
      } else {
        window.dispatchEvent(new CustomEvent('portfolio:scroll-to-top'));
      }
      setIsCollapsed(false);
      setIsMenuExpanded(false);
    } else if (isCollapsed) {
      setIsCollapsed(false);
      setIsMenuExpanded(false);
    }
  };

  return (
    <header className={styles.headerWrapper}>
      <nav
        ref={navRef}
        className={`glass-pill ${styles.navPill} ${isScrolled ? styles.navPillScrolled : ''} ${
          isCollapsed && !isMenuExpanded ? styles.navPillCompact : ''
        }`}
        aria-label={t.nav.ariaLabel}
        data-collapsed={isCollapsed ? 'true' : 'false'}
        data-scrolled={isScrolled ? 'true' : 'false'}
        onFocusCapture={() => {
          if (isCollapsed) setIsCollapsed(false);
        }}
      >
        <div className={styles.navTopBar}>
          <span className={styles.leadingSpacer} aria-hidden="true" />
          <Link
            href="/#beranda"
            className={styles.brandGroup}
            onClick={handleBrandClick}
          >
            <span className={styles.avatarProfile} aria-hidden="true">
              <img
                src={withBasePath('/images/profile/daffa-avatar-96.webp')}
                alt=""
                width={40}
                height={40}
                decoding="async"
                className={styles.avatarPhoto}
              />
            </span>
            <span className={styles.brandName}>{PROFILE_DATA.shortName}</span>
          </Link>
          <span className={styles.trailingSpacer} aria-hidden="true" />

          <div
            className={`${styles.navLinksDesktop} ${
              isCollapsed && !isMenuExpanded ? styles.navLinksHidden : ''
            }`}
            aria-hidden={isCollapsed && !isMenuExpanded ? 'true' : undefined}
          >
            <Link
              href="/#proyek"
              className={styles.navLink}
              tabIndex={isCollapsed && !isMenuExpanded ? -1 : undefined}
            >
              {t.nav.projects}
            </Link>
            <Link
              href="/#pengalaman"
              className={styles.navLink}
              tabIndex={isCollapsed && !isMenuExpanded ? -1 : undefined}
            >
              {t.nav.experience}
            </Link>
            <Link
              href="/#keahlian"
              className={styles.navLink}
              tabIndex={isCollapsed && !isMenuExpanded ? -1 : undefined}
            >
              {t.nav.skills}
            </Link>
            <button
              type="button"
              className={styles.navLinkBtn}
              tabIndex={isCollapsed && !isMenuExpanded ? -1 : undefined}
              onClick={handleOpenCv}
            >
              {t.nav.cv}
            </button>
            <button
              type="button"
              className={`glass-surface-subtle ${styles.cmdTriggerBtn}`}
              tabIndex={isCollapsed && !isMenuExpanded ? -1 : undefined}
              aria-label={t.nav.cmdAriaLabel}
              title={t.nav.cmdTitle}
              onClick={openCommandPalette}
            >
              <UiIcon name="search" size={14} />
              <kbd className={styles.cmdKbd}>Ctrl K</kbd>
            </button>
            <LocaleToggle
              className={styles.desktopLocaleToggle}
              tabIndex={isCollapsed && !isMenuExpanded ? -1 : undefined}
            />
            <ThemeToggle
              className={styles.desktopThemeToggle}
              tabIndex={isCollapsed && !isMenuExpanded ? -1 : undefined}
            />
            <Link
              href="/#kontak"
              className={`accentPill ${styles.contactPillBtn}`}
              tabIndex={isCollapsed && !isMenuExpanded ? -1 : undefined}
            >
              {t.nav.contact}
            </Link>
          </div>

          <div
            className={`${styles.mobileActionsGroup} ${
              isCollapsed && !isMenuExpanded ? styles.toggleHiddenWhenCompact : ''
            }`}
            aria-hidden={isCollapsed && !isMenuExpanded ? 'true' : undefined}
          >
            <LocaleToggle tabIndex={isCollapsed && !isMenuExpanded ? -1 : undefined} />
            <ThemeToggle tabIndex={isCollapsed && !isMenuExpanded ? -1 : undefined} />
            <button
              type="button"
              className={styles.collapseToggleBtn}
              tabIndex={isCollapsed && !isMenuExpanded ? -1 : undefined}
              aria-expanded={isMenuExpanded}
              aria-controls="navbar-dropdown-menu"
              aria-label={isMenuExpanded ? t.nav.closeMenuAria : t.nav.openMenuAria}
              onClick={() => setIsMenuExpanded((prev) => !prev)}
            >
              <UiIcon name={isMenuExpanded ? 'close' : 'more-horizontal'} size={18} />
            </button>
          </div>
        </div>

        {isMenuMounted ? (
          <div
            className={`${styles.dropdownPanel} ${
              !isMenuExpanded || isCollapsed ? styles.dropdownPanelClosing : ''
            }`}
            id="navbar-dropdown-menu"
          >
            <Link
              href="/#proyek"
              className={styles.dropdownLink}
              onClick={() => setIsMenuExpanded(false)}
            >
              {t.nav.projects}
            </Link>
            <Link
              href="/#pengalaman"
              className={styles.dropdownLink}
              onClick={() => setIsMenuExpanded(false)}
            >
              {t.nav.experienceWithCount}
            </Link>
            <Link
              href="/#keahlian"
              className={styles.dropdownLink}
              onClick={() => setIsMenuExpanded(false)}
            >
              {t.nav.profileSkills}
            </Link>
            <button
              type="button"
              className={styles.dropdownActionBtn}
              onClick={() => {
                setIsMenuExpanded(false);
                openCommandPalette();
              }}
            >
              {t.nav.cmdTitle}
            </button>
            <button
              type="button"
              className={styles.dropdownActionBtn}
              onClick={() => {
                setIsMenuExpanded(false);
                handleOpenCv();
              }}
            >
              {t.nav.cvPreview}
            </button>
            <Link
              href="/#kontak"
              className={styles.dropdownPrimaryBtn}
              onClick={() => setIsMenuExpanded(false)}
            >
              {t.nav.contactCta}
            </Link>
          </div>
        ) : null}
      </nav>
    </header>
  );
}
