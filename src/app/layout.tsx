import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import '@/styles/globals.css';
import { PROFILE_DATA } from '@/data/profile';
import { SmoothScrollProvider } from '@/components/layout/SmoothScrollProvider';
import { LocaleProvider } from '@/components/i18n/LocaleContext';
import { CvModalProvider } from '@/components/cv/CvModalContext';
import { CertificateModalProvider } from '@/components/certificates/CertificateModalContext';
import { CommandPaletteProvider } from '@/components/command/CommandPaletteContext';
import { GlassSpotlightProvider } from '@/components/ui/GlassSpotlightProvider';
import { MotionProvider } from '@/components/motion/MotionProvider';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://daffadurachman.github.io'),
  title: 'Daffa Hanif Durachman | Software, Web & IT Support',
  description:
    'Portofolio Daffa Hanif Durachman, lulusan S1 Informatika Universitas Amikom Yogyakarta (IPK 3,31). Mengerjakan aplikasi web, pengolahan data Python, MySQL, Docker, Laravel, Flutter, serta perawatan PC dan jaringan LAN.',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'Daffa Hanif Durachman | Software, Web & IT Support',
    description:
      'Lulusan S1 Informatika Universitas Amikom Yogyakarta (IPK 3,31) dengan pengalaman pengembangan web, Python, perawatan laboratorium komputer, dan jaringan LAN.',
    type: 'website',
    locale: 'id_ID',
    images: [
      {
        url: '/images/og/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Portofolio Daffa Hanif Durachman',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Daffa Hanif Durachman | Software, Web & IT Support',
    description:
      'Lulusan S1 Informatika Universitas Amikom Yogyakarta (IPK 3,31) dengan fokus web, Python, dan IT Support.',
    images: ['/images/og/og-default.png'],
  },
};

const THEME_INIT_SCRIPT = `(function(){try{var k='portfolio-theme';var s=localStorage.getItem(k);var t=s==='dark'||s==='light'?s:(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t);document.documentElement.style.colorScheme=t;}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cfBeaconToken = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN?.trim();

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: PROFILE_DATA.name,
    jobTitle: PROFILE_DATA.roleTitle,
    email: PROFILE_DATA.email,
    telephone: PROFILE_DATA.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Sleman',
      addressRegion: 'DI Yogyakarta',
      addressCountry: 'ID',
    },
    alumniOf: [
      {
        '@type': 'CollegeOrUniversity',
        name: 'Universitas Amikom Yogyakarta',
      },
    ],
    sameAs: PROFILE_DATA.socials.map((s) => s.url),
  };

  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=switzer@400,500,600,800&display=swap"
        />
      </head>
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {cfBeaconToken ? (
          <Script
            id="cf-web-analytics"
            src="https://static.cloudflareinsights.com/beacon.min.js"
            strategy="afterInteractive"
            defer
            data-cf-beacon={JSON.stringify({ token: cfBeaconToken, spa: true })}
          />
        ) : null}
        <SmoothScrollProvider />
        <GlassSpotlightProvider />
        <a href="#main-content" className="skipLink">
          Lewati ke konten utama
        </a>
        <MotionProvider>
          <LocaleProvider>
            <CvModalProvider>
              <CertificateModalProvider>
                <CommandPaletteProvider>{children}</CommandPaletteProvider>
              </CertificateModalProvider>
            </CvModalProvider>
          </LocaleProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
