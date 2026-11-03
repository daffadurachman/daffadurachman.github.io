'use client';

import React from 'react';
import { LazyMotion, MotionConfig, domMax } from 'motion/react';

interface MotionProviderProps {
  children: React.ReactNode;
}

export function MotionProvider({ children }: MotionProviderProps) {
  return (
    <LazyMotion features={domMax} strict>
      <MotionConfig
        reducedMotion="user"
        transition={{
          type: 'spring',
          visualDuration: 0.4,
          bounce: 0,
        }}
      >
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
