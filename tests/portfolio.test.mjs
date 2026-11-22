import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function walkFiles(dir, exts) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkFiles(full, exts));
    } else if (exts.some((ext) => full.endsWith(ext))) {
      results.push(full);
    }
  }
  return results;
}

test('Static export config, public docs, and every referenced asset exist', () => {
  const nextConfig = read('next.config.mjs');
  assert.ok(nextConfig.includes("output: 'export'"), 'next.config.mjs must enable static export');
  assert.ok(nextConfig.includes('unoptimized: true'), 'next.config.mjs must set images.unoptimized: true');

  assert.ok(
    fs.existsSync('public/docs/CV_Daffa_Hanif_Durachman_ID_Edited.pdf'),
    'Official CV PDF must exist in public/docs/'
  );
  assert.ok(
    fs.existsSync('public/docs/Sertifikat_Staf_Laboratorium_Amikom_Daffa_Hanif.pdf'),
    'Amikom Lab certificate PDF must exist in public/docs/'
  );
  assert.ok(
    fs.existsSync('public/docs/Sertifikat_CCNAv7_Introduction_to_Networks_Daffa_Hanif.pdf'),
    'CCNAv7 certificate PDF must exist in public/docs/'
  );
  assert.ok(
    fs.existsSync('public/docs/Sertifikat_BPS_Regsosek_Sleman_Daffa_Hanif.pdf'),
    'BPS Regsosek certificate PDF must exist in public/docs/'
  );

  for (const file of walkFiles('src', ['.ts', '.tsx'])) {
    const content = read(file);
    for (const match of content.matchAll(/['"](\/(?:images|docs)\/[^'"]+)['"]/g)) {
      const publicPath = path.join('public', match[1]);
      assert.ok(fs.existsSync(publicPath), `Asset referenced in ${file} is missing: ${publicPath}`);
    }
  }
});

test('CV facts across profile, experiences, skills, and projects remain accurate', () => {
  const profileTs = read('src/data/profile.ts');
  for (const fact of [
    'Daffa Hanif Durachman',
    'Sleman, Yogyakarta',
    '085156699164',
    'daffa.hanif6666@gmail.com',
    'Universitas Amikom Yogyakarta',
    '3,31',
    'SMK Tamansiswa Jetis',
    '85,5',
    'Open to work - siap on site maupun remote',
    'CCNAv7: Introduction to Networks',
    '2b8abaae-2b3d-47d2-a2f1-c30893c7b04f',
    'https://www.linkedin.com/in/daffa-hanif-03b8a21ba/',
    'https://id.jobstreet.com/profiles/daffa-hanif-xfg2bkl523',
  ]) {
    assert.ok(profileTs.includes(fact), `profile.ts missing CV fact: ${fact}`);
  }

  const expData = read('src/data/experiences.ts');
  for (const fact of [
    'Universitas Amikom Yogyakarta',
    'ShopeeXpress Hub Depok',
    'BPS Kabupaten Sleman',
    'PT MNJ (Distributor Resmi PT Konimex)',
    'PT Kanisius',
    'IMDKOM',
    '014/UPT/LAB/SS/IX/2026',
    'Sertifikat_BPS_Regsosek_Sleman_Daffa_Hanif.pdf',
    '250 data keluarga valid',
    '100% target',
  ]) {
    assert.ok(expData.includes(fact), `experiences.ts missing CV fact: ${fact}`);
  }

  const skillsData = read('src/data/skills.ts');
  assert.ok(!skillsData.includes("certificateUrl: '#'"), 'skills.ts must not contain broken # links');
  assert.ok(!skillsData.includes('BNSP'), 'skills.ts must not include unverified BNSP entry');
  assert.ok(skillsData.includes("category: 'learning'"), 'skills.ts must include learning category for Laravel and Flutter');
  for (const skill of ['Python', 'HTML', 'CSS', 'MySQL', 'Git', 'Docker', 'Figma', 'Antigravity', 'Laravel', 'Flutter']) {
    assert.ok(skillsData.includes(skill), `skills.ts missing skill: ${skill}`);
  }

  const projectsData = read('src/data/projects.ts');
  for (const fact of [
    'klasifikasi-ikan-resnet50-gradcam',
    'klasifikasi-alkohol-spark-mllib',
    'deteksi-apd-konstruksi-yolov12',
    'Grade A (Mata Kuliah Big Data & Data Mining)',
    'Grade A · Selesai',
    'https://github.com/daffahanif6/ResNet50-fish-classifier-Adam-gradcam.git',
    'https://klasifikasiikan.streamlit.app/',
  ]) {
    assert.ok(projectsData.includes(fact), `projects.ts missing project fact: ${fact}`);
  }

  for (const copyFile of [
    'src/data/profile.ts',
    'src/data/projects.ts',
    'src/data/experiences.ts',
    'src/data/skills.ts',
    'src/components/layout/Footer.tsx',
    'src/app/not-found.tsx',
  ]) {
    assert.ok(!read(copyFile).includes('—'), `${copyFile} must avoid em-dash (—) prose tells`);
  }
});

