'use client';

import React, { useEffect, useState } from 'react';
import { m, useReducedMotion, type HTMLMotionProps } from 'motion/react';
import { MOTION_TIMING } from '@/lib/gsap';

interface MotionCardProps {
  children: React.ReactNode;
  as?: 'article' | 'div';
  className?: string;
  index?: number;
  interactive?: boolean;
  hoverY?: number;
  hoverScale?: number;
  revealMode?: 'inView' | 'mount';
  layout?: boolean | 'position' | 'size' | 'preserve-aspect';
  delayOffset?: number;
}

export function MotionCard({
  children,
  as = 'div',
  className,
  index = 0,
  interactive = false,
  hoverY = -4,
  hoverScale = 1.008,
  revealMode = 'inView',
  layout,
  delayOffset = 0,
}: MotionCardProps) {
  const prefersReduced = useReducedMotion();
  const [supportsFineHover, setSupportsFineHover] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const sync = () => setSupportsFineHover(mq.matches);
    sync();
    mq.addEventListener?.('change', sync);
    return () => mq.removeEventListener?.('change', sync);
  }, []);

  const enterDelay = delayOffset + Math.min(index * 0.1, 0.36);

  const motionProps: HTMLMotionProps<'div'> = {
    className,
    layout,
    initial: prefersReduced
      ? { opacity: 0.01 }
      : { opacity: 0, y: 24, scale: 0.988 },
    transition: {
      duration: prefersReduced ? 0.18 : MOTION_TIMING.cardEnterDuration,
      delay: prefersReduced ? 0 : enterDelay,
      ease: MOTION_TIMING.cardEnterEase,
      layout: MOTION_TIMING.layoutSpring,
    },
  };

  if (revealMode === 'mount') {
    motionProps.animate = prefersReduced
      ? { opacity: 1 }
      : { opacity: 1, y: 0, scale: 1 };
  } else {
    motionProps.whileInView = prefersReduced
      ? { opacity: 1 }
      : { opacity: 1, y: 0, scale: 1 };
    motionProps.viewport = { once: true, amount: 0.06 };
  }

  if (interactive && supportsFineHover && !prefersReduced) {
    motionProps.whileHover = {
      y: hoverY,
      scale: hoverScale,
      transition: MOTION_TIMING.cardHoverSpring,
    };
    motionProps.whileTap = {
      scale: 0.992,
      transition: MOTION_TIMING.cardTapSpring,
    };
  }

  if (as === 'article') {
    return (
      <m.article {...(motionProps as HTMLMotionProps<'article'>)}>
        {children}
      </m.article>
    );
  }

  return <m.div {...motionProps}>{children}</m.div>;
}
