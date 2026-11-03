'use client';

import React from 'react';
import { notifyLayoutShift } from '@/lib/gsap';

interface CaseStudyDisclosureProps {
  className?: string;
  children: React.ReactNode;
}

export function CaseStudyDisclosure({ className, children }: CaseStudyDisclosureProps) {
  return (
    <details
      className={className}
      onToggle={() => {
        notifyLayoutShift();
      }}
    >
      {children}
    </details>
  );
}