test('Core UI contracts, accessibility attributes, and zero hardcoded CSS colors remain intact', () => {
  const modalTsx = read('src/components/cv/CvPreviewModal.tsx');
  assert.ok(modalTsx.includes('role="dialog"') && modalTsx.includes('aria-modal="true"'));
  assert.ok(modalTsx.includes('Escape') && modalTsx.includes('EXPERIENCES'));
  assert.ok(modalTsx.includes('portfolio:lenis-lock') && modalTsx.includes('role="tabpanel"'));

  const deckTsx = read('src/components/experience/ExperienceDeckSection.tsx');
  assert.ok(deckTsx.includes('aria-expanded') && deckTsx.includes('aria-controls="extra-experience-list"'));

  const copyBtn = read('src/components/contact/CopyEmailButton.tsx');
  assert.ok(copyBtn.includes('navigator.clipboard') && copyBtn.includes('aria-live="polite"'));
  assert.ok(!copyBtn.includes('mailto:'));

  const cvActionTsx = read('src/components/cv/CvActionGroup.tsx');
  assert.ok(cvActionTsx.includes('Review My CV'), 'CvActionGroup must render single Review My CV button');
  assert.ok(!cvActionTsx.includes('Unduh CV'), 'CvActionGroup must not render redundant Unduh CV button');

  const profileSkillsTsx = read('src/components/profile/ProfileAndSkillsSection.tsx');
  for (const heading of [
    'Certifications',
    'Tech Stack &amp; Tools',
    'Development &amp; Data',
    'Tools &amp; Workflow',
    'Currently Learning',
  ]) {
    assert.ok(profileSkillsTsx.includes(heading), `ProfileAndSkillsSection missing heading: ${heading}`);
  }

  const footerTsx = read('src/components/layout/Footer.tsx');
  assert.ok(!footerTsx.includes('cv_download_click'), 'Footer must not render redundant CV download button');

  const navTsx = read('src/components/layout/Navbar.tsx');
  assert.ok(navTsx.includes('/images/profile/daffa-avatar-96.webp') && navTsx.includes('UiIcon'));
  assert.ok(navTsx.includes('leadingSpacer') && navTsx.includes('scrollStreakRef'));

  const navCss = read('src/components/layout/Navbar.module.css');
  assert.ok(!navCss.includes('display: none !important'), 'Navbar must collapse smoothly without display: none snap');
  assert.ok(!navCss.includes('font-weight: 550'), 'Navbar must not use unloaded weight 550');
  assert.ok(navCss.includes('prefers-reduced-motion: reduce'), 'Navbar.module.css must respect reduced motion');

  const smoothTsx = read('src/components/layout/SmoothScrollProvider.tsx');
  assert.ok(smoothTsx.includes('lerp:') && smoothTsx.includes('stopInertiaOnNavigate: true'));

  const detailPage = read('src/app/projects/[slug]/page.tsx');
  assert.ok(detailPage.includes('generateStaticParams') && detailPage.includes('generateMetadata'));
  assert.ok(!detailPage.includes('aria-disabled'), 'Non-interactive span must not carry aria-disabled');

  const tokensCss = read('src/styles/tokens.css');
  for (const decl of [
    '--color-porcelain: #F2F0EB;',
    '--color-burgundy: #6E2F36;',
    '--color-amoled-black: #000000;',
    '--color-status-available: #21b30b;',
    '--radius-card-outer: 20px;',
    '--glass-blur: blur(15px);',
    '--glass-radius: 20px;',
    '--text-display:',
    '--text-body:',
  ]) {
    assert.ok(tokensCss.includes(decl), `tokens.css missing ${decl}`);
  }

  // Ensure zero hardcoded hex/rgba literals in CSS modules or dark theme block
  const darkBlock = tokensCss.split(":root[data-theme='dark']")[1] || '';
  assert.ok(!/#[0-9a-fA-F]{3,8}|rgba?\(/.test(darkBlock), 'Dark theme block must use primitive CSS variables only');

  for (const cssFile of walkFiles('src', ['.module.css'])) {
    const css = read(cssFile);
    assert.ok(!/#[0-9a-fA-F]{3,8}|rgba?\(/.test(css), `Hardcoded color found in ${cssFile}`);
    assert.ok(!/box-shadow:\s*none\s*,/.test(css), `Invalid IACVT box-shadow in ${cssFile}`);
    assert.ok(!css.includes('font-weight: 550'), `Unloaded font-weight 550 in ${cssFile}`);
  }

  const globalsCss = read('src/styles/globals.css');
  assert.ok(globalsCss.includes(':focus-visible') && globalsCss.includes('prefers-reduced-motion: reduce'));
  assert.ok(globalsCss.includes('.toneMuted') && globalsCss.includes('.accentPill'));
  assert.ok(globalsCss.includes('.glass-card') && globalsCss.includes('.glass-surface-subtle') && globalsCss.includes('.glass-pill'));
  assert.ok(globalsCss.includes('prefers-reduced-transparency: reduce'));

  const gitignore = read('.gitignore');
  for (const pattern of [
    '.antigravity/',
    '.freebuff/',
    '.impeccable/',
    '.superpowers/',
    'ai-setup/',
    'ai-*',
    'prompts/',
    '/docs/',
    'DESIGN.md',
    '*.draft.md',
  ]) {
    assert.ok(gitignore.includes(pattern), `.gitignore missing exclusion rule: ${pattern}`);
  }
});

test('Interactive IT portfolio upgrades satisfy architecture, accessibility, and static-export contracts', () => {
  // Task 1: In-Page Certificate Preview Modal
  const certModal = read('src/components/certificates/CertificatePreviewModal.tsx');
  assert.ok(certModal.includes('role="dialog"') && certModal.includes('aria-modal="true"'));
  assert.ok(certModal.includes('Escape') && certModal.includes('portfolio:lenis-lock') && certModal.includes('portfolio:lenis-unlock'));
  assert.ok(certModal.includes('navigator.clipboard') && certModal.includes("execCommand('copy')"));
  assert.ok(certModal.includes('2500') && certModal.includes('openPdfTab'));

  const expTsx = read('src/components/experience/ExperienceDeckSection.tsx');
  const profileTsx = read('src/components/profile/ProfileAndSkillsSection.tsx');
  assert.ok(expTsx.includes('openCertificateModal'), 'ExperienceDeckSection must open in-page certificate modal');
  assert.ok(profileTsx.includes('openCertificateModal'), 'ProfileAndSkillsSection must open in-page certificate modal');

  // Task 2: Global Command Palette (Ctrl+K / Cmd+K)
  const cmdCtx = read('src/components/command/CommandPaletteContext.tsx');
  assert.ok(cmdCtx.includes("toLowerCase() === 'k'") && cmdCtx.includes('metaKey') && cmdCtx.includes('ctrlKey'));
  assert.ok(cmdCtx.includes('isContentEditable') && cmdCtx.includes('TEXTAREA'));

  const cmdModal = read('src/components/command/CommandPaletteModal.tsx');
  assert.ok(cmdModal.includes('role="dialog"') && cmdModal.includes('role="combobox"') && cmdModal.includes('role="listbox"'));
  assert.ok(cmdModal.includes('aria-activedescendant') && cmdModal.includes('ArrowDown') && cmdModal.includes('ArrowUp'));
  assert.ok(cmdModal.includes('requestAnimationFrame'), 'CommandPalette must defer launching nested modal until after closing');

  const cmdCss = read('src/components/command/CommandPaletteModal.module.css');
  assert.ok(
    cmdCss.includes('.searchInput:focus-visible') && cmdCss.includes('.searchBar:focus-within'),
    'CommandPaletteModal search input must replace harsh square outline with seamless bar focus styling'
  );

  const navTsxCheck = read('src/components/layout/Navbar.tsx');
  assert.ok(navTsxCheck.includes('openCommandPalette'), 'Navbar must render Command Palette trigger');

  // Task 3: Interactive Project Pipeline Flow
  const projectsTsCheck = read('src/data/projects.ts');
  assert.ok((projectsTsCheck.match(/pipelineNodes:/g) || []).length === 3, 'All 3 projects must define pipelineNodes');
  const pipelineTsx = read('src/components/projects/InteractivePipelineFlow.tsx');
  assert.ok(pipelineTsx.includes('aria-pressed') && pipelineTsx.includes('role="status"'));

  // Task 4: IT Support & Network Field Runbook Caselets
  const runbooksTs = read('src/data/runbooks.ts');
  assert.ok(!runbooksTs.includes('—'), 'runbooks.ts must avoid em-dash (—)');
  assert.ok(runbooksTs.includes('Amikom') && runbooksTs.includes('CCNAv7') && runbooksTs.includes('BPS'));
  const runbookTsx = read('src/components/experience/RunbookCaselets.tsx');
  assert.ok(runbookTsx.includes('role="tablist"') && runbookTsx.includes('role="tabpanel"') && runbookTsx.includes('openCertificateModal'));

  // RoleLensBar intentionally removed from Hero per user preference
  const heroTsxCheck = read('src/components/hero/HeroSection.tsx');
  assert.ok(!heroTsxCheck.includes('RoleLensBar'), 'HeroSection must not render removed RoleLensBar');

  // Task 6: Desktop-Only Cursor Specular Spotlight
  const spotlightTsx = read('src/components/ui/GlassSpotlightProvider.tsx');
  assert.ok(spotlightTsx.includes('(hover: hover) and (pointer: fine)') && spotlightTsx.includes('prefers-reduced-motion: reduce'));
  const tokensForSpotlight = read('src/styles/tokens.css');
  assert.ok(tokensForSpotlight.includes('--glass-cursor-glow:'));
  const globalsForSpotlight = read('src/styles/globals.css');
  assert.ok(globalsForSpotlight.includes('data-spotlight') && globalsForSpotlight.includes('(hover: hover) and (pointer: fine)'));

  // Task 7: Lightweight Client-Side Bilingual Switcher (ID | EN)
  const i18nTs = read('src/lib/i18n.ts');
  assert.ok(!i18nTs.includes('—'), 'src/lib/i18n.ts must avoid em-dash (—)');
  assert.ok(i18nTs.includes("export type PortfolioLocale = 'id' | 'en'"), 'i18n.ts must export PortfolioLocale');
  assert.ok(i18nTs.includes('Buka PDF di Tab Baru') && i18nTs.includes('Open PDF in New Tab'), 'i18n.ts must define ID and EN PDF fallback labels');
  for (const sectionKey of ['nav:', 'hero:', 'projects:', 'experience:', 'runbook:', 'profile:', 'footer:', 'cvModal:', 'certModal:', 'cmdPalette:']) {
    const matches = i18nTs.match(new RegExp(sectionKey, 'g')) || [];
    assert.ok(matches.length >= 2, `i18n.ts must define ${sectionKey} for both id and en locales`);
  }

  const localeCtx = read('src/components/i18n/LocaleContext.tsx');
  assert.ok(localeCtx.includes("useState<PortfolioLocale>('id')"), 'LocaleContext must initialize SSR-safe default id');
  assert.ok(localeCtx.includes('portfolio-locale') && localeCtx.includes('document.documentElement.lang'));

  const localeToggle = read('src/components/ui/LocaleToggle.tsx');
  assert.ok(localeToggle.includes('data-locale-toggle') && localeToggle.includes('useLocale'));
  assert.ok(fs.existsSync('src/components/ui/LocaleToggle.module.css'), 'LocaleToggle.module.css must exist');

  const layoutTsx = read('src/app/layout.tsx');
  assert.ok(layoutTsx.includes('LocaleProvider'), 'layout.tsx must wrap app with LocaleProvider');
  assert.ok(navTsxCheck.includes('LocaleToggle'), 'Navbar must render LocaleToggle');
});

test('Static export build outputs complete HTML, SEO routes, and project detail pages', () => {
  for (const outFile of [
    'out/index.html',
    'out/404.html',
    'out/sitemap.xml',
    'out/robots.txt',
    'out/projects/klasifikasi-ikan-resnet50-gradcam.html',
    'out/projects/klasifikasi-alkohol-spark-mllib.html',
    'out/projects/deteksi-apd-konstruksi-yolov12.html',
  ]) {
    assert.ok(fs.existsSync(outFile), `Expected static build output missing: ${outFile}`);
  }

  const indexHtml = read('out/index.html');
  assert.ok(indexHtml.includes('<title>Daffa Hanif Durachman'));
  assert.ok(indexHtml.includes('property="og:title"'));
  assert.ok(indexHtml.includes('og-default.png'));
  assert.ok(indexHtml.includes('Lewati ke konten utama'));
});

test('Unified motion architecture (GSAP + ScrollTrigger + Motion + Lenis) satisfies contracts', () => {
  const pkg = JSON.parse(read('package.json'));
  assert.ok(pkg.dependencies.gsap, 'package.json must depend on gsap');
  assert.ok(pkg.dependencies.motion, 'package.json must depend on motion');
  assert.ok(pkg.dependencies.lenis, 'package.json must depend on lenis');
  assert.ok(!pkg.dependencies.animejs, 'package.json must not retain unused animejs');

  const smoothTsx = read('src/components/layout/SmoothScrollProvider.tsx');
  assert.ok(smoothTsx.includes('gsap.ticker.add') && smoothTsx.includes('gsap.ticker.lagSmoothing(0)'));
  assert.ok(smoothTsx.includes('ScrollTrigger.update') && smoothTsx.includes('autoRaf: false'));

  const splitHeadingTsx = read('src/components/motion/SplitWordHeading.tsx');
  assert.ok(splitHeadingTsx.includes('gsap.context') && splitHeadingTsx.includes('scrollTrigger'));
  assert.ok(splitHeadingTsx.includes('prefersReducedMotion'));

  const revealSeqTsx = read('src/components/motion/RevealSequence.tsx');
  assert.ok(revealSeqTsx.includes('gsap.context') && revealSeqTsx.includes('data-reveal-item'));

  const motionProviderTsx = read('src/components/motion/MotionProvider.tsx');
  assert.ok(motionProviderTsx.includes('LazyMotion') && motionProviderTsx.includes('reducedMotion="user"'));

  const motionCardTsx = read('src/components/motion/MotionCard.tsx');
  assert.ok(motionCardTsx.includes('whileInView') && motionCardTsx.includes('once: true'));
  assert.ok(motionCardTsx.includes('(hover: hover) and (pointer: fine)'));

  const projectsCss = read('src/components/projects/Projects.module.css');
  assert.ok(!projectsCss.includes('transform: translateY(-2px)'), 'Projects.module.css must let Motion own outer card transform');
});

test('GitHub Pages deployment workflow and canonical daffadurachman.github.io URLs are configured', () => {
  const expectedOrigin = 'https://daffadurachman.github.io';

  for (const seoFile of ['src/app/layout.tsx', 'src/app/robots.ts', 'src/app/sitemap.ts']) {
    const content = read(seoFile);
    assert.ok(content.includes(expectedOrigin), `${seoFile} must reference ${expectedOrigin}`);
    assert.ok(!content.includes('daffahand.github.io'), `${seoFile} must not contain stale daffahand.github.io URL`);
  }

  assert.ok(fs.existsSync('public/.nojekyll'), 'public/.nojekyll must exist for GitHub Pages _next assets');
  assert.ok(fs.existsSync('out/.nojekyll'), 'out/.nojekyll must be emitted in static export');

  const outRobots = read('out/robots.txt');
  const outSitemap = read('out/sitemap.xml');
  assert.ok(outRobots.includes(`${expectedOrigin}/sitemap.xml`), 'out/robots.txt must point to daffadurachman.github.io sitemap');
  assert.ok(outSitemap.includes(expectedOrigin), 'out/sitemap.xml must use daffadurachman.github.io URLs');

  assert.ok(fs.existsSync('.github/workflows/deploy.yml'), 'GitHub Pages deploy workflow must exist');
  const workflow = read('.github/workflows/deploy.yml');
  for (const snippet of [
    'branches: [main]',
    'pages: write',
    'id-token: write',
    'npm ci',
    'npm run build',
    'actions/configure-pages@v5',
    'actions/upload-pages-artifact@v3',
    'path: ./out',
    'actions/deploy-pages@v4',
  ]) {
    assert.ok(workflow.includes(snippet), `.github/workflows/deploy.yml missing required directive: ${snippet}`);
  }
});

test('Cloudflare Web Analytics integration is zero-cookie, env-guarded, and SSR-safe', async () => {
  const layoutTsx = read('src/app/layout.tsx');
  assert.ok(layoutTsx.includes("from 'next/script'"), 'layout.tsx must import Script from next/script');
  assert.ok(layoutTsx.includes('NEXT_PUBLIC_CF_BEACON_TOKEN'), 'layout.tsx must guard beacon on NEXT_PUBLIC_CF_BEACON_TOKEN');
  assert.ok(
    layoutTsx.includes('https://static.cloudflareinsights.com/beacon.min.js'),
    'layout.tsx must load Cloudflare Web Analytics beacon.min.js'
  );
  assert.ok(layoutTsx.includes('strategy="afterInteractive"'), 'layout.tsx must use afterInteractive loading strategy');
  assert.ok(layoutTsx.includes('data-cf-beacon'), 'layout.tsx must pass data-cf-beacon attribute');
  assert.ok(layoutTsx.includes('spa: true'), 'layout.tsx must enable SPA route tracking in data-cf-beacon');
  assert.ok(!layoutTsx.includes('googletagmanager.com/gtag/js'), 'layout.tsx must not retain cookie-based gtag.js');

  const outHtml = read('out/index.html');
  if (process.env.NEXT_PUBLIC_CF_BEACON_TOKEN?.trim()) {
    assert.ok(
      outHtml.includes('static.cloudflareinsights.com/beacon.min.js'),
      'out/index.html must reference beacon.min.js when NEXT_PUBLIC_CF_BEACON_TOKEN is set'
    );
  } else {
    assert.ok(
      !outHtml.includes('static.cloudflareinsights.com/beacon.min.js') && !outHtml.includes('data-cf-beacon'),
      'out/index.html must omit Cloudflare beacon when NEXT_PUBLIC_CF_BEACON_TOKEN is unset'
    );
  }

  const transpiled = ts.transpileModule(read('src/lib/analytics.ts'), {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;

  const analyticsModule = await import(
    `data:text/javascript;base64,${Buffer.from(transpiled, 'utf8').toString('base64')}`
  );
  const { isAnalyticsEnabled, trackEvent, trackDownloadCV, trackExternalLink, withBasePath } = analyticsModule;

  const prevToken = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;
  const prevBasePath = process.env.NEXT_PUBLIC_BASE_PATH;
  const hadWindow = Object.prototype.hasOwnProperty.call(globalThis, 'window');
  const prevWindow = globalThis.window;

  try {
    // 1. SSR / headless without token
    delete process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;
    delete globalThis.window;
    assert.equal(isAnalyticsEnabled(), false);
    assert.equal(trackEvent('page_view'), false);
    assert.equal(trackDownloadCV('modal'), false);
    assert.equal(trackExternalLink('https://github.com/daffahanif6'), false);

    // 2. SSR / headless with token still safely no-ops
    process.env.NEXT_PUBLIC_CF_BEACON_TOKEN = 'cf-test-token';
    assert.equal(isAnalyticsEnabled(), true);
    assert.equal(trackEvent('page_view'), false);
    assert.equal(trackDownloadCV('modal'), false);
    assert.equal(trackExternalLink('https://github.com/daffahanif6'), false);

    // 3. Browser window with undefined or whitespace-only token
    const dispatched = [];
    globalThis.window = {
      dispatchEvent(event) {
        dispatched.push(event);
        return true;
      },
    };

    delete process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;
    assert.equal(isAnalyticsEnabled(), false);
    assert.equal(trackEvent('custom_click'), false);
    assert.equal(trackDownloadCV('modal'), false);
    assert.equal(trackExternalLink('https://github.com/daffahanif6'), false);

    process.env.NEXT_PUBLIC_CF_BEACON_TOKEN = '   ';
    assert.equal(isAnalyticsEnabled(), false);
    assert.equal(trackEvent('custom_click'), false);
    assert.equal(trackDownloadCV('modal'), false);
    assert.equal(trackExternalLink('https://github.com/daffahanif6'), false);
    assert.equal(dispatched.length, 0);

    // 4. Browser window with valid token dispatches expected zero-cookie CustomEvents
    process.env.NEXT_PUBLIC_CF_BEACON_TOKEN = 'cf-test-token';
    assert.equal(isAnalyticsEnabled(), true);
    assert.equal(trackEvent('custom_click', { count: 1 }), true);
    assert.equal(trackDownloadCV('modal'), true);
    assert.equal(trackExternalLink('https://github.com/daffahanif6', 'GitHub', 'footer'), true);
    assert.equal(trackEvent('   '), false);
    assert.equal(trackExternalLink('   '), false);
    assert.equal(dispatched.length, 3);

    assert.equal(dispatched[0].type, 'portfolio:analytics');
    assert.deepEqual(dispatched[0].detail, { name: 'custom_click', params: { count: 1 } });
    assert.equal(dispatched[1].type, 'portfolio:analytics');
    assert.deepEqual(dispatched[1].detail, { name: 'cv_download_click', params: { source: 'modal' } });
    assert.equal(dispatched[2].type, 'portfolio:analytics');
    assert.deepEqual(dispatched[2].detail, {
      name: 'external_link_click',
      params: { url: 'https://github.com/daffahanif6', label: 'GitHub', location: 'footer' },
    });

    // 5. Failing dispatchEvent never interrupts caller
    globalThis.window = {
      dispatchEvent() {
        throw new Error('Blocked by environment');
      },
    };
    assert.equal(trackEvent('custom_click'), false);
    assert.equal(trackDownloadCV('modal'), false);
    assert.equal(trackExternalLink('https://github.com/daffahanif6'), false);

    // 6. withBasePath regression check
    delete process.env.NEXT_PUBLIC_BASE_PATH;
    assert.equal(withBasePath('/docs/cv.pdf'), '/docs/cv.pdf');
    process.env.NEXT_PUBLIC_BASE_PATH = '/portfolio';
    assert.equal(withBasePath('/docs/cv.pdf'), '/portfolio/docs/cv.pdf');
    assert.equal(withBasePath('https://example.com'), 'https://example.com');
  } finally {
    if (prevToken === undefined) {
      delete process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;
    } else {
      process.env.NEXT_PUBLIC_CF_BEACON_TOKEN = prevToken;
    }
    if (prevBasePath === undefined) {
      delete process.env.NEXT_PUBLIC_BASE_PATH;
    } else {
      process.env.NEXT_PUBLIC_BASE_PATH = prevBasePath;
    }
    if (hadWindow) {
      globalThis.window = prevWindow;
    } else {
      delete globalThis.window;
    }
  }
});
