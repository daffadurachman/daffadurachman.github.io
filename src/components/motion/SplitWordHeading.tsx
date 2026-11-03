'use client';

import React, { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { ensureGsapPlugins, MOTION_TIMING } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/appleSpring';
import styles from './SplitWordHeading.module.css';

export interface SplitWordSegment {
  text?: string;
  className?: string;
  asBlock?: boolean;
  trailingSpace?: boolean;
  children?: SplitWordSegment[];
  customWord?: React.ReactNode;
  srText?: string;
}

interface SplitWordHeadingProps {
  as?: 'h1' | 'h2' | 'h3';
  id?: string;
  className?: string;
  segments: SplitWordSegment[];
  trigger?: 'mount' | 'scroll';
  delay?: number;
  stagger?: number;
  duration?: number;
}

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function extractScreenReaderText(segments: SplitWordSegment[]): string {
  const parts: string[] = [];

  for (const seg of segments) {
    if (seg.children && seg.children.length > 0) {
      parts.push(extractScreenReaderText(seg.children));
    } else if (seg.srText) {
      parts.push(seg.srText.trim());
    } else if (seg.text) {
      parts.push(seg.text.trim());
    }
  }

  return parts.filter(Boolean).join(' ');
}

function buildStaticFingerprint(segments: SplitWordSegment[]): string {
  return segments
    .map((seg) => {
      if (seg.children && seg.children.length > 0) {
        return `[${buildStaticFingerprint(seg.children)}]`;
      }
      if (seg.customWord) return '<slot>';
      return seg.text ?? '';
    })
    .join('|');
}

export function SplitWordHeading({
  as = 'h2',
  id,
  className,
  segments,
  trigger = 'scroll',
  delay = 0,
  stagger = MOTION_TIMING.wordStagger,
  duration,
}: SplitWordHeadingProps) {
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const fullText = useMemo(() => extractScreenReaderText(segments), [segments]);
  const fingerprint = useMemo(() => buildStaticFingerprint(segments), [segments]);

  useIsomorphicLayoutEffect(() => {
    const el = headingRef.current;
    if (!el) return;

    const gsap = ensureGsapPlugins();
    const wordNodes = gsap.utils.toArray<HTMLElement>('[data-word-inner]', el);
    if (wordNodes.length === 0) return;

    if (prefersReducedMotion()) {
      gsap.set(wordNodes, { yPercent: 0, opacity: 1, clearProps: 'transform,willChange' });
      return;
    }

    const resolvedDuration =
      duration ??
      (trigger === 'mount' ? MOTION_TIMING.wordMountDuration : MOTION_TIMING.wordDuration);

    const ctx = gsap.context(() => {
      const tweenVars: gsap.TweenVars = {
        yPercent: 0,
        opacity: 1,
        duration: resolvedDuration,
        stagger,
        delay,
        ease: MOTION_TIMING.wordEase,
        clearProps: 'transform,willChange',
      };

      if (trigger === 'scroll') {
        tweenVars.scrollTrigger = {
          trigger: el,
          start: MOTION_TIMING.scrollTriggerStart,
          once: true,
        };
      }

      gsap.fromTo(
        wordNodes,
        {
          yPercent: 112,
          opacity: 0,
          willChange: 'transform, opacity',
        },
        tweenVars
      );
    }, headingRef);

    return () => {
      ctx.revert();
    };
  }, [fingerprint, trigger, delay, stagger, duration]);

  const renderSegments = (list: SplitWordSegment[], keyPrefix: string): React.ReactNode => {
    return list.map((seg, segIndex) => {
      const segKey = `${keyPrefix}-${segIndex}`;
      const needsTrailingSpace =
        Boolean(seg.trailingSpace) || Boolean(seg.text && /\s$/.test(seg.text));

      if (seg.children && seg.children.length > 0) {
        const inner = renderSegments(seg.children, segKey);
        const wrapperClass = [
          seg.asBlock ? styles.blockSegment : '',
          seg.className ?? '',
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <React.Fragment key={segKey}>
            <span className={wrapperClass || undefined}>{inner}</span>
            {!seg.asBlock && needsTrailingSpace ? ' ' : null}
          </React.Fragment>
        );
      }

      if (seg.customWord) {
        return (
          <React.Fragment key={segKey}>
            <span className={styles.wordMask}>
              <span className={styles.wordInner} data-word-inner="">
                {seg.customWord}
              </span>
            </span>
            {needsTrailingSpace ? ' ' : null}
          </React.Fragment>
        );
      }

      const words = (seg.text ?? '').trim().split(/\s+/).filter(Boolean);
      const spanClass = [
        seg.asBlock ? styles.blockSegment : '',
        seg.className ?? '',
      ]
        .filter(Boolean)
        .join(' ');

      return (
        <React.Fragment key={segKey}>
          <span className={spanClass || undefined}>
            {words.map((word, wordIdx) => (
              <React.Fragment key={`${segKey}-w-${wordIdx}`}>
                <span className={styles.wordMask}>
                  <span className={styles.wordInner} data-word-inner="">
                    {word}
                  </span>
                </span>
                {wordIdx < words.length - 1 ? ' ' : null}
              </React.Fragment>
            ))}
          </span>
          {!seg.asBlock && needsTrailingSpace ? ' ' : null}
        </React.Fragment>
      );
    });
  };

  const HeadingTag = as;

  return (
    <HeadingTag ref={headingRef} id={id} className={className}>
      <span className={styles.srOnly}>{fullText}</span>
      <span className={styles.visualTree} aria-hidden="true">
        {renderSegments(segments, 'seg')}
      </span>
    </HeadingTag>
  );
}
