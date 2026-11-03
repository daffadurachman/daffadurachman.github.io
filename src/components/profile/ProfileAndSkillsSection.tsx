'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, m, useReducedMotion } from 'motion/react';
import { PROFILE_DATA } from '@/data/profile';
import { TECHNICAL_SKILLS } from '@/data/skills';
import type { TechSkillItem } from '@/types/portfolio';
import { trackEvent, withBasePath } from '@/lib/analytics';
import { MOTION_TIMING, notifyLayoutShift } from '@/lib/gsap';
import {
  getLocalizedCertifications,
  getLocalizedEducation,
  getLocalizedSkillDescription,
  getLocalizedSupportingSkills,
} from '@/lib/i18n';
import { useLocale } from '@/components/i18n/LocaleContext';
import { useCertificateModal } from '@/components/certificates/CertificateModalContext';
import { SplitWordHeading } from '@/components/motion/SplitWordHeading';
import { RevealSequence } from '@/components/motion/RevealSequence';
import { MotionCard } from '@/components/motion/MotionCard';
import { UiIcon } from '@/components/ui/UiIcon';
import { TechBrandIcon } from './TechBrandIcon';
import styles from './ProfileAndSkillsSection.module.css';

export function ProfileAndSkillsSection() {
  const { locale, t } = useLocale();
  const { openCertificateModal } = useCertificateModal();
  const prefersReduced = useReducedMotion();
  const [selectedSkillName, setSelectedSkillName] = useState<string | null>(null);

  const devSkills = TECHNICAL_SKILLS.filter((s) => s.category === 'dev');
  const toolSkills = TECHNICAL_SKILLS.filter((s) => s.category === 'tools');
  const learningSkills = TECHNICAL_SKILLS.filter((s) => s.category === 'learning');
  const selectedSkill = TECHNICAL_SKILLS.find((s) => s.name === selectedSkillName && s.description);
  const localizedEducation = getLocalizedEducation(locale);
  const localizedCertifications = getLocalizedCertifications(locale);
  const localizedSupportingSkills = getLocalizedSupportingSkills(locale);

  useEffect(() => {
    const rafId = window.requestAnimationFrame(() => {
      notifyLayoutShift();
    });
    return () => window.cancelAnimationFrame(rafId);
  }, [selectedSkillName, locale]);

  const handleChipToggle = (name: string, hasDesc: boolean) => {
    if (!hasDesc) return;
    setSelectedSkillName((prev) => (prev === name ? null : name));
  };

  const renderSkillChips = (skills: TechSkillItem[]) =>
    skills.map((skill) => {
      const hasDesc = Boolean(skill.description);
      const isActive = selectedSkillName === skill.name;
      if (hasDesc) {
        return (
          <button
            key={skill.name}
            type="button"
            className={`glass-surface-subtle ${styles.techChip} ${styles.techChipInteractive} ${
              isActive ? styles.techChipActive : ''
            }`}
            aria-expanded={isActive}
            onClick={() => handleChipToggle(skill.name, true)}
          >
            <TechBrandIcon name={skill.name} className={styles.techChipIcon} />
            <span>{skill.name}</span>
            {skill.badge ? <span className={styles.focusBadge}>{skill.badge}</span> : null}
          </button>
        );
      }
      return (
        <span key={skill.name} className={`glass-surface-subtle ${styles.techChip}`}>
          <TechBrandIcon name={skill.name} className={styles.techChipIcon} />
          <span>{skill.name}</span>
        </span>
      );
    });

  return (
    <section
      id="keahlian"
      className={styles.profileSkillsSection}
      aria-labelledby="profile-skills-heading"
    >
      <div className="structuralInnerContainer">
        {/* Profil & Pendidikan */}
        <div className={styles.aboutBlock}>
          <div className={styles.sectionHeader}>
            <SplitWordHeading
              as="h2"
              id="profile-skills-heading"
              className={styles.sectionTitle}
              segments={[
                {
                  text: t.profile.aboutHeadlineGray,
                  className: 'toneMuted',
                  trailingSpace: true,
                },
                {
                  text: t.profile.aboutHeadlineBlack,
                  className: 'tonePrimary',
                },
              ]}
            />
          </div>

          <div className={styles.aboutGrid}>
            <aside className={styles.leftColumn} aria-label="Profil Daffa Hanif Durachman">
              <MotionCard
                interactive
                hoverY={-3}
                hoverScale={1.006}
                className={`glass-card ${styles.profileCard}`}
              >
                <div className={`glass-surface-subtle ${styles.portraitFrame}`}>
                  <img
                    src={withBasePath('/images/profile/daffa-portrait.webp')}
                    alt={PROFILE_DATA.name}
                    width={560}
                    height={758}
                    loading="lazy"
                    decoding="async"
                    className={styles.portraitImg}
                  />
                </div>

                <div className={styles.profileBody}>
                  <h3 className={styles.profileName}>{PROFILE_DATA.name}</h3>
                  <p className={styles.profileRole}>{PROFILE_DATA.roleTitle}</p>
                  <p className={styles.profileLocation}>{PROFILE_DATA.location}</p>
                </div>
              </MotionCard>
            </aside>

            <div className={styles.narrativeColumn}>
              <div className={styles.rightGroupBlock}>
                <RevealSequence revealKey={locale}>
                  <h3 className={styles.groupHeading} data-reveal-item="">
                    {t.profile.educationHeading}
                  </h3>
                </RevealSequence>
                <div className={styles.cardGroupList}>
                  {localizedEducation.map((edu, idx) => (
                    <MotionCard
                      key={edu.institution}
                      interactive
                      hoverY={-2}
                      hoverScale={1.005}
                      index={idx}
                      className={`glass-card ${styles.eduCard}`}
                    >
                      <div className={styles.eduTop}>
                        <strong className={styles.eduDegree}>{edu.degree}</strong>
                        <span className={`glass-surface-subtle ${styles.scoreBadge}`}>
                          {edu.scoreLabel}: {edu.scoreValue}
                        </span>
                      </div>
                      <p className={styles.eduInst}>{edu.institution}</p>
                      <span className={styles.eduPeriod}>{edu.period}</span>
                    </MotionCard>
                  ))}
                </div>
              </div>

              <div className={styles.rightGroupBlock}>
                <RevealSequence revealKey={locale}>
                  <h3 className={styles.groupHeading} data-reveal-item="">
                    Certifications
                  </h3>
                </RevealSequence>
                <div className={styles.cardGroupList}>
                  {localizedCertifications.map((cert, idx) => (
                    <MotionCard
                      key={cert.id}
                      interactive
                      hoverY={-2}
                      hoverScale={1.005}
                      index={idx}
                      className={`glass-card ${styles.certCard}`}
                    >
                      <div className={styles.certMainRow}>
                        <div className={styles.certTextGroup}>
                          <strong className={styles.activityLabel}>{cert.title}</strong>
                          <span className={styles.activityMeta}>
                            {cert.issuer} · {cert.date}
                          </span>
                          {cert.credentialId ? (
                            <span className={styles.certIdText}>
                              Cert ID: <code>{cert.credentialId}</code>
                            </span>
                          ) : null}
                        </div>

                        {cert.certificateUrl ? (
                          <button
                            type="button"
                            className={`accentPill ${styles.certLinkBtn}`}
                            aria-label={`${cert.certificateLabel ?? t.profile.viewCertLabel} · ${cert.title}`}
                            onClick={() => {
                              trackEvent('certificate_view_click', {
                                experience_id: cert.id,
                                certificate_number: cert.credentialId ?? '',
                              });
                              openCertificateModal({
                                id: cert.id,
                                title: cert.title,
                                issuer: cert.issuer,
                                date: cert.date,
                                credentialId: cert.credentialId,
                                pdfUrl: cert.certificateUrl!,
                              });
                            }}
                          >
                            <UiIcon name="file-text" size={16} />
                            <span>{cert.certificateLabel ?? t.profile.viewCertLabel}</span>
                            <UiIcon name="eye" size={15} />
                          </button>
                        ) : null}
                      </div>
                    </MotionCard>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack & Tools — compact chips with progressive disclosure */}
        <div className={styles.techStackBlock}>
          <RevealSequence stagger={0.14} revealKey={locale}>
            <h3 className={styles.groupHeading} data-reveal-item="">
              Tech Stack &amp; Tools
            </h3>

            <div className={styles.skillGroupsStack}>
              <div className={styles.skillCategoryRow} data-reveal-item="">
                <span className={styles.skillCategoryLabel}>Development &amp; Data</span>
                <div className={styles.techChipsList}>{renderSkillChips(devSkills)}</div>
              </div>

              <div className={styles.skillCategoryRow} data-reveal-item="">
                <span className={styles.skillCategoryLabel}>Tools &amp; Workflow</span>
                <div className={styles.techChipsList}>{renderSkillChips(toolSkills)}</div>
              </div>

              {learningSkills.length > 0 ? (
                <div className={styles.skillCategoryRow} data-reveal-item="">
                  <span className={styles.skillCategoryLabel}>Currently Learning</span>
                  <div className={styles.techChipsList}>{renderSkillChips(learningSkills)}</div>
                </div>
              ) : null}
            </div>
          </RevealSequence>

          <AnimatePresence initial={false}>
            {selectedSkill ? (
              <m.div
                key={selectedSkill.name}
                initial={prefersReduced ? { opacity: 0.01 } : { opacity: 0, y: -8, scale: 0.99 }}
                animate={prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
                exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.99 }}
                transition={MOTION_TIMING.cardHoverSpring}
                className={`glass-card ${styles.skillDetailNote}`}
                role="status"
                aria-live="polite"
              >
                <strong>{selectedSkill.name}:</strong>{' '}
                <span>
                  {getLocalizedSkillDescription(selectedSkill.name, selectedSkill.description, locale)}
                </span>
              </m.div>
            ) : null}
          </AnimatePresence>

          {/* Kemampuan Pendukung — progressive disclosure (collapsible, glass card) */}
          <MotionCard className={styles.supportingMotionWrap}>
            <details
              className={`glass-card ${styles.supportingDisclosure}`}
              onToggle={() => notifyLayoutShift()}
            >
              <summary className={styles.supportingSummary}>
                <span>{t.profile.supportingToggle}</span>
                <UiIcon name="chevron-down" size={16} className={styles.disclosureChevron} />
              </summary>
              <div className={styles.supportingGrid}>
                {localizedSupportingSkills.map((group) => (
                  <div key={group.title} className={styles.supportingGroup}>
                    <h4 className={styles.supportingTitle}>{group.title}</h4>
                    <ul className={styles.supportingList}>
                      {group.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </details>
          </MotionCard>
        </div>
      </div>
    </section>
  );
}
