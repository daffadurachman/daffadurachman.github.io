'use client';

import React from 'react';
import { trackEvent } from '@/lib/analytics';
import { useCvModal } from '@/components/cv/CvModalContext';
import { UiIcon } from '@/components/ui/UiIcon';
import styles from './CvPreviewModal.module.css';

interface CvActionGroupProps {
  onOpenPreview?: () => void;
  source?: 'hero' | 'modal' | 'navbar';
}

export function CvActionGroup({ onOpenPreview, source = 'hero' }: CvActionGroupProps) {
  const { openCvModal } = useCvModal();

  const handlePreviewClick = () => {
    trackEvent('cv_preview_open', { default_tab: 'html_summary', source });
    if (onOpenPreview) {
      onOpenPreview();
    } else {
      openCvModal();
    }
  };

  return (
    <div className={styles.actionGroup}>
      <button
        type="button"
        className={styles.primaryDownloadBtn}
        onClick={handlePreviewClick}
      >
        <UiIcon name="file-text" size={16} />
        <span>Review My CV</span>
      </button>
    </div>
  );
}
