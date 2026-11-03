import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SplitWordHeading } from '@/components/motion/SplitWordHeading';
import { RevealSequence } from '@/components/motion/RevealSequence';
import { MotionCard } from '@/components/motion/MotionCard';
import { UiIcon } from '@/components/ui/UiIcon';
import styles from './not-found.module.css';

export default function NotFoundPage() {
  return (
    <div className="structuralOuterFrame">
      <Navbar />
      <main id="main-content" className={styles.notFoundMain}>
        <div className="structuralInnerContainer">
          <MotionCard revealMode="mount" className={`glass-card ${styles.notFoundInner}`}>
            <RevealSequence
              className={styles.notFoundSequence}
              trigger="mount"
              delay={0.06}
              stagger={0.14}
              duration={0.82}
            >
              <span className={`glass-surface-subtle ${styles.errorBadge}`} data-reveal-item="">
                <code className={styles.errorCode}>404</code>
                <span>Halaman Tidak Ditemukan</span>
              </span>
              <SplitWordHeading
                as="h1"
                className={styles.errorTitle}
                trigger="mount"
                delay={0.08}
                segments={[
                  { text: 'Tautan yang Anda buka', className: 'toneMuted', trailingSpace: true },
                  { text: 'tidak tersedia di situs ini.', className: 'tonePrimary' },
                ]}
              />
              <p className={styles.errorDescription} data-reveal-item="">
                Alamat URL ini mungkin sudah berubah atau keliru ketik. Kembali ke beranda untuk melihat
                daftar proyek, riwayat kerja, dan CV Daffa Hanif Durachman.
              </p>
              <Link href="/" className={styles.homeBtn} data-reveal-item="">
                <UiIcon name="arrow-left" size={16} opticalNudge />
                <span>Kembali ke Beranda</span>
              </Link>
            </RevealSequence>
          </MotionCard>
        </div>
      </main>
      <Footer />
    </div>
  );
}
