import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PROJECTS } from '@/data/projects';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProjectMediaBlock } from '@/components/projects/ProjectMediaBlock';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { InteractivePipelineFlow } from '@/components/projects/InteractivePipelineFlow';
import { CaseStudyDisclosure } from '@/components/projects/CaseStudyLayoutSync';
import { SplitWordHeading } from '@/components/motion/SplitWordHeading';
import { RevealSequence } from '@/components/motion/RevealSequence';
import { MotionCard } from '@/components/motion/MotionCard';
import { UiIcon } from '@/components/ui/UiIcon';
import styles from './page.module.css';

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return PROJECTS.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    return {
      title: 'Proyek Tidak Ditemukan | Daffa Hanif Durachman',
    };
  }

  return {
    title: `${project.shortTitle} | Studi Kasus Daffa Hanif Durachman`,
    description: project.summary,
    openGraph: {
      title: `${project.shortTitle} | Studi Kasus Daffa Hanif Durachman`,
      description: project.summary,
      type: 'article',
      locale: 'id_ID',
      images: [
        {
          url: '/images/og/og-default.png',
          width: 1200,
          height: 630,
          alt: project.shortTitle,
        },
      ],
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  const otherProjects = PROJECTS.filter((p) => p.slug !== project.slug).slice(0, 2);

  return (
    <div className="structuralOuterFrame">
      <Navbar />
      <main id="main-content" className={styles.caseStudyMain}>
        <div className="structuralInnerContainer">
          <RevealSequence trigger="mount" delay={0.04} stagger={0.12} duration={0.8}>
            <div className={styles.backNavRow} data-reveal-item="">
              <Link href="/#proyek" className={`glass-pill ${styles.backLinkPill}`}>
                <UiIcon name="arrow-left" size={16} opticalNudge />
                <span>Semua Proyek</span>
              </Link>
              <span className={`glass-pill ${styles.statusBadge}`}>
                {project.statusLabel.includes('Selesai') ? (
                  <span className={styles.statusDot} aria-hidden="true" />
                ) : null}
                <span>{project.statusLabel}</span>
              </span>
            </div>
          </RevealSequence>

          <header className={styles.caseHeader}>
            <SplitWordHeading
              as="h1"
              className={styles.caseTitle}
              trigger="mount"
              delay={0.06}
              segments={[{ text: project.shortTitle }]}
            />

            <RevealSequence trigger="mount" delay={0.18} stagger={0.14} duration={0.85}>
              <p className={styles.caseSummary} data-reveal-item="">
                {project.subtitle ?? project.summary}
              </p>

              <div
                className={`${styles.metaGrid} ${
                  project.achievementMeta ? styles.metaGridFour : ''
                }`}
              >
                <MotionCard
                  revealMode="mount"
                  interactive
                  hoverY={-2}
                  hoverScale={1.008}
                  index={0}
                  delayOffset={0.18}
                  className={`glass-card ${styles.metaCard}`}
                >
                  <span className={styles.metaLabel}>Peran</span>
                  <strong className={styles.metaValue}>{project.role}</strong>
                </MotionCard>
                <MotionCard
                  revealMode="mount"
                  interactive
                  hoverY={-2}
                  hoverScale={1.008}
                  index={1}
                  delayOffset={0.18}
                  className={`glass-card ${styles.metaCard}`}
                >
                  <span className={styles.metaLabel}>Kategori</span>
                  <strong className={styles.metaValue}>{project.category}</strong>
                </MotionCard>
                <MotionCard
                  revealMode="mount"
                  interactive
                  hoverY={-2}
                  hoverScale={1.008}
                  index={2}
                  delayOffset={0.18}
                  className={`glass-card ${styles.metaCard}`}
                >
                  <span className={styles.metaLabel}>Tahun</span>
                  <strong className={styles.metaValue}>{project.year}</strong>
                </MotionCard>
                {project.achievementMeta ? (
                  <MotionCard
                    revealMode="mount"
                    interactive
                    hoverY={-2}
                    hoverScale={1.008}
                    index={3}
                    delayOffset={0.18}
                    className={`glass-card ${styles.metaCard}`}
                  >
                    <span className={styles.metaLabel}>Capaian</span>
                    <strong className={styles.metaValue}>{project.achievementMeta}</strong>
                  </MotionCard>
                ) : null}
              </div>

              <div className={styles.repoBar} data-reveal-item="">
                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.primaryDemoBtn}
                  >
                    <span>Coba Aplikasi Live</span>
                    <UiIcon name="arrow-up-right" size={16} opticalNudge />
                  </a>
                ) : null}

                {project.repoUrl ? (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={
                      project.liveUrl
                        ? `accentPill ${styles.secondaryRepoBtn}`
                        : styles.primaryDemoBtn
                    }
                  >
                    <UiIcon name="github" size={16} />
                    <span>{project.repoButtonLabel ?? 'Lihat Kode di GitHub'}</span>
                    <UiIcon name="arrow-up-right" size={16} opticalNudge />
                  </a>
                ) : (
                  <span className={`glass-surface-subtle ${styles.disabledRepoPill}`}>
                    <UiIcon name="lock" size={16} />
                    <span>{project.repoStatusLabel}</span>
                  </span>
                )}
              </div>
            </RevealSequence>
          </header>

          <section className={styles.caseSection} aria-labelledby="section-problem-approach">
            <SplitWordHeading
              as="h2"
              id="section-problem-approach"
              className={styles.caseSectionHeading}
              segments={[
                { text: 'Uraian Masalah', className: 'toneMuted', trailingSpace: true },
                { text: '& Pendekatan.', className: 'tonePrimary' },
              ]}
            />

            <div className={styles.twoColContentGrid}>
              <MotionCard
                interactive
                hoverY={-2}
                hoverScale={1.004}
                index={0}
                className={`glass-card ${styles.contentCard}`}
              >
                <h3 className={styles.contentSubheading}>Latar Belakang Masalah</h3>
                <p className={styles.contentParagraph}>{project.problemStatement}</p>
              </MotionCard>

              <MotionCard
                interactive
                hoverY={-2}
                hoverScale={1.004}
                index={1}
                className={`glass-card ${styles.contentCard}`}
              >
                <h3 className={styles.contentSubheading}>
                  {project.approachHeading ?? 'Tahapan Teknis'}
                </h3>
                <p className={styles.contentParagraph}>{project.approachSummary}</p>
                <CaseStudyDisclosure className={`glass-surface-subtle ${styles.specDisclosure}`}>
                  <summary className={styles.specSummary}>
                    <span>Lihat {project.approachSteps.length} Langkah Teknis</span>
                    <UiIcon name="chevron-down" size={16} className={styles.disclosureChevron} />
                  </summary>
                  <ol className={styles.stepList}>
                    {project.approachSteps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </CaseStudyDisclosure>
              </MotionCard>
            </div>

            {project.pipelineNodes && project.pipelineNodes.length > 0 ? (
              <InteractivePipelineFlow nodes={project.pipelineNodes} />
            ) : null}

            {project.mediaBlocks.map((block) => (
              <ProjectMediaBlock key={block.id} block={block} />
            ))}
          </section>

          <section className={styles.caseSection} aria-labelledby="section-tech-results">
            <SplitWordHeading
              as="h2"
              id="section-tech-results"
              className={styles.caseSectionHeading}
              segments={[
                {
                  text: project.sectionTwoMutedHeading ?? 'Hasil ',
                  className: 'toneMuted',
                  trailingSpace: true,
                },
                {
                  text: project.sectionTwoPrimaryHeading ?? '& Evaluasi.',
                  className: 'tonePrimary',
                },
              ]}
            />

            {project.evaluationTable ? (
              <MotionCard className={`glass-card ${styles.evaluationBlock}`}>
                <h3 className={styles.contentSubheading}>{project.evaluationTable.heading}</h3>
                <div
                  className={`glass-surface-subtle ${styles.tableScrollContainer}`}
                  tabIndex={0}
                  role="region"
                  aria-label={project.evaluationTable.heading}
                >
                  <table className={styles.evaluationTable}>
                    <thead>
                      <tr>
                        {project.evaluationTable.columns.map((col) => (
                          <th key={col} scope="col">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {project.evaluationTable.rows.map((row, rowIndex) => (
                        <tr
                          key={row[0]}
                          className={rowIndex === 0 ? styles.topModelRow : undefined}
                        >
                          {row.map((cell, cellIndex) => (
                            <td
                              key={`${row[0]}-${cellIndex}`}
                              className={cellIndex > 0 ? styles.metricMonoCell : undefined}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {project.evaluationInsight ? (
                  <div className={`glass-surface-subtle ${styles.evaluationInsightBox}`}>
                    <strong>Temuan Evaluasi:</strong>{' '}
                    <span>{project.evaluationInsight}</span>
                  </div>
                ) : null}
              </MotionCard>
            ) : null}

            <div className={styles.twoColContentGrid}>
              <MotionCard
                interactive
                hoverY={-2}
                hoverScale={1.004}
                index={0}
                className={`glass-card ${styles.contentCard}`}
              >
                <h3 className={styles.contentSubheading}>
                  {project.resultsHeading ?? 'Evaluasi Hasil'}
                </h3>
                <div className={styles.resultsStack}>
                  {project.results.map((res, idx) => (
                    <div
                      key={res.metric}
                      className={`glass-surface-subtle ${styles.resultBox} ${
                        idx === 0 ? styles.resultBoxPrimary : ''
                      }`}
                    >
                      <strong className={styles.resultMetric}>{res.metric}</strong>
                      <p className={styles.resultDesc}>{res.description}</p>
                    </div>
                  ))}
                </div>
                {!project.evaluationTable && project.evaluationInsight ? (
                  <div className={`glass-surface-subtle ${styles.evaluationInsightBox}`}>
                    <strong>Temuan Evaluasi:</strong>{' '}
                    <span>{project.evaluationInsight}</span>
                  </div>
                ) : null}
              </MotionCard>

              <MotionCard
                interactive
                hoverY={-2}
                hoverScale={1.004}
                index={1}
                className={`glass-card ${styles.contentCard}`}
              >
                <h3 className={styles.contentSubheading}>Arsitektur &amp; Teknologi</h3>
                <div className={styles.techPillsRow}>
                  {project.techStack.map((tech) => (
                    <span key={tech.name} className={`glass-surface-subtle ${styles.techPillChip}`}>
                      {tech.name}
                    </span>
                  ))}
                </div>
                <CaseStudyDisclosure className={`glass-surface-subtle ${styles.specDisclosure}`}>
                  <summary className={styles.specSummary}>
                    <span>Lihat Rincian Peran Tiap Teknologi</span>
                    <UiIcon name="chevron-down" size={16} className={styles.disclosureChevron} />
                  </summary>
                  <ul className={styles.techBreakdownList}>
                    {project.techStack.map((tech) => (
                      <li key={tech.name} className={styles.techBreakdownItem}>
                        <strong className={styles.techCodeBadge}>{tech.name}</strong>
                        <span>{tech.purpose}</span>
                      </li>
                    ))}
                  </ul>
                </CaseStudyDisclosure>
              </MotionCard>
            </div>
          </section>

          <section className={styles.moreProjectsSection} aria-labelledby="more-projects-heading">
            <SplitWordHeading
              as="h2"
              id="more-projects-heading"
              className={styles.caseSectionHeading}
              segments={[
                { text: 'Studi kasus lain', className: 'toneMuted', trailingSpace: true },
                { text: 'yang terkait.', className: 'tonePrimary' },
              ]}
            />

            <div className={styles.moreProjectsGrid}>
              {otherProjects.map((other, idx) => (
                <ProjectCard key={other.slug} project={other} index={idx} />
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
