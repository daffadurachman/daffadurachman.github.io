'use client';

import React, { useEffect, useRef, useState } from 'react';
import { PROFILE_DATA } from '@/data/profile';
import { trackEvent } from '@/lib/analytics';
import { useLocale } from '@/components/i18n/LocaleContext';
import { UiIcon } from '@/components/ui/UiIcon';
import styles from './CopyEmailButton.module.css';

interface CopyEmailButtonProps {
  location?: 'footer' | 'dock';
  variant?: 'light' | 'dark';
}

export function CopyEmailButton({
  location = 'footer',
  variant = 'light',
}: CopyEmailButtonProps) {
  const { t } = useLocale();
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle');
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    const email = PROFILE_DATA.email;
    let ok = false;

    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(email);
        ok = true;
      } catch {
        ok = false;
      }
    }
    if (!ok) {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = email;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        ok = document.execCommand('copy');
        document.body.removeChild(textArea);
      } catch {
        ok = false;
      }
    }

    setStatus(ok ? 'copied' : 'failed');
    trackEvent('email_copy_click', { email, location, success: ok });

    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      setStatus('idle');
      timerRef.current = null;
    }, 2400);
  };

  const copied = status === 'copied';

  return (
    <div className={styles.copyWrapper}>
      <button
        type="button"
        data-copy-email={PROFILE_DATA.email}
        className={`${styles.copyBtn} ${
          variant === 'dark' ? styles.copyBtnDark : styles.copyBtnLight
        } ${copied ? styles.copyBtnCopied : ''}`}
        onClick={handleCopy}
      >
        <span key={copied ? 'check' : 'copy'} className={styles.copyIconWrap}>
          <UiIcon name={copied ? 'check' : 'copy'} size={16} />
        </span>
        <span className={styles.copyLabel}>
          {copied
            ? t.footer.emailCopied
            : status === 'failed'
              ? `${t.footer.emailCopyManual} ${PROFILE_DATA.email}`
              : PROFILE_DATA.email}
        </span>
      </button>

      <span className={styles.srStatus} role="status" aria-live="polite">
        {copied
          ? `${PROFILE_DATA.email} ${t.footer.emailCopiedSr}`
          : status === 'failed'
            ? `${t.footer.emailFailedSr} ${PROFILE_DATA.email}`
            : ''}
      </span>
    </div>
  );
}
