'use client';

import React, { createContext, useCallback, useContext, useState } from 'react';
import dynamic from 'next/dynamic';

const CvPreviewModal = dynamic(
  () => import('@/components/cv/CvPreviewModal').then((mod) => mod.CvPreviewModal),
  { ssr: false }
);

interface CvModalContextValue {
  openCvModal: () => void;
  closeCvModal: () => void;
}

const CvModalContext = createContext<CvModalContextValue>({
  openCvModal: () => {},
  closeCvModal: () => {},
});

export function useCvModal(): CvModalContextValue {
  return useContext(CvModalContext);
}

export function CvModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  const openCvModal = useCallback(() => {
    setHasOpened(true);
    setIsOpen(true);
  }, []);

  const closeCvModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <CvModalContext.Provider value={{ openCvModal, closeCvModal }}>
      {children}
      {hasOpened ? <CvPreviewModal isOpen={isOpen} onClose={closeCvModal} /> : null}
    </CvModalContext.Provider>
  );
}
