'use client';

import React, { useEffect, useRef, useState } from 'react';
import { PROFILE_DATA } from '@/data/profile';
import { trackEvent } from '@/lib/analytics';
import { UiIcon } from '@/components/ui/UiIcon';
import styles from './FloatingContactDock.module.css';

export function FloatingContactDock() {
  const [isPastHero, setIsPastHero] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const tickingRef = useRef(false);
  const copyTimerRef = useRef<number | null>(null);

  const isVisible = isPastHero && !isFooterVisible;

  useEffect(() => {
    setIsPastHero(window.scrollY >= 320);

    const footerEl = document.getElementById('kontak');
    let footerObserver: IntersectionObserver | null = null;
    if (footerEl && typeof IntersectionObserver !== 'undefined') {
      footerObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          setIsFooterVisible(Boolean(entry?.isIntersecting));
        },
        { threshold: 0.08 }
      );
      footerObserver.observe(footerEl);
    }

    const handleScroll = () => {
      if (!tickingRef.current) {
        tickingRef.current = true;
        window.requestAnimationFrame(() => {
          setIsPastHero(window.scrollY >= 320);
          tickingRef.current = false;
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      footerObserver?.disconnect();
      window.removeEventListener('scroll', handleScroll);
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const handleCopyEmail = async () => {
    let ok = false;
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(PROFILE_DATA.email);
        ok = true;
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = PROFILE_DATA.email;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        ok = document.execCommand('copy');
        document.body.removeChild(textArea);
      }
    } catch {
      ok = false;
    }

    setCopyState(ok ? 'copied' : 'failed');
    trackEvent('email_copy_click', { email: PROFILE_DATA.email, location: 'dock', success: ok });

    if (copyTimerRef.current !== null) {
      window.clearTimeout(copyTimerRef.current);
    }
    copyTimerRef.current = window.setTimeout(() => {
      setCopyState('idle');
      copyTimerRef.current = null;
    }, 2400);
  };

  const copied = copyState === 'copied';

  return (
    <aside
      className={`${styles.dockContainer} ${!isVisible ? styles.dockContainerHidden : ''}`}
      aria-label="Pintasan Kontak Cepat"
      aria-hidden={!isVisible ? 'true' : undefined}
      data-visible={isVisible ? 'true' : 'false'}
    >
      <div className={`glass-pill ${styles.dockPill}`}>
        <span className={styles.dockLabel} role="status" aria-live="polite">
          {copied ? 'Disalin' : copyState === 'failed' ? 'Cek Footer' : 'Kontak'}
        </span>

        <div className={styles.dockActions}>
          <button
            type="button"
            tabIndex={isVisible ? undefined : -1}
            className={`${styles.iconCirclePrimary} ${copied ? styles.iconCircleSuccess : ''}`}
            aria-label={`Salin alamat email ${PROFILE_DATA.email}`}
            title={`Salin email: ${PROFILE_DATA.email}`}
            onClick={handleCopyEmail}
          >
            <span key={copied ? 'check' : 'mail'} className={styles.dockIconWrap}>
              <UiIcon name={copied ? 'check' : 'mail'} size={16} />
            </span>
          </button>

          <a
            href={PROFILE_DATA.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={isVisible ? undefined : -1}
            className={`glass-surface-subtle ${styles.iconCircleSecondary}`}
            aria-label={`Hubungi via WhatsApp ${PROFILE_DATA.phone}`}
            title={`Chat WhatsApp: ${PROFILE_DATA.phone}`}
            onClick={() =>
              trackEvent('contact_click', { channel: 'whatsapp', location: 'dock' })
            }
          >
            <UiIcon name="arrow-up-right" size={16} opticalNudge />
          </a>
        </div>
      </div>
    </aside>
  );
}
