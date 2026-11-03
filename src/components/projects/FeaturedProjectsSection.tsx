'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, LayoutGroup, m } from 'motion/react';
import { PROJECTS } from '@/data/projects';
import { MOTION_TIMING, notifyLayoutShift } from '@/lib/gsap';
import { useLocale } from '@/components/i18n/LocaleContext';
import { SplitWordHeading } from '@/components/motion/SplitWordHeading';
import { RevealSequence } from '@/components/motion/RevealSequence';
import { ProjectCard } from './ProjectCard';
import styles from './Projects.module.css';

export function FeaturedProjectsSection() {
  const { locale, t } = useLocale();
  const availableCategories = useMemo(() => {
    return Array.from(new Set(PROJECTS.map((p) => p.category)));
  }, []);

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const visibleProjects = useMemo(() => {
    return PROJECTS.filter((project) => {
      if (selectedCategory === 'ALL') return true;
      return project.category === selectedCategory;
    });
  }, [selectedCategory]);

  useEffect(() => {
    const rafId = window.requestAnimationFrame(() => {
      notifyLayoutShift();
    });
    return () => window.cancelAnimationFrame(rafId);
  }, [selectedCategory, locale]);

  return (
    <section id="proyek" className={styles.projectsSection} aria-labelledby="projects-heading">
      <div className="structuralInnerContainer">
        <div className={styles.sectionTopRow}>
          <div className={styles.sectionHeader}>
            <SplitWordHeading
              as="h2"
              id="projects-heading"
              className={styles.sectionTitle}
              segments={[
                {
                  text: t.projects.headingMuted,
                  className: 'toneMuted',
                  trailingSpace: true,
                },
                {
                  text: t.projects.headingPrimary,
                  className: 'tonePrimary',
                },
              ]}
            />
          </div>

          {availableCategories.length > 1 ? (
            <RevealSequence delay={0.14} revealKey={locale}>
              <div
                className={styles.filterBar}
                role="group"
                aria-label={t.projects.filterAriaLabel}
                data-reveal-item=""
              >
                {['ALL', ...availableCategories].map((category) => {
                  const isActive = selectedCategory === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      className={`${isActive ? '' : 'glass-pill'} ${styles.filterPill} ${
                        isActive ? styles.filterPillActive : ''
                      }`}
                      aria-pressed={isActive}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {isActive ? (
                        <m.span
                          layoutId="projects-filter-indicator"
                          className={styles.filterActiveBg}
                          transition={MOTION_TIMING.cardHoverSpring}
                          aria-hidden="true"
                        />
                      ) : null}
                      <span className={styles.filterPillLabel}>
                        {category === 'ALL' ? t.projects.allFilter : category}
                      </span>
                    </button>
                  );
                })}
              </div>
            </RevealSequence>
          ) : null}
        </div>

        <LayoutGroup id="projects-grid-layout">
          <div className={styles.projectsGrid}>
            <AnimatePresence mode="sync" initial={false}>
              {visibleProjects.map((project, index) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  index={index}
                  enableLayout
                />
              ))}
            </AnimatePresence>
          </div>
        </LayoutGroup>
      </div>
    </section>
  );
}
