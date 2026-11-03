'use client';

import React from 'react';
import { useLocale } from '@/components/i18n/LocaleContext';
import { UiIcon } from '@/components/ui/UiIcon';
import styles from './LocaleToggle.module.css';

interface LocaleToggleProps {
  className?: string;
  tabIndex?: number;
}

export function LocaleToggle({ className, tabIndex }: LocaleToggleProps) {
  const { locale, toggleLocale, t } = useLocale();

  return (
    <button
      type="button"
      className={`glass-surface-subtle ${styles.localeBtn} ${className ?? ''}`}
      onClick={toggleLocale}
      aria-label={t.nav.switchLocaleAria}
      title={t.nav.switchLocaleTitle}
      tabIndex={tabIndex}
      data-locale-toggle={locale}
    >
      <UiIcon name="globe" size={14} className={styles.globeIcon} />
      <span className={styles.localeCode}>{locale.toUpperCase()}</span>
    </button>
  );
}
