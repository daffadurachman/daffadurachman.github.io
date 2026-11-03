'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, LayoutGroup, m, useReducedMotion } from 'motion/react';
import { trackEvent } from '@/lib/analytics';
import { MOTION_TIMING, notifyLayoutShift } from '@/lib/gsap';
import { getLocalizedRunbooks } from '@/lib/i18n';
import { useLocale } from '@/components/i18n/LocaleContext';
import { useCertificateModal } from '@/components/certificates/CertificateModalContext';
import { MotionCard } from '@/components/motion/MotionCard';
import { UiIcon } from '@/components/ui/UiIcon';
import styles from './RunbookCaselets.module.css';

export function RunbookCaselets() {
  const { locale, t } = useLocale();
  const { openCertificateModal } = useCertificateModal();
  const prefersReduced = useReducedMotion();
  const caselets = getLocalizedRunbooks(locale);
  const [activeId, setActiveId] = useState(caselets[0]?.id ?? '');

  const activeCase = caselets.find((item) => item.id === activeId) ?? caselets[0];

  useEffect(() => {
    const rafId = window.requestAnimationFrame(() => {
      notifyLayoutShift();
    });
    return () => window.cancelAnimationFrame(rafId);
  }, [activeId, locale]);

  if (!activeCase) return null;

  const stages = [
    { key: 'symptom', label: t.runbook.step1, text: activeCase.symptom, isOutcome: false },
    { key: 'diagnosis', label: t.runbook.step2, text: activeCase.diagnosis, isOutcome: false },
    { key: 'resolution', label: t.runbook.step3, text: activeCase.resolution, isOutcome: false },
    { key: 'outcome', label: t.runbook.step4, text: activeCase.outcome, isOutcome: true },
  ];

  return (
    <MotionCard className={`glass-card ${styles.runbookCard}`}>
      <div className={styles.topHeader}>
        <div className={styles.headingGroup}>
          <span className={styles.eyebrowRow}>
            <UiIcon name="terminal" size={15} className={styles.eyebrowIcon} />
            <span className={styles.eyebrowLabel}>{t.runbook.eyebrow}</span>
          </span>
          <h3 className={styles.cardHeading}>{t.runbook.heading}</h3>
        </div>

        <LayoutGroup id="runbook-caselet-tabs">
          <div className={styles.tabsRow} role="tablist" aria-label={t.runbook.tablistAria}>
            {caselets.map((item) => {
              const isSelected = item.id === activeCase.id;
              return (
                <button
                  key={item.id}
                  id={`runbook-tab-${item.id}`}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-controls={`runbook-panel-${item.id}`}
                  className={`glass-surface-subtle ${styles.tabBtn} ${
                    isSelected ? styles.tabBtnActive : ''
                  }`}
                  onClick={() => {
                    setActiveId(item.id);
                    trackEvent('runbook_tab_select', { runbook_id: item.id });
                  }}
                >
                  {isSelected ? (
                    <m.span
                      layoutId="runbook-active-tab"
                      className={styles.tabActiveBg}
                      transition={MOTION_TIMING.cardHoverSpring}
                      aria-hidden="true"
                    />
                  ) : null}
                  <span className={styles.tabBtnLabel}>{item.domain}</span>
                </button>
              );
            })}
          </div>
        </LayoutGroup>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <m.div
          key={`${locale}-${activeCase.id}`}
          id={`runbook-panel-${activeCase.id}`}
          role="tabpanel"
          aria-labelledby={`runbook-tab-${activeCase.id}`}
          className={styles.panelBody}
          initial={prefersReduced ? { opacity: 0.01 } : { opacity: 0, y: 10 }}
          animate={prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={{ duration: prefersReduced ? 0.14 : 0.26, ease: MOTION_TIMING.cardEnterEase }}
        >
          <div className={styles.caseHeader}>
            <strong className={styles.caseTitle}>{activeCase.title}</strong>
            <span className={styles.caseContext}>{activeCase.context}</span>
          </div>

          <div className={styles.stagesGrid}>
            {stages.map((stage, idx) => (
              <m.div
                key={stage.key}
                className={`glass-surface-subtle ${styles.stageBox} ${
                  stage.isOutcome ? styles.stageBoxOutcome : ''
                }`}
                initial={prefersReduced ? false : { opacity: 0, y: 12 }}
                animate={prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
                transition={{
                  duration: prefersReduced ? 0.14 : 0.36,
                  delay: prefersReduced ? 0 : idx * 0.055,
                  ease: MOTION_TIMING.cardEnterEase,
                }}
              >
                <span className={styles.stageLabel}>{stage.label}</span>
                <p className={styles.stageText}>{stage.text}</p>
              </m.div>
            ))}
          </div>

          {activeCase.relatedCertificate ? (
            <div className={styles.footerRow}>
              <button
                type="button"
                className={`accentPill ${styles.proofBtn}`}
                onClick={() => {
                  trackEvent('certificate_view_click', {
                    experience_id: activeCase.id,
                    certificate_number: activeCase.relatedCertificate?.credentialId ?? '',
                  });
                  openCertificateModal(activeCase.relatedCertificate!);
                }}
              >
                <UiIcon name="award" size={15} />
                <span>{t.runbook.viewProofBtn}</span>
                <UiIcon name="eye" size={15} />
              </button>
            </div>
          ) : null}
        </m.div>
      </AnimatePresence>
    </MotionCard>
  );
}
