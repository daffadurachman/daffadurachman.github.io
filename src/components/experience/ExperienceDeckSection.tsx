'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { ExperienceItem } from '@/types/portfolio';
import { trackEvent } from '@/lib/analytics';
import { createSpring, type SpringController } from '@/lib/appleSpring';
import { notifyLayoutShift } from '@/lib/gsap';
import { getLocalizedExperiences } from '@/lib/i18n';
import { useLocale } from '@/components/i18n/LocaleContext';
import { useCertificateModal } from '@/components/certificates/CertificateModalContext';
import { SplitWordHeading } from '@/components/motion/SplitWordHeading';
import { RevealSequence } from '@/components/motion/RevealSequence';
import { MotionCard } from '@/components/motion/MotionCard';
import { RunbookCaselets } from '@/components/experience/RunbookCaselets';
import { UiIcon } from '@/components/ui/UiIcon';
import styles from './ExperienceDeckSection.module.css';

export function ExperienceDeckSection() {
  const { locale, t } = useLocale();
  const { openCertificateModal } = useCertificateModal();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExtraMounted, setIsExtraMounted] = useState(false);

  const extraRegionRef = useRef<HTMLDivElement | null>(null);
  const extraInnerRef = useRef<HTMLDivElement | null>(null);
  const heightSpringRef = useRef<SpringController | null>(null);
  const targetHeightRef = useRef(1);
  const expandedIntentRef = useRef(false);
  const isSettledOpenRef = useRef(false);

  const localizedExperiences = getLocalizedExperiences(locale);
  const primaryExperiences = localizedExperiences.slice(0, 3);
  const extraExperiences = localizedExperiences.slice(3);
  const hiddenCount = extraExperiences.length;

  useEffect(() => {
    const spring = createSpring(
      0,
      (h) => {
        const region = extraRegionRef.current;
        if (!region) return;
        const clampedH = Math.max(0, h);
        region.style.height = `${clampedH.toFixed(1)}px`;
        const denom = Math.max(targetHeightRef.current, 1);
        region.style.opacity = `${Math.min(1, Math.max(0, clampedH / denom)).toFixed(3)}`;
      },
      { damping: 1.0, response: 0.34, precision: 0.5 }
    );
    heightSpringRef.current = spring;
    return () => spring.stop();
  }, []);

  useEffect(() => {
    if (!isExtraMounted) return;
    const region = extraRegionRef.current;
    const inner = extraInnerRef.current;
    const spring = heightSpringRef.current;
    if (!region || !inner || !spring) return;

    const fullHeight = inner.scrollHeight;
    targetHeightRef.current = Math.max(fullHeight, 1);

    if (isExpanded) {
      isSettledOpenRef.current = false;
      spring.animateTo(fullHeight, {
        damping: 1.0,
        response: 0.34,
        onRest: () => {
          if (expandedIntentRef.current && extraRegionRef.current) {
            extraRegionRef.current.style.height = 'auto';
            extraRegionRef.current.style.opacity = '1';
            isSettledOpenRef.current = true;
            notifyLayoutShift();
          }
        },
      });
    } else {
      if (isSettledOpenRef.current) {
        isSettledOpenRef.current = false;
        const currentLiveHeight = region.getBoundingClientRect().height;
        spring.set(currentLiveHeight, spring.getVelocity());
      }
      spring.animateTo(0, {
        damping: 1.0,
        response: 0.32,
        onRest: () => {
          if (!expandedIntentRef.current) {
            setIsExtraMounted(false);
            window.requestAnimationFrame(() => notifyLayoutShift());
          }
        },
      });
    }
  }, [isExpanded, isExtraMounted]);

  const handleToggle = () => {
    const nextState = !isExpanded;
    expandedIntentRef.current = nextState;
    if (nextState) {
      setIsExtraMounted(true);
    }
    setIsExpanded(nextState);
    trackEvent('experience_deck_toggle', {
      state: nextState ? 'expanded' : 'collapsed',
    });
  };

  const renderExperienceCard = (
    exp: ExperienceItem & { displayType: string },
    interactive = true,
    useMotionCard = true,
    index = 0
  ) => {
    const [leadHighlight, ...additionalHighlights] = exp.highlights;
    const proofItems = [
      ...(exp.certificateUrl
        ? [
            {
              label: exp.certificateLabel ?? t.experience.viewCertLabel,
              url: exp.certificateUrl,
              number: exp.certificateNumber,
            },
          ]
        : []),
      ...(exp.proofs ?? []),
    ];

    const cardContent = (
      <>
        <div className={styles.cardTopRow}>
          <div className={styles.roleAndCompany}>
            <h3 className={styles.roleTitle}>{exp.role}</h3>
            <p className={styles.companyName}>{exp.company}</p>
          </div>

          <div className={styles.metaColumn}>
            <span
              className={`${styles.typePill} ${
                exp.type === 'Kerja'
                  ? styles.typeWork
                  : `glass-surface-subtle ${styles.typeInternship}`
              }`}
            >
              {exp.displayType}
            </span>
            <span className={styles.periodAndLocation}>
              {exp.period} · {exp.location}
            </span>
          </div>
        </div>

        {leadHighlight ? <p className={styles.leadHighlight}>{leadHighlight}</p> : null}

        {isExtraMounted && additionalHighlights.length > 0 ? (
          <ul className={styles.highlightsList}>
            {additionalHighlights.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        ) : null}

        {exp.achievementCallout || proofItems.length > 0 ? (
          <div className={`glass-surface-subtle ${styles.achievementCallout}`}>
            {exp.achievementCallout ? (
              <span className={styles.achievementText}>{exp.achievementCallout}</span>
            ) : null}

            {proofItems.length > 0 ? (
              <div className={styles.proofBtnsGroup}>
                {proofItems.map((proof) => (
                  <button
                    key={proof.url}
                    type="button"
                    tabIndex={interactive ? undefined : -1}
                    className={`accentPill ${styles.certificateLinkBtn}`}
                    title={proof.number ? `${proof.label} (${proof.number})` : proof.label}
                    aria-label={`${proof.label} · ${exp.role} ${exp.company}${
                      proof.number ? ` (${proof.number})` : ''
                    }`}
                    onClick={() => {
                      trackEvent('certificate_view_click', {
                        experience_id: exp.id,
                        certificate_number: proof.number ?? '',
                      });
                      openCertificateModal({
                        id: `${exp.id}-${proof.label}`,
                        title: `${exp.role} · ${exp.company}`,
                        issuer: exp.company,
                        date: exp.period,
                        summary: exp.achievementCallout,
                        credentialId: proof.number,
                        pdfUrl: proof.url,
                      });
                    }}
                  >
                    <UiIcon name="file-text" size={16} />
                    <span>{proof.label}</span>
                    <UiIcon name="eye" size={15} />
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </>
    );

    if (!useMotionCard) {
      return (
        <article key={exp.id} className={`glass-card ${styles.experienceCard}`}>
          {cardContent}
        </article>
      );
    }

    return (
      <MotionCard
        key={exp.id}
        as="article"
        interactive
        hoverY={-2}
        hoverScale={1.004}
        index={index}
        className={`glass-card ${styles.experienceCard}`}
      >
        {cardContent}
      </MotionCard>
    );
  };

  return (
    <section
      id="pengalaman"
      className={styles.experienceSection}
      aria-labelledby="experience-heading"
    >
      <div className="structuralInnerContainer">
        <div className={styles.sectionHeader}>
          <SplitWordHeading
            as="h2"
            id="experience-heading"
            className={styles.sectionTitle}
            segments={[
              {
                text: t.experience.headingMuted,
                className: 'toneMuted',
                trailingSpace: true,
              },
              {
                text: t.experience.headingPrimary,
                className: 'tonePrimary',
              },
            ]}
          />
        </div>

        <div className={styles.deckWrapper}>
          <div className={styles.cardsStack}>
            {primaryExperiences.map((exp, idx) => renderExperienceCard(exp, true, true, idx))}
          </div>

          {isExtraMounted ? (
            <div
              id="extra-experience-list"
              ref={extraRegionRef}
              className={styles.extraCardsRegion}
              aria-hidden={!isExpanded ? 'true' : undefined}
            >
              <div ref={extraInnerRef} className={styles.extraCardsInner}>
                {extraExperiences.map((exp, idx) =>
                  renderExperienceCard(exp, isExpanded, false, idx)
                )}
              </div>
            </div>
          ) : null}

          <RevealSequence revealKey={locale}>
            <div className={styles.toggleRow} data-reveal-item="">
              <button
                type="button"
                className={`accentPill ${styles.deckToggleBtn}`}
                aria-expanded={isExpanded}
                aria-controls="extra-experience-list"
                onClick={handleToggle}
              >
                <span>
                  {isExpanded
                    ? t.experience.collapseBtn
                    : `${t.experience.expandBtnPrefix} ${hiddenCount} ${t.experience.expandBtnSuffix}`}
                </span>
                <UiIcon
                  name="chevron-down"
                  size={16}
                  className={`${styles.toggleChevron} ${
                    isExpanded ? styles.toggleChevronOpen : ''
                  }`}
                />
              </button>
            </div>
          </RevealSequence>
        </div>

        <RunbookCaselets />
      </div>
    </section>
  );
}
