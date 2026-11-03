'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, m, useReducedMotion } from 'motion/react';
import { PROFILE_DATA } from '@/data/profile';
import { trackEvent } from '@/lib/analytics';
import { prefersReducedMotion } from '@/lib/appleSpring';
import { ensureGsapPlugins, MOTION_TIMING } from '@/lib/gsap';
import { useLocale } from '@/components/i18n/LocaleContext';
import { CopyEmailButton } from '@/components/contact/CopyEmailButton';
import { SplitWordHeading } from '@/components/motion/SplitWordHeading';
import { RevealSequence } from '@/components/motion/RevealSequence';
import { UiIcon } from '@/components/ui/UiIcon';
import styles from './Footer.module.css';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function Footer() {
  const { locale, t } = useLocale();
  const prefersReduced = useReducedMotion();
  const [wordIndex, setWordIndex] = useState(0);
  const wordsCount = t.footer.cyclingWords.length;
  const wordmarkRowRef = useRef<HTMLDivElement | null>(null);
  const wordmarkTextRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const interval = window.setInterval(() => {
      setWordIndex((prev) => (prev + 1) % wordsCount);
    }, 2800);
    return () => window.clearInterval(interval);
  }, [wordsCount]);

  useIsomorphicLayoutEffect(() => {
    const rowEl = wordmarkRowRef.current;
    const textEl = wordmarkTextRef.current;
    if (!rowEl || !textEl) return;

    const gsap = ensureGsapPlugins();
    if (prefersReducedMotion()) {
      gsap.set(textEl, { yPercent: 0, opacity: 1, clearProps: 'transform,willChange' });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        textEl,
        {
          yPercent: 26,
          opacity: 0.4,
          willChange: 'transform, opacity',
        },
        {
          yPercent: 0,
          opacity: 1,
          ease: 'none',
          clearProps: 'willChange',
          scrollTrigger: {
            trigger: rowEl,
            start: 'top 98%',
            end: 'bottom 90%',
            scrub: 0.85,
          },
        }
      );
    }, wordmarkRowRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer id="kontak" className={styles.footer} aria-labelledby="contact-heading">
      <div className="structuralInnerContainer">
        <div className={styles.ctaHeader}>
          <SplitWordHeading
            as="h2"
            id="contact-heading"
            className={styles.cyclingHeadline}
            segments={[
              {
                className: styles.headlineWhite,
                trailingSpace: true,
                children: [
                  {
                    text: t.footer.ctaPrefix,
                    trailingSpace: true,
                  },
                  {
                    srText: t.footer.cyclingWords[wordIndex],
                    trailingSpace: true,
                    customWord: (
                      <AnimatePresence mode="wait" initial={false}>
                        <m.span
                          key={`${t.footer.ctaPrefix}-${wordIndex}`}
                          className={styles.cyclingWord}
                          initial={prefersReduced ? { opacity: 0.01 } : { opacity: 0, y: 10 }}
                          animate={prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
                          exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -10 }}
                          transition={{
                            duration: prefersReduced ? 0.14 : 0.28,
                            ease: MOTION_TIMING.cardEnterEase,
                          }}
                        >
                          {t.footer.cyclingWords[wordIndex]}
                        </m.span>
                      </AnimatePresence>
                    ),
                  },
                ],
              },
              {
                text: t.footer.ctaSuffix,
                className: styles.headlineGray,
              },
            ]}
          />

          <RevealSequence delay={0.14} revealKey={locale}>
            <p className={styles.ctaSubtext} data-reveal-item="">
              {PROFILE_DATA.location} · {t.footer.subtextSuffix}
            </p>
          </RevealSequence>
        </div>

        <RevealSequence stagger={0.14} duration={0.88} revealKey={locale}>
          <div className={styles.channelsGrid}>
            <div className={styles.channelCol} data-reveal-item="">
              <span className={styles.channelLabel}>Email</span>
              <CopyEmailButton location="footer" variant="light" />
            </div>

            <div className={styles.channelCol} data-reveal-item="">
              <span className={styles.channelLabel}>{t.footer.whatsappLabel}</span>
              <a
                href={PROFILE_DATA.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`glass-pill-dark ${styles.footerGhostBtn}`}
                onClick={() =>
                  trackEvent('contact_click', { channel: 'whatsapp', location: 'footer' })
                }
              >
                <UiIcon name="message-circle" size={16} />
                <span>{t.footer.whatsappBtn}</span>
                <UiIcon name="arrow-up-right" size={16} opticalNudge />
              </a>
            </div>

            <div className={styles.channelCol} data-reveal-item="">
              <span className={styles.channelLabel}>{t.footer.profilesLabel}</span>
              <div className={styles.footerSocialPills}>
                {PROFILE_DATA.socials.map((soc) => (
                  <a
                    key={soc.label}
                    href={soc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`glass-pill-dark ${styles.footerSocialPill}`}
                    onClick={() =>
                      trackEvent('contact_click', {
                        channel: soc.label.toLowerCase(),
                        location: 'footer',
                      })
                    }
                  >
                    <span>{soc.label}</span>
                    <UiIcon name="arrow-up-right" size={14} opticalNudge />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.copyrightBar} data-reveal-item="">
            <div className={styles.copyrightNav}>
              <Link href="/#proyek" className={styles.footerNavLink}>
                {t.nav.projects}
              </Link>
              <Link href="/#pengalaman" className={styles.footerNavLink}>
                {t.nav.experience}
              </Link>
              <Link href="/#keahlian" className={styles.footerNavLink}>
                {t.nav.skills}
              </Link>
            </div>
            <div className={styles.copyrightMeta}>
              <span className={styles.copyrightYear}>
                © {new Date().getFullYear()} {PROFILE_DATA.name}
              </span>
              <Link href="/#beranda" className={styles.backToTopLink}>
                <span>{t.footer.backToTop}</span>
                <UiIcon name="arrow-up" size={16} opticalNudge />
              </Link>
            </div>
          </div>
        </RevealSequence>

        <div ref={wordmarkRowRef} className={styles.wordmarkRow} aria-hidden="true">
          <span ref={wordmarkTextRef} className={styles.giantWordmark}>
            DAFFA
          </span>
        </div>
      </div>
    </footer>
  );
}
