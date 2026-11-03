'use client';

import React from 'react';
import type { ProjectMediaBlockItem } from '@/types/portfolio';
import { MotionCard } from '@/components/motion/MotionCard';
import { ProgressiveImage } from '@/components/ui/ProgressiveImage';
import styles from './Projects.module.css';

interface ProjectMediaBlockProps {
  block: ProjectMediaBlockItem;
}

export function ProjectMediaBlock({ block }: ProjectMediaBlockProps) {
  return (
    <figure className={styles.mediaBlock}>
      <div
        className={
          block.layout === 'two-col' ? styles.mediaGridTwoCol : styles.mediaGridFull
        }
      >
        {block.images.map((img, index) => (
          <MotionCard
            key={`${block.id}-${index}`}
            interactive
            hoverY={-3}
            hoverScale={1.006}
            index={index}
            className={`glass-card ${styles.mediaImageWrapper}`}
          >
            <ProgressiveImage
              src={img.src}
              alt={img.alt}
              width={img.width}
              height={img.height}
              wrapperClassName={styles.mediaProgressiveFrame}
              imageClassName={styles.mediaImage}
            />
          </MotionCard>
        ))}
      </div>
      <figcaption className={styles.mediaCaption}>{block.caption}</figcaption>
    </figure>
  );
}
