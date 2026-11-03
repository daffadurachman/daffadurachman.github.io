'use client';

import React from 'react';
import Link from 'next/link';
import type { ProjectItem } from '@/types/portfolio';
import { trackEvent } from '@/lib/analytics';
import { getLocalizedProjectCard } from '@/lib/i18n';
import { useLocale } from '@/components/i18n/LocaleContext';
import { MotionCard } from '@/components/motion/MotionCard';
import { ProgressiveImage } from '@/components/ui/ProgressiveImage';
import { UiIcon } from '@/components/ui/UiIcon';
import styles from './Projects.module.css';

interface ProjectCardProps {
  project: ProjectItem;
  index?: number;
  enableLayout?: boolean;
}

export function ProjectCard({
  project,
  index = 0,
  enableLayout = false,
}: ProjectCardProps) {
  const { locale, t } = useLocale();
  const localized = getLocalizedProjectCard(project, locale);

  return (
    <MotionCard
      as="article"
      interactive
      index={index}
      hoverY={-4}
      hoverScale={1.008}
      layout={enableLayout ? 'position' : undefined}
      className={`glass-card ${styles.projectCard}`}
    >
      <Link
        href={`/projects/${project.slug}`}
        className={styles.cardImageLink}
        aria-label={`${t.projects.caseStudyBtn}: ${localized.shortTitle}`}
        onClick={() =>
          trackEvent('project_detail_view', {
            project_slug: project.slug,
            is_featured: project.isFeatured,
          })
        }
      >
        <ProgressiveImage
          src={project.thumbnail.src}
          alt={project.thumbnail.alt}
          width={project.thumbnail.width}
          height={project.thumbnail.height}
          priority={false}
          wrapperClassName={styles.cardImageFrame}
          imageClassName={styles.cardImage}
        />
      </Link>

      <div className={styles.cardBody}>
        <div className={styles.cardMetaRow}>
          <span className={`glass-surface-subtle ${styles.statusInlineBadge}`}>
            {project.statusLabel.includes('Selesai') ? (
              <span className={styles.statusCompletedDot} aria-hidden="true" />
            ) : null}
            <span>{localized.primaryMetric}</span>
          </span>
          <span className={project.isFeatured ? styles.featuredYearBadge : styles.yearLabel}>
            {project.isFeatured ? `${t.projects.featuredPrefix} · ${project.year}` : project.year}
          </span>
        </div>

        <h3 className={styles.cardTitle}>
          <Link
            href={`/projects/${project.slug}`}
            onClick={() =>
              trackEvent('project_detail_view', {
                project_slug: project.slug,
                is_featured: project.isFeatured,
              })
            }
          >
            {localized.shortTitle}
          </Link>
        </h3>

        <p className={styles.cardSummary}>{localized.summary}</p>

        <div className={styles.cardFooter}>
          <ul className={styles.techTagList} aria-label={t.projects.techListAriaLabel}>
            {project.cardTags.slice(0, 3).map((tag) => (
              <li key={tag} className={`glass-surface-subtle ${styles.techTag}`}>
                {tag}
              </li>
            ))}
          </ul>

          <div className={styles.cardActionsRow}>
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.liveDemoMiniBtn}
              >
                <span>{t.projects.liveBtn}</span>
                <UiIcon name="arrow-up-right" size={16} opticalNudge />
              </a>
            ) : null}

            <Link
              href={`/projects/${project.slug}`}
              className={`accentPill ${styles.detailLinkBtn}`}
              onClick={() =>
                trackEvent('project_detail_view', {
                  project_slug: project.slug,
                  is_featured: project.isFeatured,
                })
              }
            >
              <span>{t.projects.caseStudyBtn}</span>
              <UiIcon name="arrow-up-right" size={16} opticalNudge />
            </Link>
          </div>
        </div>
      </div>
    </MotionCard>
  );
}
