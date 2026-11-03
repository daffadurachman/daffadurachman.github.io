'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PROFILE_DATA } from '@/data/profile';
import { PROJECTS } from '@/data/projects';
import { trackEvent } from '@/lib/analytics';
import {
  getLocalizedCertifications,
  getLocalizedExperiences,
  getLocalizedProjectCard,
} from '@/lib/i18n';
import { useLocale } from '@/components/i18n/LocaleContext';
import { useCvModal } from '@/components/cv/CvModalContext';
import { useCertificateModal } from '@/components/certificates/CertificateModalContext';
import { UiIcon, type UiIconName } from '@/components/ui/UiIcon';
import styles from './CommandPaletteModal.module.css';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandItem {
  id: string;
  group: string;
  label: string;
  hint: string;
  keywords: string;
  icon: UiIconName;
  run: () => void;
}

export function CommandPaletteModal({ isOpen, onClose }: CommandPaletteModalProps) {
  const router = useRouter();
  const { locale, toggleLocale, t } = useLocale();
  const { openCvModal } = useCvModal();
  const { openCertificateModal } = useCertificateModal();

  const [isRendered, setIsRendered] = useState(isOpen);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [statusFeedback, setStatusFeedback] = useState('');

  const inputRef = useRef<HTMLInputElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const unmountTimerRef = useRef<number | null>(null);

  // Close palette first, then launch another modal on the next frame so Lenis unlock/lock never collides
  const launchModalSafely = (launchFn: () => void) => {
    onClose();
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        launchFn();
      });
    });
  };

  const commands = useMemo<CommandItem[]>(() => {
    const groups = t.cmdPalette.groups;
    const cmdText = t.cmdPalette.items;

    const items: CommandItem[] = [
      {
        id: 'action-cv',
        group: groups.quickActions,
        label: 'Review My CV',
        hint: cmdText.cvHint,
        keywords: 'cv resume curriculum vitae pdf unduh download pratinjau',
        icon: 'file-text',
        run: () => {
          trackEvent('command_palette_select', { command_id: 'action-cv' });
          launchModalSafely(() => openCvModal());
        },
      },
      {
        id: 'action-copy-email',
        group: groups.quickActions,
        label: `${cmdText.copyEmailPrefix} (${PROFILE_DATA.email})`,
        hint: 'Clipboard',
        keywords: 'email kontak mail salin copy daffa',
        icon: 'mail',
        run: async () => {
          let ok = false;
          if (navigator.clipboard?.writeText) {
            try {
              await navigator.clipboard.writeText(PROFILE_DATA.email);
              ok = true;
            } catch {
              ok = false;
            }
          }
          if (!ok) {
            try {
              const ta = document.createElement('textarea');
              ta.value = PROFILE_DATA.email;
              ta.style.position = 'fixed';
              ta.style.opacity = '0';
              document.body.appendChild(ta);
              ta.select();
              ok = document.execCommand('copy');
              document.body.removeChild(ta);
            } catch {
              ok = false;
            }
          }
          trackEvent('command_palette_select', { command_id: 'action-copy-email', success: ok });
          setStatusFeedback(ok ? cmdText.emailCopied : cmdText.emailFailed);
          window.setTimeout(() => onClose(), 420);
        },
      },
      {
        id: 'action-whatsapp',
        group: groups.quickActions,
        label: cmdText.whatsappLabel,
        hint: PROFILE_DATA.phone,
        keywords: 'whatsapp wa chat telepon kontak hubungi',
        icon: 'message-circle',
        run: () => {
          trackEvent('command_palette_select', { command_id: 'action-whatsapp' });
          onClose();
          window.open(PROFILE_DATA.whatsappUrl, '_blank', 'noopener,noreferrer');
        },
      },
      {
        id: 'action-theme',
        group: groups.quickActions,
        label: cmdText.toggleThemeLabel,
        hint: cmdText.toggleThemeHint,
        keywords: 'tema theme dark light gelap terang mode',
        icon: 'command',
        run: () => {
          const root = document.documentElement;
          const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
          try {
            window.localStorage.setItem('portfolio-theme', next);
          } catch {
            // Ignore storage errors
          }
          root.setAttribute('data-theme', next);
          root.style.colorScheme = next;
          window.dispatchEvent(new CustomEvent('portfolio:theme-change', { detail: { theme: next } }));
          trackEvent('command_palette_select', { command_id: 'action-theme', theme: next });
          onClose();
        },
      },
      {
        id: 'action-locale',
        group: groups.quickActions,
        label: cmdText.toggleLocaleLabel,
        hint: cmdText.toggleLocaleHint,
        keywords: 'bahasa language locale english indonesia id en translate',
        icon: 'globe',
        run: () => {
          trackEvent('command_palette_select', { command_id: 'action-locale' });
          toggleLocale();
          onClose();
        },
      },
    ];

    for (const cert of getLocalizedCertifications(locale)) {
      if (!cert.certificateUrl) continue;
      items.push({
        id: `cert-${cert.id}`,
        group: groups.certificates,
        label: cert.title,
        hint: `${cert.issuer} · ${cert.date}`,
        keywords: `sertifikat certificate ${cert.title} ${cert.issuer} ${cert.credentialId ?? ''}`.toLowerCase(),
        icon: 'award',
        run: () => {
          trackEvent('command_palette_select', { command_id: `cert-${cert.id}` });
          launchModalSafely(() =>
            openCertificateModal({
              id: cert.id,
              title: cert.title,
              issuer: cert.issuer,
              date: cert.date,
              credentialId: cert.credentialId,
              pdfUrl: cert.certificateUrl!,
            })
          );
        },
      });
    }

    for (const exp of getLocalizedExperiences(locale)) {
      if (!exp.certificateUrl) continue;
      items.push({
        id: `exp-cert-${exp.id}`,
        group: groups.certificates,
        label: `${cmdText.certPrefix} ${exp.role} (${exp.company})`,
        hint: exp.period,
        keywords: `sertifikat certificate bukti kerja ${exp.role} ${exp.company} ${exp.certificateNumber ?? ''}`.toLowerCase(),
        icon: 'award',
        run: () => {
          trackEvent('command_palette_select', { command_id: `exp-cert-${exp.id}` });
          launchModalSafely(() =>
            openCertificateModal({
              id: exp.id,
              title: `${exp.role} · ${exp.company}`,
              issuer: exp.company,
              date: exp.period,
              summary: exp.achievementCallout,
              credentialId: exp.certificateNumber,
              pdfUrl: exp.certificateUrl!,
            })
          );
        },
      });
    }

    for (const project of PROJECTS) {
      const locProj = getLocalizedProjectCard(project, locale);
      items.push({
        id: `proj-${project.slug}`,
        group: groups.projects,
        label: locProj.shortTitle,
        hint: `${project.year} · ${locProj.primaryMetric}`,
        keywords: `proyek project studi kasus case study ${locProj.shortTitle} ${project.shortTitle} ${project.cardTags.join(' ')} ${project.category}`.toLowerCase(),
        icon: 'layers',
        run: () => {
          trackEvent('command_palette_select', { command_id: `proj-${project.slug}` });
          onClose();
          router.push(`/projects/${project.slug}`);
        },
      });
    }

    const navTargets: { id: string; label: string; href: string; hint: string; keywords: string }[] = [
      { id: 'nav-beranda', label: cmdText.navHome, href: '/#beranda', hint: cmdText.navHomeHint, keywords: 'beranda home hero atas' },
      { id: 'nav-proyek', label: cmdText.navProjects, href: '/#proyek', hint: cmdText.navProjectsHint, keywords: 'proyek projects portfolio' },
      { id: 'nav-pengalaman', label: cmdText.navExperience, href: '/#pengalaman', hint: cmdText.navExperienceHint, keywords: 'pengalaman kerja magang experience runbook it support' },
      { id: 'nav-keahlian', label: cmdText.navSkills, href: '/#keahlian', hint: cmdText.navSkillsHint, keywords: 'keahlian skills tech stack pendidikan education certifications' },
      { id: 'nav-kontak', label: cmdText.navContact, href: '/#kontak', hint: cmdText.navContactHint, keywords: 'kontak contact linkedin jobstreet instagram' },
    ];

    for (const nav of navTargets) {
      items.push({
        id: nav.id,
        group: groups.navigation,
        label: nav.label,
        hint: nav.hint,
        keywords: nav.keywords,
        icon: 'arrow-up-right',
        run: () => {
          trackEvent('command_palette_select', { command_id: nav.id });
          onClose();
          router.push(nav.href);
        },
      });
    }

    return items;
  }, [locale, onClose, openCertificateModal, openCvModal, router, t, toggleLocale]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.hint.toLowerCase().includes(q) ||
        item.keywords.includes(q) ||
        item.group.toLowerCase().includes(q)
    );
  }, [commands, query]);

  const grouped = useMemo(() => {
    const map = new Map<CommandItem['group'], CommandItem[]>();
    for (const item of filtered) {
      const existing = map.get(item.group) ?? [];
      existing.push(item);
      map.set(item.group, existing);
    }
    return Array.from(map.entries());
  }, [filtered]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      if (unmountTimerRef.current !== null) {
        window.clearTimeout(unmountTimerRef.current);
        unmountTimerRef.current = null;
      }
      if (!isRendered) {
        previousFocusRef.current = document.activeElement as HTMLElement | null;
      }
      setQuery('');
      setActiveIndex(0);
      setStatusFeedback('');
      setIsRendered(true);
    } else if (isRendered) {
      unmountTimerRef.current = window.setTimeout(() => {
        setIsRendered(false);
        unmountTimerRef.current = null;
        previousFocusRef.current?.focus();
        previousFocusRef.current = null;
      }, 180);
    }

    return () => {
      if (unmountTimerRef.current !== null) {
        window.clearTimeout(unmountTimerRef.current);
      }
    };
  }, [isOpen, isRendered]);

  useEffect(() => {
    if (!isOpen || !isRendered) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.dispatchEvent(new CustomEvent('portfolio:lenis-lock'));

    const rafId = window.requestAnimationFrame(() => {
      inputRef.current?.focus();
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (filtered.length === 0) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % filtered.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        filtered[activeIndex]?.run();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.cancelAnimationFrame(rafId);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
      window.dispatchEvent(new CustomEvent('portfolio:lenis-unlock'));
    };
  }, [isOpen, isRendered, filtered, activeIndex, onClose]);

  if (!isRendered) return null;

  const activeItem = filtered[activeIndex];
  let flatCounter = -1;

  return (
    <div
      className={`${styles.backdrop} ${!isOpen ? styles.backdropClosing : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={t.cmdPalette.dialogAriaLabel}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`glass-card ${styles.dialog} ${!isOpen ? styles.dialogClosing : ''}`}>
        <div className={styles.searchBar}>
          <UiIcon name="search" size={18} className={styles.searchIcon} />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="command-palette-listbox"
            aria-activedescendant={activeItem ? `cmd-opt-${activeItem.id}` : undefined}
            aria-label={t.cmdPalette.inputAriaLabel}
            placeholder={t.cmdPalette.placeholder}
            className={styles.searchInput}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="button"
            className={`glass-surface-subtle ${styles.escBtn}`}
            aria-label={t.cmdPalette.closeAriaLabel}
            onClick={onClose}
          >
            <kbd>Esc</kbd>
          </button>
        </div>

        <div id="command-palette-listbox" role="listbox" className={styles.resultsList}>
          {grouped.length === 0 ? (
            <div className={styles.emptyState}>
              {t.cmdPalette.emptyPrefix} &ldquo;{query}&rdquo;.
            </div>
          ) : (
            grouped.map(([groupName, items]) => (
              <div key={groupName} className={styles.groupBlock}>
                <div className={styles.groupLabel}>{groupName}</div>
                {items.map((item) => {
                  flatCounter += 1;
                  const idx = flatCounter;
                  const isActive = idx === activeIndex;
                  return (
                    <button
                      key={item.id}
                      id={`cmd-opt-${item.id}`}
                      type="button"
                      role="option"
                      aria-selected={isActive}
                      className={`${styles.optionBtn} ${isActive ? styles.optionBtnActive : ''}`}
                      onMouseEnter={() => setActiveIndex(idx)}
                      onClick={() => item.run()}
                    >
                      <span className={styles.optionLeft}>
                        <UiIcon name={item.icon} size={16} className={styles.optionIcon} />
                        <span className={styles.optionLabel}>{item.label}</span>
                      </span>
                      <span className={styles.optionHint}>{item.hint}</span>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <footer className={styles.paletteFooter}>
          <span className={styles.footerHints}>
            <kbd>↑</kbd> <kbd>↓</kbd> {t.cmdPalette.footerNav} · <kbd>Enter</kbd>{' '}
            {t.cmdPalette.footerSelect} · <kbd>Esc</kbd> {t.cmdPalette.footerClose}
          </span>
          {statusFeedback ? (
            <span className={styles.feedbackText} role="status" aria-live="polite">
              {statusFeedback}
            </span>
          ) : null}
        </footer>
      </div>
    </div>
  );
}
