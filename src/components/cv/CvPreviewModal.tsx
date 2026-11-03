'use client';

import React, { useEffect, useRef, useState } from 'react';
import { EXPERIENCES } from '@/data/experiences';
import { PROFILE_DATA } from '@/data/profile';
import { TECHNICAL_SKILLS } from '@/data/skills';
import { trackEvent, withBasePath } from '@/lib/analytics';
import {
  getLocalizedCertifications,
  getLocalizedCommunity,
  getLocalizedEducation,
  getLocalizedExperiences,
  getLocalizedSupportingSkills,
} from '@/lib/i18n';
import { useLocale } from '@/components/i18n/LocaleContext';
import {
  createSpring,
  createVelocityTracker,
  prefersReducedMotion,
  projectMomentum,
  rubberband,
  type SpringController,
} from '@/lib/appleSpring';
import { UiIcon } from '@/components/ui/UiIcon';
import styles from './CvPreviewModal.module.css';

interface CvPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function CvPreviewModal({ isOpen, onClose }: CvPreviewModalProps) {
  const { locale, t } = useLocale();
  const [activeTab, setActiveTab] = useState<'html' | 'pdf'>('html');
  const [isRendered, setIsRendered] = useState(isOpen);
  const [isBodyScrolled, setIsBodyScrolled] = useState(false);
  const [isGestureActive, setIsGestureActive] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [pdfLoadTimedOut, setPdfLoadTimedOut] = useState(false);

