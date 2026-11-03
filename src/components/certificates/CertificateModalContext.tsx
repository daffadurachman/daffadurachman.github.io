'use client';

import React, { createContext, useCallback, useContext, useState } from 'react';
import dynamic from 'next/dynamic';
import type { CertificatePreviewPayload } from '@/types/portfolio';

const CertificatePreviewModal = dynamic(
  () =>
    import('@/components/certificates/CertificatePreviewModal').then(
      (mod) => mod.CertificatePreviewModal
    ),
  { ssr: false }
);

interface CertificateModalContextValue {
  openCertificateModal: (payload: CertificatePreviewPayload) => void;
  closeCertificateModal: () => void;
}

const CertificateModalContext = createContext<CertificateModalContextValue>({
  openCertificateModal: () => {},
  closeCertificateModal: () => {},
});

export function useCertificateModal(): CertificateModalContextValue {
  return useContext(CertificateModalContext);
}

export function CertificateModalProvider({ children }: { children: React.ReactNode }) {
  const [payload, setPayload] = useState<CertificatePreviewPayload | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  const openCertificateModal = useCallback((nextPayload: CertificatePreviewPayload) => {
    setPayload(nextPayload);
    setHasOpened(true);
    setIsOpen(true);
  }, []);

  const closeCertificateModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <CertificateModalContext.Provider value={{ openCertificateModal, closeCertificateModal }}>
      {children}
      {hasOpened && payload ? (
        <CertificatePreviewModal
          isOpen={isOpen}
          certificate={payload}
          onClose={closeCertificateModal}
        />
      ) : null}
    </CertificateModalContext.Provider>
  );
}
