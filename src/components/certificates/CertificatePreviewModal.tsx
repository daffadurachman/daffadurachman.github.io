'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { CertificatePreviewPayload } from '@/types/portfolio';
import { trackEvent, withBasePath } from '@/lib/analytics';
import { useLocale } from '@/components/i18n/LocaleContext';
import { UiIcon } from '@/components/ui/UiIcon';
import styles from './CertificatePreviewModal.module.css';

interface CertificatePreviewModalProps {
  isOpen: boolean;
  certificate: CertificatePreviewPayload;
  onClose: () => void;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function CertificatePreviewModal({
  isOpen,
  certificate,
  onClose,
}: CertificatePreviewModalProps) {
  const { t } = useLocale();
  const [isRendered, setIsRendered] = useState(isOpen);
  const [isPdfLoading, setIsPdfLoading] = useState(true);
  const [pdfLoadTimedOut, setPdfLoadTimedOut] = useState(false);
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');

  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);
  const unmountTimerRef = useRef<number | null>(null);
  const pdfTimeoutRef = useRef<number | null>(null);
  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (unmountTimerRef.current !== null) {
        window.clearTimeout(unmountTimerRef.current);
        unmountTimerRef.current = null;
      }
      if (!isRendered) {
        previousActiveElementRef.current = document.activeElement as HTMLElement | null;
      }
      setIsRendered(true);
      setIsPdfLoading(true);
      setPdfLoadTimedOut(false);
      setCopyState('idle');
    } else if (isRendered) {
      unmountTimerRef.current = window.setTimeout(() => {
        setIsRendered(false);
        unmountTimerRef.current = null;
        previousActiveElementRef.current?.focus();
        previousActiveElementRef.current = null;
      }, 200);
    }

    return () => {
      if (unmountTimerRef.current !== null) {
        window.clearTimeout(unmountTimerRef.current);
      }
    };
  }, [isOpen, isRendered, certificate.id]);

  // Body & Lenis scroll lock + Focus Trap + Escape close
  useEffect(() => {
    if (!isOpen || !isRendered) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.dispatchEvent(new CustomEvent('portfolio:lenis-lock'));

    const rafId = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === 'Tab' && dialogRef.current) {
        const focusables = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        ).filter((el) => el.offsetParent !== null);

        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;

        if (event.shiftKey) {
          if (active === first || !dialogRef.current.contains(active)) {
            event.preventDefault();
            last.focus();
          }
        } else if (active === last || !dialogRef.current.contains(active)) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.cancelAnimationFrame(rafId);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
      window.dispatchEvent(new CustomEvent('portfolio:lenis-unlock'));
    };
  }, [isOpen, isRendered, onClose]);

  // Prevent mobile WebViews from hanging on embedded PDF loading state
  useEffect(() => {
    if (pdfTimeoutRef.current !== null) {
      window.clearTimeout(pdfTimeoutRef.current);
      pdfTimeoutRef.current = null;
    }

    if (isOpen && isPdfLoading) {
      pdfTimeoutRef.current = window.setTimeout(() => {
        setIsPdfLoading(false);
        setPdfLoadTimedOut(true);
      }, 2500);
    }

    return () => {
      if (pdfTimeoutRef.current !== null) {
        window.clearTimeout(pdfTimeoutRef.current);
      }
    };
  }, [isOpen, isPdfLoading, certificate.id]);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const handleCopyCredential = async () => {
    if (!certificate.credentialId) return;
    let ok = false;
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(certificate.credentialId);
        ok = true;
      } catch {
        ok = false;
      }
    }
    if (!ok) {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = certificate.credentialId;
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

    setCopyState(ok ? 'copied' : 'failed');
    trackEvent('certificate_id_copy', { certificate_id: certificate.id, success: ok });

    if (copyTimerRef.current !== null) {
      window.clearTimeout(copyTimerRef.current);
    }
    copyTimerRef.current = window.setTimeout(() => {
      setCopyState('idle');
      copyTimerRef.current = null;
    }, 2200);
  };

  if (!isRendered) return null;

  const resolvedPdfUrl = withBasePath(certificate.pdfUrl);
  const downloadFileName =
    certificate.fileName ?? certificate.pdfUrl.split('/').pop() ?? 'sertifikat.pdf';

  return (
    <div
      className={`${styles.modalBackdrop} ${!isOpen ? styles.modalBackdropClosing : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="certificate-preview-dialog-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className={`glass-card ${styles.modalDialog} ${!isOpen ? styles.modalDialogClosing : ''}`}
      >
        <header className={styles.modalHeader}>
          <div className={styles.titleBlock}>
            <div className={styles.badgeRow}>
              <span className={`glass-surface-subtle ${styles.verifiedBadge}`}>
                <UiIcon name="award" size={14} />
                <span>{t.certModal.verifiedBadge}</span>
              </span>
              <span className={styles.dateMeta}>{certificate.date}</span>
            </div>
            <h2 id="certificate-preview-dialog-title" className={styles.modalTitle}>
              {certificate.title}
            </h2>
            <p className={styles.modalIssuer}>{certificate.issuer}</p>
          </div>

          <div className={styles.headerActions}>
            <a
              href={resolvedPdfUrl}
              download={downloadFileName}
              className={styles.primaryDownloadBtn}
              onClick={() =>
                trackEvent('certificate_download_click', { certificate_id: certificate.id })
              }
            >
              <UiIcon name="download" size={16} opticalNudge />
              <span>{t.certModal.downloadPdf}</span>
            </a>

            <button
              ref={closeButtonRef}
              type="button"
              className={`glass-surface-subtle ${styles.closeModalBtn}`}
              aria-label={t.certModal.closeAriaLabel}
              onClick={onClose}
            >
              <UiIcon name="close" size={16} />
            </button>
          </div>
        </header>

        <div className={styles.modalBody}>
          {certificate.summary || certificate.credentialId ? (
            <div className={`glass-surface-subtle ${styles.metaStrip}`}>
              {certificate.summary ? (
                <p className={styles.summaryText}>{certificate.summary}</p>
              ) : null}

              {certificate.credentialId ? (
                <div className={styles.credentialRow}>
                  <span className={styles.credentialLabel}>
                    ID: <code className={styles.credentialCode}>{certificate.credentialId}</code>
                  </span>
                  <button
                    type="button"
                    className={`accentPill ${styles.copyIdBtn}`}
                    onClick={handleCopyCredential}
                  >
                    <UiIcon name={copyState === 'copied' ? 'check' : 'copy'} size={14} />
                    <span>
                      {copyState === 'copied'
                        ? t.certModal.copiedId
                        : copyState === 'failed'
                          ? t.certModal.copyFailed
                          : t.certModal.copyId}
                    </span>
                  </button>
                  <span className={styles.srOnly} role="status" aria-live="polite">
                    {copyState === 'copied' ? t.certModal.copiedSr : ''}
                  </span>
                </div>
              ) : null}
            </div>
          ) : null}

          <div className={`glass-surface-subtle ${styles.pdfFallbackBar}`}>
            <span className={styles.pdfFallbackNote}>
              {pdfLoadTimedOut
                ? t.certModal.pdfTimeoutNote
                : t.certModal.pdfOriginalNote}
            </span>
            <a
              href={resolvedPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`accentPill ${styles.openTabBtn}`}
            >
              <span>{t.certModal.openPdfTab}</span>
              <UiIcon name="arrow-up-right" size={14} opticalNudge />
            </a>
          </div>

          <div className={`glass-surface-subtle ${styles.pdfFrameContainer}`}>
            {isPdfLoading ? (
              <div className={styles.pdfLoadingOverlay} role="status" aria-live="polite">
                <div className={styles.pdfLoadingShimmer} aria-hidden="true" />
                <span className={styles.pdfLoadingLabel}>{t.certModal.pdfLoadingLabel}</span>
              </div>
            ) : null}
            <iframe
              key={certificate.id}
              src={resolvedPdfUrl}
              title={`${t.certModal.pdfIframePrefix} ${certificate.title}`}
              className={`${styles.pdfIframe} ${!isPdfLoading ? styles.pdfIframeLoaded : ''}`}
              onLoad={() => {
                setIsPdfLoading(false);
                setPdfLoadTimedOut(false);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