  const backdropRef = useRef<HTMLDivElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const htmlTabRef = useRef<HTMLButtonElement | null>(null);
  const pdfTabRef = useRef<HTMLButtonElement | null>(null);
  const tabSliderRef = useRef<HTMLSpanElement | null>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);
  const unmountTimerRef = useRef<number | null>(null);
  const pdfTimeoutRef = useRef<number | null>(null);
  const sheetSpringRef = useRef<SpringController | null>(null);
  const tabSpringRef = useRef<SpringController | null>(null);
  const velocityTrackerRef = useRef(createVelocityTracker());

  const dragStateRef = useRef({
    pointerId: -1,
    startX: 0,
    startY: 0,
    grabOffsetY: 0,
    originTop: 0,
    committed: false,
  });

  const devSkillsText = TECHNICAL_SKILLS.filter((s) => s.category === 'dev')
    .map((s) => s.name)
    .join(', ');
  const toolSkillsText = TECHNICAL_SKILLS.filter((s) => s.category === 'tools')
    .map((s) => s.name)
    .join(', ');
  const learningSkillsText = TECHNICAL_SKILLS.filter((s) => s.category === 'learning')
    .map((s) => s.name)
    .join(', ');
  const localizedEducation = getLocalizedEducation(locale);
  const localizedCertifications = getLocalizedCertifications(locale);
  const localizedExperiences = getLocalizedExperiences(locale);
  const localizedSupporting = getLocalizedSupportingSkills(locale);
  const localizedCommunity = getLocalizedCommunity(locale);

  useEffect(() => {
    const spring = createSpring(
      0,
      (y) => {
        const dialogEl = dialogRef.current;
        const backdropEl = backdropRef.current;
        if (!dialogEl) return;

        if (Math.abs(y) < 0.15 && !spring.isAnimating() && !dragStateRef.current.committed) {
          dialogEl.style.transform = '';
          if (backdropEl) backdropEl.style.opacity = '';
          setIsGestureActive(false);
          return;
        }

        dialogEl.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
        if (backdropEl && y > 0) {
          const progress = Math.min(1, y / 420);
          backdropEl.style.opacity = `${Math.max(0.25, 1 - progress * 0.72).toFixed(3)}`;
        }
      },
      { damping: 0.85, response: 0.32, precision: 0.25 }
    );

    sheetSpringRef.current = spring;
    return () => spring.stop();
  }, []);

  useEffect(() => {
    const tabSpring = createSpring(
      0,
      (progress) => {
        const slider = tabSliderRef.current;
        if (!slider) return;
        const clamped = Math.max(0, Math.min(1, progress));
        slider.style.transform = `translate3d(${(clamped * 100).toFixed(2)}%, 0, 0)`;
      },
      { damping: 1.0, response: 0.28, precision: 0.002 }
    );

    tabSpringRef.current = tabSpring;
    return () => tabSpring.stop();
  }, []);

  useEffect(() => {
    if (!isRendered) return;
    tabSpringRef.current?.animateTo(activeTab === 'pdf' ? 1 : 0, {
      damping: 1.0,
      response: 0.28,
    });
  }, [activeTab, isRendered]);

  useEffect(() => {
    if (isOpen) {
      if (unmountTimerRef.current !== null) {
        window.clearTimeout(unmountTimerRef.current);
        unmountTimerRef.current = null;
      }
      if (!isRendered) {
        previousActiveElementRef.current = document.activeElement as HTMLElement | null;
      }
      sheetSpringRef.current?.set(0);
      setIsGestureActive(false);
      setIsRendered(true);
      setIsBodyScrolled(false);
      if (activeTab === 'pdf') {
        setIsPdfLoading(true);
        setPdfLoadTimedOut(false);
      }
    } else if (isRendered) {
      unmountTimerRef.current = window.setTimeout(() => {
        setIsRendered(false);
        unmountTimerRef.current = null;
        previousActiveElementRef.current?.focus();
        previousActiveElementRef.current = null;
      }, 200);
    }

    return () => {
      if (unmountTimerRef.current !== null) {
        window.clearTimeout(unmountTimerRef.current);
      }
    };
  }, [isOpen, isRendered, activeTab]);

  // Body & Lenis scroll lock + Focus Trap + Escape close
  useEffect(() => {
    if (!isOpen || !isRendered) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.dispatchEvent(new CustomEvent('portfolio:lenis-lock'));

    const rafId = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === 'Tab' && dialogRef.current) {
        const focusables = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        ).filter((el) => el.offsetParent !== null);

        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;

        if (event.shiftKey) {
          if (active === first || !dialogRef.current.contains(active)) {
            event.preventDefault();
            last.focus();
          }
        } else if (active === last || !dialogRef.current.contains(active)) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.cancelAnimationFrame(rafId);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
      window.dispatchEvent(new CustomEvent('portfolio:lenis-unlock'));
    };
  }, [isOpen, isRendered, onClose]);

  // Prevent mobile WebViews from hanging forever on PDF loading overlay
  useEffect(() => {
    if (pdfTimeoutRef.current !== null) {
      window.clearTimeout(pdfTimeoutRef.current);
      pdfTimeoutRef.current = null;
    }

    if (isOpen && activeTab === 'pdf' && isPdfLoading) {
      pdfTimeoutRef.current = window.setTimeout(() => {
        setIsPdfLoading(false);
        setPdfLoadTimedOut(true);
      }, 2500);
    }

    return () => {
      if (pdfTimeoutRef.current !== null) {
        window.clearTimeout(pdfTimeoutRef.current);
      }
    };
  }, [isOpen, activeTab, isPdfLoading]);

  const handleHeaderPointerDown = (e: React.PointerEvent<HTMLElement>) => {
    if (e.button !== 0 || prefersReducedMotion()) return;
    const targetEl = e.target as HTMLElement | null;
    if (targetEl?.closest('button, a, [role="tab"]')) return;

    const dialogEl = dialogRef.current;
    if (!dialogEl) return;

    const liveY = sheetSpringRef.current?.getValue() ?? 0;
    sheetSpringRef.current?.stop();

    const rect = dialogEl.getBoundingClientRect();
    dragStateRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      grabOffsetY: e.clientY - rect.top,
      originTop: rect.top - liveY,
      committed: false,
    };

    velocityTrackerRef.current.reset();
    velocityTrackerRef.current.addPoint(0, liveY);
  };

  const handleHeaderPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const state = dragStateRef.current;
    if (state.pointerId !== e.pointerId) return;

    const dx = e.clientX - state.startX;
    const dy = e.clientY - state.startY;

    if (!state.committed) {
      if (Math.abs(dy) < 10 || Math.abs(dx) > Math.abs(dy)) return;
      state.committed = true;
      setIsGestureActive(true);
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // Ignore capture failure
      }
    }

    const rawOffsetY = e.clientY - state.grabOffsetY - state.originTop;
    const mappedY = rawOffsetY < 0 ? rubberband(rawOffsetY, 120, 0.55) : rawOffsetY;

    velocityTrackerRef.current.addPoint(0, mappedY);
    sheetSpringRef.current?.set(mappedY);
  };

  const finishHeaderGesture = (e: React.PointerEvent<HTMLElement>) => {
    const state = dragStateRef.current;
    if (state.pointerId !== e.pointerId) return;
    const wasCommitted = state.committed;
    state.pointerId = -1;
    state.committed = false;

    if (!wasCommitted) return;

    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore release failure
    }

    const currentY = sheetSpringRef.current?.getValue() ?? 0;
    const { vy } = velocityTrackerRef.current.getVelocity();
    const projectedY = currentY + projectMomentum(vy, 0.998);

    if (projectedY > 150 && vy >= -120) {
      const exitY = Math.max(window.innerHeight * 0.65, currentY + 220);
      sheetSpringRef.current?.animateTo(exitY, {
        velocity: vy,
        damping: 1.0,
        response: 0.26,
        onRest: () => onClose(),
      });
    } else {
      sheetSpringRef.current?.animateTo(0, {
        velocity: vy,
        damping: 0.85,
        response: 0.32,
      });
    }
  };

  const handleSelectPdfTab = () => {
    if (activeTab !== 'pdf') {
      setIsPdfLoading(true);
      setPdfLoadTimedOut(false);
      setActiveTab('pdf');
      trackEvent('cv_preview_open', { default_tab: 'pdf_embed', source: 'modal_tab' });
    }
  };

  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      if (activeTab === 'html') {
        handleSelectPdfTab();
        pdfTabRef.current?.focus();
      } else {
        setActiveTab('html');
        htmlTabRef.current?.focus();
      }
    }
  };

  if (!isRendered) return null;

  return (
    <div
      ref={backdropRef}
      className={`${styles.modalBackdrop} ${!isOpen ? styles.modalBackdropClosing : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cv-preview-dialog-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className={`glass-card ${styles.modalDialog} ${!isOpen ? styles.modalDialogClosing : ''} ${
          isGestureActive ? styles.modalDialogGestureActive : ''
        }`}
      >
        <header
          className={`${styles.modalHeader} ${
            isBodyScrolled ? styles.modalHeaderScrolled : ''
          }`}
          onPointerDown={handleHeaderPointerDown}
          onPointerMove={handleHeaderPointerMove}
          onPointerUp={finishHeaderGesture}
          onPointerCancel={finishHeaderGesture}
        >
          <div className={styles.sheetGrabberRow} aria-hidden="true">
            <span className={styles.sheetGrabber} />
          </div>
          <div>
            <h2 id="cv-preview-dialog-title" className={styles.modalTitle}>
              {t.cvModal.titlePrefix} · {PROFILE_DATA.name}
            </h2>
            <p className={styles.modalSubtitle}>
              {PROFILE_DATA.location} · {PROFILE_DATA.phone} · {PROFILE_DATA.email}
            </p>
          </div>

          <div className={styles.modalHeaderActions}>
            <div className={`glass-surface-subtle ${styles.tabGroup}`} role="tablist" aria-label={t.cvModal.modeAriaLabel}>
              <span ref={tabSliderRef} className={styles.tabSlider} aria-hidden="true" />
              <button
                ref={htmlTabRef}
                id="cv-tab-html"
                type="button"
                role="tab"
                aria-selected={activeTab === 'html'}
                aria-controls="cv-panel-html"
                tabIndex={activeTab === 'html' ? 0 : -1}
                className={`${styles.tabBtn} ${activeTab === 'html' ? styles.tabBtnActive : ''}`}
                onClick={() => setActiveTab('html')}
                onKeyDown={handleTabKeyDown}
              >
                {t.cvModal.tabSummary}
              </button>
              <button
                ref={pdfTabRef}
                id="cv-tab-pdf"
                type="button"
                role="tab"
                aria-selected={activeTab === 'pdf'}
                aria-controls="cv-panel-pdf"
                tabIndex={activeTab === 'pdf' ? 0 : -1}
                className={`${styles.tabBtn} ${activeTab === 'pdf' ? styles.tabBtnActive : ''}`}
                onClick={handleSelectPdfTab}
                onKeyDown={handleTabKeyDown}
              >
                {t.cvModal.tabPdf}
              </button>
            </div>

            <a
              href={withBasePath(PROFILE_DATA.cvPdfPath)}
              download={PROFILE_DATA.cvFileName}
              className={styles.primaryDownloadBtn}
              onClick={() => trackEvent('cv_download_click', { source: 'modal' })}
            >
              <UiIcon name="download" size={16} opticalNudge />
              <span>
                {t.cvModal.downloadPrefix} ({PROFILE_DATA.cvFileSize})
              </span>
            </a>

            <button
              ref={closeButtonRef}
              type="button"
              className={`glass-surface-subtle ${styles.closeModalBtn}`}
              aria-label={t.cvModal.closeAriaLabel}
              onClick={onClose}
            >
              <UiIcon name="close" size={16} />
            </button>
          </div>
        </header>

        <div
          className={styles.modalBody}
          onScroll={(e) => setIsBodyScrolled(e.currentTarget.scrollTop > 6)}
        >
          {activeTab === 'html' ? (
            <div
              id="cv-panel-html"
              role="tabpanel"
              aria-labelledby="cv-tab-html"
              className={styles.cvSheet}
            >
              <section className={styles.cvSheetSection}>
                <h3 className={styles.cvSheetHeading}>{t.cvModal.profileSummaryHeading}</h3>
                <p className={styles.cvSheetText}>
                  {t.hero.summaryBold} {t.hero.summaryMuted}
                </p>
              </section>

              <section className={styles.cvSheetSection}>
                <h3 className={styles.cvSheetHeading}>{t.cvModal.educationHeading}</h3>
                <div className={styles.cvGridTwoCol}>
                  {localizedEducation.map((edu) => (
                    <div key={edu.institution} className={`glass-surface-subtle ${styles.cvItemCard}`}>
                      <div className={styles.cvItemHeader}>
                        <strong>{edu.degree}</strong>
                        <span className={`glass-surface-subtle ${styles.cvScorePill}`}>
                          {edu.scoreLabel}: {edu.scoreValue}
                        </span>
                      </div>
                      <p className={styles.cvItemSub}>{edu.institution}</p>
                      <p className={styles.cvItemMeta}>
                        {edu.period} · {edu.location}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section className={styles.cvSheetSection}>
                <h3 className={styles.cvSheetHeading}>Certifications</h3>
                <div className={styles.cvGridTwoCol}>
                  {localizedCertifications.map((cert) => (
                    <div key={cert.id} className={`glass-surface-subtle ${styles.cvItemCard}`}>
                      <strong>{cert.title}</strong>
                      <p className={styles.cvItemSub}>{cert.issuer}</p>
                      <p className={styles.cvItemMeta}>
                        {cert.date}
                        {cert.credentialId ? ` · ID: ${cert.credentialId}` : ''}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section className={styles.cvSheetSection}>
                <h3 className={styles.cvSheetHeading}>Tech Stack &amp; Supporting Skills</h3>
                <ul className={styles.cvBulletList}>
                  <li>
                    <strong>Development &amp; Data:</strong> {devSkillsText}.
                  </li>
                  <li>
                    <strong>Tools &amp; Workflow:</strong> {toolSkillsText}.
                  </li>
                  {learningSkillsText ? (
                    <li>
                      <strong>Currently Learning:</strong> {learningSkillsText}.
                    </li>
                  ) : null}
                  <li>
                    <strong>{t.cvModal.hardwareNetLabel}</strong> {t.cvModal.hardwareNetText}
                  </li>
                  {localizedSupporting.map((group) => (
                    <li key={group.title}>
                      <strong>{group.title}:</strong> {group.items.join(' ')}
                    </li>
                  ))}
                </ul>
              </section>

              <section className={styles.cvSheetSection}>
                <h3 className={styles.cvSheetHeading}>
                  {t.cvModal.experienceHeadingPrefix}
                  {EXPERIENCES.length}
                  {t.cvModal.experienceHeadingSuffix}
                </h3>
                <div className={styles.cvExpList}>
                  {localizedExperiences.map((exp) => (
                    <div key={exp.id} className={`glass-surface-subtle ${styles.cvItemCard}`}>
                      <div className={styles.cvItemHeader}>
                        <strong>
                          {exp.role} · {exp.company}
                        </strong>
                        <span className={`glass-surface-subtle ${styles.cvScorePill}`}>
                          {exp.displayType}
                        </span>
                      </div>
                      <p className={styles.cvItemMeta}>
                        {exp.period} · {exp.location}
                      </p>
                      <p className={styles.cvSheetText}>{exp.highlights[0]}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className={styles.cvSheetSection}>
                <h3 className={styles.cvSheetHeading}>{t.cvModal.communityHeading}</h3>
                <div className={styles.cvGridTwoCol}>
                  {localizedCommunity.map((item) => (
                    <div key={item.role} className={`glass-surface-subtle ${styles.cvItemCard}`}>
                      <strong>{item.role}</strong>
                      <p className={styles.cvItemSub}>{item.organization}</p>
                      <p className={styles.cvItemMeta}>
                        {item.year} · {item.location}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          ) : (
            <div
              id="cv-panel-pdf"
              role="tabpanel"
              aria-labelledby="cv-tab-pdf"
              className={styles.pdfPanelWrap}
            >
              <div className={`glass-surface-subtle ${styles.pdfFallbackBar}`}>
                <span className={styles.pdfFallbackNote}>
                  {pdfLoadTimedOut
                    ? t.cvModal.pdfTimeoutNote
                    : `${t.cvModal.pdfOriginalPrefix} (${PROFILE_DATA.cvFileSize})`}
                </span>
                <a
                  href={withBasePath(PROFILE_DATA.cvPdfPath)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`accentPill ${styles.pdfOpenTabBtn}`}
                >
                  <span>{t.cvModal.openPdfTab}</span>
                  <UiIcon name="arrow-up-right" size={14} opticalNudge />
                </a>
              </div>

              <div className={`glass-surface-subtle ${styles.pdfFrameContainer}`}>
                {isPdfLoading ? (
                  <div className={styles.pdfLoadingOverlay} role="status" aria-live="polite">
                    <div className={styles.pdfLoadingShimmer} aria-hidden="true" />
                    <span className={styles.pdfLoadingLabel}>
                      {t.cvModal.pdfLoadingPrefix} (<code className={styles.pdfSizeCode}>{PROFILE_DATA.cvFileSize}</code>)...
                    </span>
                  </div>
                ) : null}
                <iframe
                  src={withBasePath(PROFILE_DATA.cvPdfPath)}
                  title={t.cvModal.pdfIframeTitle}
                  className={`${styles.pdfIframe} ${
                    !isPdfLoading ? styles.pdfIframeLoaded : ''
                  }`}
                  onLoad={() => {
                    setIsPdfLoading(false);
                    setPdfLoadTimedOut(false);
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
