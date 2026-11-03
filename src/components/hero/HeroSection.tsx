'use client';

import React from 'react';
import Link from 'next/link';
import { PROFILE_DATA } from '@/data/profile';
import { CvActionGroup } from '@/components/cv/CvActionGroup';
import { useLocale } from '@/components/i18n/LocaleContext';
import { SplitWordHeading } from '@/components/motion/SplitWordHeading';
import { RevealSequence } from '@/components/motion/RevealSequence';
import { MotionCard } from '@/components/motion/MotionCard';
import { UiIcon } from '@/components/ui/UiIcon';
import styles from './HeroSection.module.css';

export function HeroSection() {
  const { t } = useLocale();

  const heroProofItems: {
    key: string;
    label: string;
    metric: string;
    detail: string;
  }[] = [
    {
      key: 'education',
      ...t.hero.proofItems.education,
    },
    {
      key: 'lab',
      ...t.hero.proofItems.lab,
    },
    {
      key: 'data',
      ...t.hero.proofItems.data,
    },
    {
      key: 'experience',
      ...t.hero.proofItems.experience,
    },
  ];

  return (
    <section id="beranda" className={styles.heroSection} aria-labelledby="hero-main-heading">
      <div className="structuralInnerContainer">
        <div className={styles.heroGrid}>
          <RevealSequence
            className={styles.heroCopyColumn}
            trigger="mount"
            delay={0.06}
            stagger={0.14}
            duration={0.85}
            revealKey={`${t.hero.availabilityText}-${t.hero.headlineGray}`}
          >
            <div className={`glass-pill ${styles.availabilityPill}`} data-reveal-item="">
              <span className={styles.pulsingDot} aria-hidden="true" />
              <span>{t.hero.availabilityText}</span>
            </div>

            <SplitWordHeading
              as="h1"
              id="hero-main-heading"
              className={styles.heroHeadline}
              trigger="mount"
              delay={0.04}
              stagger={0.055}
              segments={[
                {
                  text: PROFILE_DATA.name,
                  className: styles.heroNameAccent,
                  asBlock: true,
                },
                {
                  asBlock: true,
                  className: styles.heroTagline,
                  children: [
                    {
                      text: t.hero.headlineGray,
                      className: 'toneMuted',
                      trailingSpace: true,
                    },
                    {
                      text: t.hero.headlineBlack,
                      className: 'tonePrimary',
                    },
                  ],
                },
              ]}
            />

            <p className={styles.heroLeadParagraph} data-reveal-item="">
              <strong className={styles.leadBold}>{t.hero.summaryBold}</strong>{' '}
              <span className={styles.leadMuted}>{t.hero.summaryMuted}</span>
            </p>

            <div className={styles.heroCtaRow} data-reveal-item="">
              <CvActionGroup source="hero" />
            </div>
          </RevealSequence>

          <div className={styles.heroShowcaseColumn}>
            <MotionCard
              revealMode="mount"
              delayOffset={0.16}
              className={`glass-card ${styles.spotlightFrame}`}
            >
              <div className={styles.proofGrid}>
                {heroProofItems.map((item, idx) => (
                  <MotionCard
                    key={item.key}
                    revealMode="mount"
                    interactive
                    hoverY={-2}
                    hoverScale={1.01}
                    index={idx}
                    delayOffset={0.22}
                    className={`glass-surface-subtle ${styles.proofCell}`}
                  >
                    <span className={styles.proofLabel}>{item.label}</span>
                    <strong className={styles.proofMetric}>{item.metric}</strong>
                    <span className={styles.proofDetail}>{item.detail}</span>
                  </MotionCard>
                ))}
              </div>

              <div className={styles.spotlightFooter}>
                <span className={styles.spotlightKicker}>
                  Python · MySQL · Laravel · Flutter · Docker
                </span>

                <Link href="/#proyek" className={`glass-surface-subtle ${styles.spotlightAllLink}`}>
                  <span>{t.hero.viewThreeProjects}</span>
                  <UiIcon name="arrow-up-right" size={16} opticalNudge />
                </Link>
              </div>
            </MotionCard>
          </div>
        </div>
      </div>
    </section>
  );
}
