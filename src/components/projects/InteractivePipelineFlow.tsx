'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, m, useReducedMotion } from 'motion/react';
import type { ProjectPipelineNode } from '@/types/portfolio';
import { MOTION_TIMING, notifyLayoutShift } from '@/lib/gsap';
import { getLocalizedPipelineNodes } from '@/lib/i18n';
import { useLocale } from '@/components/i18n/LocaleContext';
import { MotionCard } from '@/components/motion/MotionCard';
import { UiIcon } from '@/components/ui/UiIcon';
import styles from './InteractivePipelineFlow.module.css';

interface InteractivePipelineFlowProps {
  nodes: ProjectPipelineNode[];
  heading?: string;
}

export function InteractivePipelineFlow({
  nodes,
  heading = 'Interactive System Pipeline',
}: InteractivePipelineFlowProps) {
  const { locale, t } = useLocale();
  const prefersReduced = useReducedMotion();
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const rafId = window.requestAnimationFrame(() => {
      notifyLayoutShift();
    });
    return () => window.cancelAnimationFrame(rafId);
  }, [selectedIndex, locale]);

  if (nodes.length === 0) return null;

  const localizedNodes = getLocalizedPipelineNodes(nodes, locale);
  const activeNode = localizedNodes[selectedIndex] ?? localizedNodes[0];

  return (
    <MotionCard className={`glass-card ${styles.pipelineCard}`}>
      <div className={styles.headerRow}>
        <div className={styles.titleWrap}>
          <UiIcon name="layers" size={16} className={styles.titleIcon} />
          <h3 className={styles.heading}>{heading}</h3>
        </div>
        <span className={styles.hintText}>{t.projects.pipelineHint}</span>
      </div>

      <div className={styles.nodesTrack} role="group" aria-label={heading}>
        {localizedNodes.map((node, index) => {
          const isActive = index === selectedIndex;
          return (
            <React.Fragment key={node.id}>
              <button
                type="button"
                className={`glass-surface-subtle ${styles.nodeBtn} ${
                  isActive ? styles.nodeBtnActive : ''
                }`}
                aria-pressed={isActive}
                onClick={() => setSelectedIndex(index)}
              >
                <span className={styles.stepCode}>{node.step}</span>
                <strong className={styles.nodeLabel}>{node.label}</strong>
                <span className={styles.nodeMetric}>{node.metric}</span>
              </button>
              {index < localizedNodes.length - 1 ? (
                <span className={styles.connectorArrow} aria-hidden="true">
                  →
                </span>
              ) : null}
            </React.Fragment>
          );
        })}
      </div>

      <div className={`glass-surface-subtle ${styles.inspectorBox}`} role="status" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={`${locale}-${activeNode.id}`}
            initial={prefersReduced ? { opacity: 0.01 } : { opacity: 0, y: 8 }}
            animate={prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: prefersReduced ? 0.14 : 0.22, ease: MOTION_TIMING.cardEnterEase }}
          >
            <div className={styles.inspectorTop}>
              <span className={styles.inspectorStepBadge}>
                {t.projects.pipelineStagePrefix} {activeNode.step} · {activeNode.label}
              </span>
              <strong className={styles.inspectorMetric}>{activeNode.metric}</strong>
            </div>
            <p className={styles.inspectorDetail}>{activeNode.detail}</p>
          </m.div>
        </AnimatePresence>
      </div>
    </MotionCard>
  );
}
