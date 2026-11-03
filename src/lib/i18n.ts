import { EXPERIENCES } from '@/data/experiences';
import { PROFILE_DATA } from '@/data/profile';
import { RUNBOOK_CASELETS } from '@/data/runbooks';
import { SUPPORTING_SKILLS } from '@/data/skills';
import type {
  CertificationItem,
  CommunityItem,
  EducationItem,
  ExperienceItem,
  ProjectItem,
  ProjectPipelineNode,
  RunbookCaselet,
  SupportingSkillGroup,
} from '@/types/portfolio';

export type PortfolioLocale = 'id' | 'en';

export interface UiDictionary {
  nav: {
    ariaLabel: string;
    projects: string;
    experience: string;
    experienceWithCount: string;
    skills: string;
    profileSkills: string;
    cv: string;
    cvPreview: string;
    contact: string;
    contactCta: string;
    cmdAriaLabel: string;
    cmdTitle: string;
    openMenuAria: string;
    closeMenuAria: string;
    switchThemeToLight: string;
    switchThemeToDark: string;
    switchLocaleAria: string;
    switchLocaleTitle: string;
  };
  hero: {
    availabilityText: string;
    headlineGray: string;
    headlineBlack: string;
    summaryBold: string;
    summaryMuted: string;
    viewThreeProjects: string;
    proofItems: {
      education: { label: string; metric: string; detail: string };
      lab: { label: string; metric: string; detail: string };
      data: { label: string; metric: string; detail: string };
      experience: { label: string; metric: string; detail: string };
    };
  };
  projects: {
    headingMuted: string;
    headingPrimary: string;
    filterAriaLabel: string;
    allFilter: string;
    featuredPrefix: string;
    caseStudyBtn: string;
    liveBtn: string;
    techListAriaLabel: string;
    pipelineHint: string;
    pipelineStagePrefix: string;
  };
  experience: {
    headingMuted: string;
    headingPrimary: string;
    collapseBtn: string;
    expandBtnPrefix: string;
    expandBtnSuffix: string;
    viewCertLabel: string;
  };
  runbook: {
    eyebrow: string;
    heading: string;
    tablistAria: string;
    step1: string;
    step2: string;
    step3: string;
    step4: string;
    viewProofBtn: string;
  };
  profile: {
    aboutHeadlineGray: string;
    aboutHeadlineBlack: string;
    educationHeading: string;
    viewCertLabel: string;
    supportingToggle: string;
  };
  footer: {
    ctaPrefix: string;
    cyclingWords: readonly [string, string, string];
    ctaSuffix: string;
    subtextSuffix: string;
    whatsappLabel: string;
    whatsappBtn: string;
    profilesLabel: string;
    backToTop: string;
    emailCopied: string;
    emailCopyManual: string;
    emailCopiedSr: string;
    emailFailedSr: string;
  };
  cvModal: {
    titlePrefix: string;
    modeAriaLabel: string;
    tabSummary: string;
    tabPdf: string;
    downloadPrefix: string;
    closeAriaLabel: string;
    profileSummaryHeading: string;
    educationHeading: string;
    hardwareNetLabel: string;
    hardwareNetText: string;
    experienceHeadingPrefix: string;
    experienceHeadingSuffix: string;
    communityHeading: string;
    pdfTimeoutNote: string;
    pdfOriginalPrefix: string;
    openPdfTab: string;
    pdfLoadingPrefix: string;
    pdfIframeTitle: string;
  };
  certModal: {
    verifiedBadge: string;
    downloadPdf: string;
    closeAriaLabel: string;
    copyId: string;
    copiedId: string;
    copyFailed: string;
    copiedSr: string;
    pdfTimeoutNote: string;
    pdfOriginalNote: string;
    openPdfTab: string;
    pdfLoadingLabel: string;
    pdfIframePrefix: string;
  };
  cmdPalette: {
    dialogAriaLabel: string;
    inputAriaLabel: string;
    placeholder: string;
    closeAriaLabel: string;
    emptyPrefix: string;
    footerNav: string;
    footerSelect: string;
    footerClose: string;
    groups: {
      quickActions: string;
      certificates: string;
      projects: string;
      navigation: string;
    };
    items: {
      cvHint: string;
      copyEmailPrefix: string;
      emailCopied: string;
      emailFailed: string;
      whatsappLabel: string;
      toggleThemeLabel: string;
      toggleThemeHint: string;
      toggleLocaleLabel: string;
      toggleLocaleHint: string;
      certPrefix: string;
      navHome: string;
      navHomeHint: string;
      navProjects: string;
      navProjectsHint: string;
      navExperience: string;
      navExperienceHint: string;
      navSkills: string;
      navSkillsHint: string;
      navContact: string;
      navContactHint: string;
    };
  };
}

export const UI_DICTIONARY: Record<PortfolioLocale, UiDictionary> = {
  id: {
    nav: {
      ariaLabel: 'Navigasi Utama Portofolio Daffa Hanif',
      projects: 'Proyek',
      experience: 'Pengalaman',
      experienceWithCount: 'Pengalaman Kerja (6)',
      skills: 'Keahlian',
      profileSkills: 'Profil & Keahlian',
      cv: 'CV',
      cvPreview: 'Review My CV',
      contact: 'Kontak',
      contactCta: 'Hubungi Daffa',
      cmdAriaLabel: 'Buka pencarian cepat Command Palette (Ctrl+K)',
      cmdTitle: 'Command Palette (Ctrl+K)',
      openMenuAria: 'Buka menu navigasi cepat',
      closeMenuAria: 'Tutup menu navigasi',
      switchThemeToLight: 'Aktifkan mode terang',
      switchThemeToDark: 'Aktifkan mode gelap',
      switchLocaleAria: 'Ganti bahasa ke English (EN)',
      switchLocaleTitle: 'Switch language to English',
    },
    hero: {
      availabilityText: PROFILE_DATA.availabilityText,
      headlineGray: PROFILE_DATA.headlineGray,
      headlineBlack: PROFILE_DATA.headlineBlack,
      summaryBold: PROFILE_DATA.summaryBold,
      summaryMuted: PROFILE_DATA.summaryMuted,
      viewThreeProjects: 'Lihat 3 Proyek',
      proofItems: {
        education: {
          label: 'PENDIDIKAN',
          metric: 'IPK 3,31',
          detail: 'S1 Informatika · Amikom',
        },
        lab: {
          label: 'STAF LAB & IT',
          metric: 'Nilai 90',
          detail: 'Perawatan PC & LAN',
        },
        data: {
          label: 'STUDI KASUS DATA',
          metric: '99,94%',
          detail: 'ResNet50 · 991rb Data Spark',
        },
        experience: {
          label: 'PENGALAMAN',
          metric: '6 Peran',
          detail: 'Lab, Teknisi, BPS, Logistik',
        },
      },
    },
    projects: {
      headingMuted: 'Tiga proyek yang saya bangun ',
      headingPrimary: 'dan uji langsung datanya.',
      filterAriaLabel: 'Filter kategori proyek',
      allFilter: 'Semua',
      featuredPrefix: 'Utama',
      caseStudyBtn: 'Studi Kasus',
      liveBtn: 'Live',
      techListAriaLabel: 'Teknologi proyek',
      pipelineHint: 'Klik tahap untuk inspeksi detail',
      pipelineStagePrefix: 'Tahap',
    },
    experience: {
      headingMuted: 'Enam pengalaman kerja dan magang, ',
      headingPrimary: 'dari ruang lab hingga lapangan.',
      collapseBtn: 'Ringkas Riwayat',
      expandBtnPrefix: 'Lihat',
      expandBtnSuffix: 'Riwayat Lainnya',
      viewCertLabel: 'Lihat Sertifikat',
    },
    runbook: {
      eyebrow: 'IT Troubleshooting & Field Runbook',
      heading: 'Cara saya mendiagnosa & menyelesaikan masalah nyata',
      tablistAria: 'Pilih studi kasus runbook IT',
      step1: '01 · Gejala',
      step2: '02 · Diagnosa',
      step3: '03 · Tindakan',
      step4: '04 · Hasil',
      viewProofBtn: 'Lihat Bukti Sertifikat Terkait',
    },
    profile: {
      aboutHeadlineGray: PROFILE_DATA.aboutHeadlineGray,
      aboutHeadlineBlack: PROFILE_DATA.aboutHeadlineBlack,
      educationHeading: 'Riwayat Pendidikan',
      viewCertLabel: 'Lihat Sertifikat',
      supportingToggle: 'Kolaborasi & Bahasa',
    },
    footer: {
      ctaPrefix: 'Mari',
      cyclingWords: ['berdiskusi', 'bekerja sama', 'berkolaborasi'],
      ctaSuffix: 'untuk web, olahan data, atau dukungan IT Anda.',
      subtextSuffix: 'Siap onsite maupun remote.',
      whatsappLabel: 'WhatsApp',
      whatsappBtn: 'Chat WhatsApp',
      profilesLabel: 'Profil',
      backToTop: 'Kembali ke atas',
      emailCopied: 'Email Disalin',
      emailCopyManual: 'Salin manual:',
      emailCopiedSr: 'berhasil disalin ke clipboard.',
      emailFailedSr: 'Gagal menyalin otomatis. Email:',
    },
    cvModal: {
      titlePrefix: 'Pratinjau CV',
      modeAriaLabel: 'Mode Pratinjau CV',
      tabSummary: 'Ringkasan',
      tabPdf: 'Dokumen PDF',
      downloadPrefix: 'Unduh',
      closeAriaLabel: 'Tutup pratinjau CV',
      profileSummaryHeading: 'Ringkasan Profil',
      educationHeading: 'Pendidikan',
      hardwareNetLabel: 'Hardware & Jaringan:',
      hardwareNetText:
        'Diagnosis & perbaikan PC/laptop, pemeliharaan lab komputer, instalasi OS, dan jaringan lokal (LAN).',
      experienceHeadingPrefix: 'Pengalaman Kerja & Magang (',
      experienceHeadingSuffix: ' Riwayat)',
      communityHeading: 'Aktivitas Kampus & Komunitas',
      pdfTimeoutNote: 'Browser seluler membatasi pratinjau PDF di dalam bingkai.',
      pdfOriginalPrefix: 'Dokumen asli',
      openPdfTab: 'Buka PDF di Tab Baru',
      pdfLoadingPrefix: 'Memuat dokumen',
      pdfIframeTitle: 'Pratinjau PDF CV Daffa Hanif Durachman',
    },
    certModal: {
      verifiedBadge: 'Dokumen Terverifikasi',
      downloadPdf: 'Unduh PDF',
      closeAriaLabel: 'Tutup pratinjau sertifikat',
      copyId: 'Salin ID',
      copiedId: 'ID Disalin',
      copyFailed: 'Gagal Salin',
      copiedSr: 'Nomor sertifikat berhasil disalin.',
      pdfTimeoutNote: 'Browser seluler membatasi pratinjau PDF di dalam bingkai.',
      pdfOriginalNote: 'Pratinjau dokumen PDF asli',
      openPdfTab: 'Buka PDF di Tab Baru',
      pdfLoadingLabel: 'Memuat dokumen sertifikat...',
      pdfIframePrefix: 'Pratinjau PDF',
    },
    cmdPalette: {
      dialogAriaLabel: 'Command Palette Portofolio',
      inputAriaLabel: 'Cari proyek, sertifikat, atau aksi cepat',
      placeholder: 'Cari proyek, sertifikat (CCNA, BPS, Lab), CV, atau aksi...',
      closeAriaLabel: 'Tutup command palette',
      emptyPrefix: 'Tidak ditemukan perintah untuk',
      footerNav: 'navigasi',
      footerSelect: 'pilih',
      footerClose: 'tutup',
      groups: {
        quickActions: 'Aksi Cepat',
        certificates: 'Sertifikat & Bukti',
        projects: 'Studi Kasus Proyek',
        navigation: 'Navigasi',
      },
      items: {
        cvHint: 'Ringkasan & PDF',
        copyEmailPrefix: 'Salin Email',
        emailCopied: 'Email berhasil disalin.',
        emailFailed: 'Gagal menyalin email.',
        whatsappLabel: 'Chat WhatsApp',
        toggleThemeLabel: 'Ganti Tema (Light / Dark Mode)',
        toggleThemeHint: 'Toggle Tema',
        toggleLocaleLabel: 'Ganti Bahasa ke English (EN)',
        toggleLocaleHint: 'ID -> EN',
        certPrefix: 'Sertifikat',
        navHome: 'Beranda',
        navHomeHint: 'Hero & Ringkasan',
        navProjects: 'Proyek Unggulan',
        navProjectsHint: '3 Studi Kasus',
        navExperience: 'Pengalaman & Runbook IT',
        navExperienceHint: '6 Riwayat & Field Runbook',
        navSkills: 'Pendidikan, Certifications & Tech Stack',
        navSkillsHint: 'Profil & Keahlian',
        navContact: 'Kontak & Profil Sosial',
        navContactHint: 'Footer',
      },
    },
  },
  en: {
    nav: {
      ariaLabel: 'Main Portfolio Navigation for Daffa Hanif',
      projects: 'Projects',
      experience: 'Experience',
      experienceWithCount: 'Work Experience (6)',
      skills: 'Skills',
      profileSkills: 'Profile & Skills',
      cv: 'CV',
      cvPreview: 'Review My CV',
      contact: 'Contact',
      contactCta: 'Contact Daffa',
      cmdAriaLabel: 'Open quick search Command Palette (Ctrl+K)',
      cmdTitle: 'Command Palette (Ctrl+K)',
      openMenuAria: 'Open quick navigation menu',
      closeMenuAria: 'Close navigation menu',
      switchThemeToLight: 'Switch to light mode',
      switchThemeToDark: 'Switch to dark mode',
      switchLocaleAria: 'Switch language to Bahasa Indonesia (ID)',
      switchLocaleTitle: 'Ganti bahasa ke Bahasa Indonesia',
    },
    hero: {
      availabilityText: 'Open to work - ready for onsite or remote',
      headlineGray: 'Building web & data models,',
      headlineBlack: 'maintaining PCs & networks.',
      summaryBold: 'B.Sc. in Informatics graduate from Universitas Amikom Yogyakarta.',
      summaryMuted:
        'Focused on web development, Python data processing, PC maintenance, and LAN support.',
      viewThreeProjects: 'View 3 Projects',
      proofItems: {
        education: {
          label: 'EDUCATION',
          metric: 'GPA 3.31',
          detail: 'B.Sc. Informatics · Amikom',
        },
        lab: {
          label: 'LAB STAFF & IT',
          metric: 'Score 90',
          detail: 'PC Maintenance & LAN',
        },
        data: {
          label: 'DATA CASE STUDIES',
          metric: '99.94%',
          detail: 'ResNet50 · 991k Spark Rows',
        },
        experience: {
          label: 'EXPERIENCE',
          metric: '6 Roles',
          detail: 'Lab, Technician, BPS, Ops',
        },
      },
    },
    projects: {
      headingMuted: 'Three projects I built ',
      headingPrimary: 'and validated directly on data.',
      filterAriaLabel: 'Filter project category',
      allFilter: 'All',
      featuredPrefix: 'Featured',
      caseStudyBtn: 'Case Study',
      liveBtn: 'Live',
      techListAriaLabel: 'Project technologies',
      pipelineHint: 'Click any stage to inspect details',
      pipelineStagePrefix: 'Stage',
    },
    experience: {
      headingMuted: 'Six work and internship roles, ',
      headingPrimary: 'from computer labs to field ops.',
      collapseBtn: 'Show Fewer Roles',
      expandBtnPrefix: 'Show',
      expandBtnSuffix: 'More Roles',
      viewCertLabel: 'View Certificate',
    },
    runbook: {
      eyebrow: 'IT Troubleshooting & Field Runbook',
      heading: 'How I diagnose & resolve real operational issues',
      tablistAria: 'Select an IT runbook caselet',
      step1: '01 · Symptom',
      step2: '02 · Diagnosis',
      step3: '03 · Resolution',
      step4: '04 · Outcome',
      viewProofBtn: 'View Linked Certificate Proof',
    },
    profile: {
      aboutHeadlineGray: 'Education background',
      aboutHeadlineBlack: '& technical capabilities.',
      educationHeading: 'Education History',
      viewCertLabel: 'View Certificate',
      supportingToggle: 'Collaboration & Languages',
    },
    footer: {
      ctaPrefix: "Let's",
      cyclingWords: ['connect', 'collaborate', 'work together'],
      ctaSuffix: 'on your web apps, data workflows, or IT support.',
      subtextSuffix: 'Available onsite or remote.',
      whatsappLabel: 'WhatsApp',
      whatsappBtn: 'Chat on WhatsApp',
      profilesLabel: 'Profiles',
      backToTop: 'Back to top',
      emailCopied: 'Email Copied',
      emailCopyManual: 'Copy manually:',
      emailCopiedSr: 'copied to clipboard.',
      emailFailedSr: 'Automatic copy failed. Email:',
    },
    cvModal: {
      titlePrefix: 'CV Preview',
      modeAriaLabel: 'CV Preview Mode',
      tabSummary: 'Summary',
      tabPdf: 'PDF Document',
      downloadPrefix: 'Download',
      closeAriaLabel: 'Close CV preview',
      profileSummaryHeading: 'Profile Summary',
      educationHeading: 'Education',
      hardwareNetLabel: 'Hardware & Networking:',
      hardwareNetText:
        'PC/laptop diagnostics & repair, computer lab maintenance, OS installation, and local area networking (LAN).',
      experienceHeadingPrefix: 'Work & Internship Experience (',
      experienceHeadingSuffix: ' Roles)',
      communityHeading: 'Campus & Community Activities',
      pdfTimeoutNote: 'Mobile browsers may restrict inline PDF previews inside frames.',
      pdfOriginalPrefix: 'Original document',
      openPdfTab: 'Open PDF in New Tab',
      pdfLoadingPrefix: 'Loading document',
      pdfIframeTitle: 'PDF CV Preview of Daffa Hanif Durachman',
    },
    certModal: {
      verifiedBadge: 'Verified Document',
      downloadPdf: 'Download PDF',
      closeAriaLabel: 'Close certificate preview',
      copyId: 'Copy ID',
      copiedId: 'ID Copied',
      copyFailed: 'Copy Failed',
      copiedSr: 'Certificate credential ID copied to clipboard.',
      pdfTimeoutNote: 'Mobile browsers may restrict inline PDF previews inside frames.',
      pdfOriginalNote: 'Original verified PDF document preview',
      openPdfTab: 'Open PDF in New Tab',
      pdfLoadingLabel: 'Loading certificate document...',
      pdfIframePrefix: 'PDF Preview',
    },
    cmdPalette: {
      dialogAriaLabel: 'Portfolio Command Palette',
      inputAriaLabel: 'Search projects, certificates, or quick actions',
      placeholder: 'Search projects, certificates (CCNA, BPS, Lab), CV, or actions...',
      closeAriaLabel: 'Close command palette',
      emptyPrefix: 'No commands found for',
      footerNav: 'navigate',
      footerSelect: 'select',
      footerClose: 'close',
      groups: {
        quickActions: 'Quick Actions',
        certificates: 'Certificates & Proof',
        projects: 'Project Case Studies',
        navigation: 'Navigation',
      },
      items: {
        cvHint: 'Summary & PDF',
        copyEmailPrefix: 'Copy Email',
        emailCopied: 'Email copied to clipboard.',
        emailFailed: 'Failed to copy email.',
        whatsappLabel: 'Chat on WhatsApp',
        toggleThemeLabel: 'Switch Theme (Light / Dark Mode)',
        toggleThemeHint: 'Toggle Theme',
        toggleLocaleLabel: 'Ganti Bahasa ke Indonesia (ID)',
        toggleLocaleHint: 'EN -> ID',
        certPrefix: 'Certificate',
        navHome: 'Home',
        navHomeHint: 'Hero & Overview',
        navProjects: 'Featured Projects',
        navProjectsHint: '3 Case Studies',
        navExperience: 'Experience & IT Runbook',
        navExperienceHint: '6 Roles & Field Runbook',
        navSkills: 'Education, Certifications & Tech Stack',
        navSkillsHint: 'Profile & Skills',
        navContact: 'Contact & Social Profiles',
        navContactHint: 'Footer',
      },
    },
  },
};

const EN_PROJECT_OVERRIDES: Record<
  string,
  { shortTitle: string; summary: string; statusLabel: string; primaryMetric: string }
> = {
  'klasifikasi-ikan-resnet50-gradcam': {
    shortTitle: 'Multi-Class Fish Classification & XAI (ResNet50 + Grad-CAM)',
    summary: '9-species marine fish classification on 9,000 images with Grad-CAM heatmaps in Streamlit.',
    statusLabel: 'Completed',
    primaryMetric: 'Test Accuracy: 99.94%',
  },
  'klasifikasi-alkohol-spark-mllib': {
    shortTitle: 'Large-Scale Clinical Classification (Apache Spark MLlib)',
    summary: '4-model distributed ML benchmark on 991,346 clinical records (Grade A).',
    statusLabel: 'Grade A · Completed',
    primaryMetric: 'AUC-ROC 0.8100 (XGBoost)',
  },
  'deteksi-apd-konstruksi-yolov12': {
    shortTitle: 'Real-Time Construction PPE Detection (YOLOv12)',
    summary: 'Real-time 5-class helmet & safety vest detection for construction sites (Grade A).',
    statusLabel: 'Grade A · Completed',
    primaryMetric: 'Peak Val mAP@50: 87.41%',
  },
};

export function getLocalizedProjectCard(project: ProjectItem, locale: PortfolioLocale) {
  if (locale === 'id') {
    return {
      shortTitle: project.shortTitle,
      summary: project.summary,
      statusLabel: project.statusLabel,
      primaryMetric: project.results[0]?.metric ?? project.statusLabel,
    };
  }
  const en = EN_PROJECT_OVERRIDES[project.slug];
  return {
    shortTitle: en?.shortTitle ?? project.shortTitle,
    summary: en?.summary ?? project.summary,
    statusLabel: en?.statusLabel ?? project.statusLabel,
    primaryMetric: en?.primaryMetric ?? project.results[0]?.metric ?? project.statusLabel,
  };
}

const EN_EXPERIENCE_OVERRIDES: Record<
  string,
  {
    role: string;
    period: string;
    typeLabel: string;
    highlights: string[];
    achievementCallout?: string;
    certificateLabel?: string;
  }
> = {
  'exp-amikom-lab': {
    role: 'Computer Laboratory Staff',
    period: 'Apr 2026 – Sep 2026',
    typeLabel: 'Work',
    highlights: [
      'Maintained lab workstations, tracked hardware inventory, and resolved PC hardware and LAN issues during practical sessions.',
    ],
    achievementCallout: 'Satisfactory Predicate · Score 90 PC, 85 Troubleshooting, 80 LAN',
    certificateLabel: 'View Certificate',
  },
  'exp-spx-firstmile': {
    role: 'First Mile Courier',
    period: 'Aug 2025 – Mar 2026',
    typeLabel: 'Work',
    highlights: [
      'Collected seller parcels across Condongcatur on strict daily pickup schedules to the sorting hub on time.',
    ],
  },
  'exp-bps-regsosek': {
    role: 'Field Data Enumerator (Regsosek)',
    period: 'Oct 2022 – Nov 2022',
    typeLabel: 'Work',
    highlights: [
      'Conducted household interviews using Regsosek questionnaires, GPS home geotagging, and building documentation.',
    ],
    achievementCallout: '>250 validated household records in 1 month · 100% area target',
    certificateLabel: 'View Certificate',
  },
  'exp-pt-mnj': {
    role: 'Warehouse Staff',
    period: 'Oct 2021 – Nov 2021',
    typeLabel: 'Work',
    highlights: [
      'Inspected inbound and outbound pharmaceutical and consumer goods so physical stock matched inventory records.',
    ],
  },
  'exp-pt-kanisius': {
    role: 'Hardware & Software Technician',
    period: 'Jun 2019 – Aug 2019',
    typeLabel: 'Internship',
    highlights: [
      'Resolved hardware, software, and local area network (LAN) cabling issues for office workstations.',
    ],
  },
  'exp-imdkom': {
    role: 'PC & Laptop Hardware Technician',
    period: 'Mar 2019 – May 2019',
    typeLabel: 'Internship',
    highlights: [
      'Diagnosed customer PC and laptop hardware failures, performed component repairs, and handled clean OS reinstallations.',
    ],
  },
};

export function getLocalizedExperiences(locale: PortfolioLocale): (ExperienceItem & { displayType: string })[] {
  return EXPERIENCES.map((exp) => {
    if (locale === 'id') {
      return { ...exp, displayType: exp.type };
    }
    const en = EN_EXPERIENCE_OVERRIDES[exp.id];
    if (!en) return { ...exp, displayType: exp.type };
    return {
      ...exp,
      role: en.role,
      period: en.period,
      displayType: en.typeLabel,
      highlights: en.highlights,
      achievementCallout: en.achievementCallout ?? exp.achievementCallout,
      certificateLabel: en.certificateLabel ?? exp.certificateLabel,
    };
  });
}

const EN_RUNBOOK_OVERRIDES: Record<
  string,
  {
    title: string;
    context: string;
    symptom: string;
    diagnosis: string;
    resolution: string;
    outcome: string;
    certTitle?: string;
    certDate?: string;
    certSummary?: string;
  }
> = {
  'runbook-amikom-lan': {
    title: 'Lab Workstation Maintenance & LAN Fault Isolation',
    context: 'Laboratory Staff · Universitas Amikom Yogyakarta (Apr 2026 – Sep 2026)',
    symptom:
      'Several lab workstations lost local area network (LAN) connectivity or slowed down right before practical class sessions.',
    diagnosis:
      'Step-by-step triage from UTP cable/switch port link status and client IP/DHCP checks through hardware health and background process inspection.',
    resolution:
      'Isolated faulty cable runs and switch ports, restored local network settings, serviced PC units, and logged maintenance inventory.',
    outcome:
      'Earned Satisfactory Predicate in Laboratory Staff evaluation (Score 90 PC Maintenance, 85 Troubleshooting, 80 LAN Networking).',
    certTitle: 'Laboratory Staff Certificate · Universitas Amikom Yogyakarta',
    certDate: 'Apr 2026 – Sep 2026',
    certSummary: 'Satisfactory Predicate · Score 90 PC, 85 Troubleshooting, 80 LAN',
  },
  'runbook-ccna-network': {
    title: 'Foundational Network Design, Subnetting & LAN Connectivity',
    context: 'CCNAv7 Cisco Networking Academy (2023) & TKJ SMK Tamansiswa Jetis',
    symptom:
      'Need for clean IP address segmentation and predictable device-to-device communication across a local network for fast fault isolation.',
    diagnosis:
      'Mapped host counts per subnet (IPv4 subnetting), verified basic switching/routing tables, and ran end-to-end connectivity checks (ping/traceroute).',
    resolution:
      'Applied structured addressing schemes, baseline switch and router configuration, and topology documentation to shorten troubleshooting time.',
    outcome:
      'Completed official CCNAv7: Introduction to Networks (Cisco Networking Academy) and graduated in Computer & Network Engineering with 85.5 average.',
    certTitle: 'CCNAv7: Introduction to Networks',
    certDate: 'Oct 17, 2023',
  },
  'runbook-field-ops': {
    title: 'Workstation Hardware Diagnostics & Field Data Validation',
    context: 'BPS Kabupaten Sleman (Regsosek) · PT Kanisius · IMDKOM',
    symptom:
      'Two operational failure patterns: boot/OS failures on office and customer PCs, and questionnaire/GPS coordinate inconsistency risks across hundreds of households.',
    diagnosis:
      'Isolated faulty PC components (RAM, storage, OS corruption) before reinstallation; verified attribute completeness, GPS geotags, and building photos in the field.',
    resolution:
      'Performed hardware repair and clean OS reinstalls on affected machines, alongside structured cross-checks on every Regsosek household entry.',
    outcome:
      'Delivered >250 validated household records in 1 month (100% BPS Sleman area target) and restored office/customer workstations to stable operation.',
    certTitle: 'Field Data Enumerator Certificate (Regsosek)',
    certDate: 'Dec 22, 2022',
    certSummary: '>250 validated household records in 1 month · 100% area target',
  },
};

export function getLocalizedRunbooks(locale: PortfolioLocale): RunbookCaselet[] {
  if (locale === 'id') return RUNBOOK_CASELETS;
  return RUNBOOK_CASELETS.map((item) => {
    const en = EN_RUNBOOK_OVERRIDES[item.id];
    if (!en) return item;
    return {
      ...item,
      title: en.title,
      context: en.context,
      symptom: en.symptom,
      diagnosis: en.diagnosis,
      resolution: en.resolution,
      outcome: en.outcome,
      relatedCertificate: item.relatedCertificate
        ? {
            ...item.relatedCertificate,
            title: en.certTitle ?? item.relatedCertificate.title,
            date: en.certDate ?? item.relatedCertificate.date,
            summary: en.certSummary ?? item.relatedCertificate.summary,
          }
        : undefined,
    };
  });
}

const EN_SKILL_DESCRIPTIONS: Record<string, string> = {
  Python: 'Data processing scripts, workflow automation, and machine learning model training.',
  MySQL: 'Relational table schema design and structured SQL queries.',
  Laravel: 'PHP MVC web application development.',
  Flutter: 'Cross-platform mobile application development.',
  Docker: 'Containerizing application environments for consistent execution.',
  Antigravity: 'Daily AI coding assistant for accelerating development and debugging.',
  Figma: 'Wireframes, UI components, and design systems.',
};

export function getLocalizedSkillDescription(
  name: string,
  defaultDescription: string | undefined,
  locale: PortfolioLocale
): string | undefined {
  if (!defaultDescription) return undefined;
  if (locale === 'id') return defaultDescription;
  return EN_SKILL_DESCRIPTIONS[name] ?? defaultDescription;
}

export function getLocalizedSupportingSkills(locale: PortfolioLocale): SupportingSkillGroup[] {
  if (locale === 'id') return SUPPORTING_SKILLS;
  return [
    {
      title: 'Team Coordination',
      items: [
        'Plans schedules and task allocation using Gantt Charts.',
        'Coordinates team execution and field technical issue resolution.',
      ],
    },
    {
      title: 'Languages',
      items: [
        'Indonesian: Native speaker.',
        'English: Technical documentation reading & intermediate listening.',
      ],
    },
  ];
}

export function getLocalizedEducation(locale: PortfolioLocale): EducationItem[] {
  if (locale === 'id') return PROFILE_DATA.education;
  return [
    {
      institution: 'Universitas Amikom Yogyakarta',
      degree: 'B.Sc. in Informatics – Programming',
      period: 'Sep 2021 – Aug 2026',
      location: 'Sleman, Yogyakarta',
      scoreLabel: 'GPA',
      scoreValue: '3.31',
    },
    {
      institution: 'SMK Tamansiswa Jetis',
      degree: 'Computer and Network Engineering (TKJ)',
      period: 'Jul 2018 – Jun 2021',
      location: 'Sleman, Yogyakarta',
      scoreLabel: 'Avg',
      scoreValue: '85.5',
    },
  ];
}

export function getLocalizedCertifications(locale: PortfolioLocale): CertificationItem[] {
  if (locale === 'id') return PROFILE_DATA.certifications;
  return PROFILE_DATA.certifications.map((cert) => {
    if (cert.id === 'cert-ccnav7-itn') {
      return {
        ...cert,
        date: 'Oct 17, 2023',
        certificateLabel: 'View Certificate',
      };
    }
    if (cert.id === 'cert-amikom-itc') {
      return {
        ...cert,
        title: 'Mobile Development Participant – Introduction to Computer (ITC)',
      };
    }
    return cert;
  });
}

export function getLocalizedCommunity(locale: PortfolioLocale): CommunityItem[] {
  if (locale === 'id') return PROFILE_DATA.community;
  return [
    {
      role: 'Mobile Development Participant – Introduction to Computer (ITC)',
      organization: 'Universitas Amikom Yogyakarta',
      year: '2021',
      location: 'Sleman, Yogyakarta',
    },
    {
      role: 'Field Enumerator (PPL) – Socio-Economic Registration (Regsosek)',
      organization: 'Badan Pusat Statistik (BPS) Kabupaten Sleman',
      year: '2022',
      location: 'Sleman, Yogyakarta',
    },
  ];
}

const EN_PIPELINE_NODE_OVERRIDES: Record<
  string,
  { label: string; metric: string; detail: string }
> = {
  'fish-1-dataset': {
    label: 'Image Dataset',
    metric: '9,000 Images · 9 Species',
    detail:
      'Filtered original fish images from A Large-Scale Fish Dataset and removed binary mask files so the model learns fish morphology.',
  },
  'fish-2-preprocess': {
    label: 'Preprocessing',
    metric: '224×224 px · 80:20',
    detail:
      'Resized images uniformly to 224×224 px, applied ImageNet normalization, and created an 80:20 train/test split.',
  },
  'fish-3-resnet': {
    label: 'ResNet50 + Adam',
    metric: 'Epoch 10 · 15.15 min',
    detail:
      'Froze the ResNet50 backbone with a Dense 512, Dropout 0.5, and 9-class Softmax head using EarlyStopping and ReduceLROnPlateau.',
  },
  'fish-4-gradcam': {
    label: 'Grad-CAM XAI',
    metric: 'conv5_block3_out',
    detail:
      'Extracted visual heatmaps from the final convolution layer to verify predictions focus on head, fins, and fish body.',
  },
  'fish-5-streamlit': {
    label: 'Streamlit App',
    metric: 'Test Acc 99.94%',
    detail:
      'Interactive web interface to upload fish images, view class confidence scores, and inspect Grad-CAM overlays live.',
  },
  'spark-1-cluster': {
    label: 'SparkSession',
    metric: '991,346 Rows · 4 GB',
    detail:
      'Configured a distributed PySpark session (4 GB executor, 2 GB driver) to process nearly one million clinical records without OOM.',
  },
  'spark-2-clean': {
    label: 'IQR Cleaning',
    metric: '24 Clinical Features',
    detail:
      'Audited missing values and 50:50 class balance, applied IQR outlier clipping on blood biomarkers, and removed 26 duplicates and NaN/inf rows.',
  },
  'spark-3-vector': {
    label: 'MLlib Pipeline',
    metric: '70:30 Split · 23 Features',
    detail:
      'Encoded labels via StringIndexer and assembled 23 numeric features with VectorAssembler into 693,869 train and 297,451 test rows.',
  },
  'spark-4-bench': {
    label: '4-Model Benchmark',
    metric: 'XGBoost AUC 0.8100',
    detail:
      'Benchmarked GBT, Random Forest, Naive Bayes, and XGBoost; tree-based models led due to Gamma-GTP liver enzyme interactions.',
  },
  'yolo-1-roboflow': {
    label: 'Roboflow Labels',
    metric: '5 PPE Classes',
    detail:
      'Fetched a labeled 5-class construction dataset (helmet, no-helmet, vest, no-vest, person) through the Roboflow API.',
  },
  'yolo-2-augment': {
    label: 'Augmentation',
    metric: '640×640 px Input',
    detail:
      'Applied rotation, translation, HSV color jitter, and horizontal flips to strengthen robustness under outdoor site lighting.',
  },
  'yolo-3-train': {
    label: 'YOLOv12n (T4)',
    metric: '2.52M Params · AdamW',
    detail:
      'Trained the attention-centric YOLOv12n architecture on Tesla T4 GPU with AdamW optimizer and early stopping (patience 10).',
  },
  'yolo-4-eval': {
    label: 'Multi-Scale Eval',
    metric: 'Peak mAP@50 87.41%',
    detail:
      'Evaluated size-stratified mAP via Supervision; reached 0.80 optimal F1-Score at 0.539 threshold and 78.00% mAP@50 on small objects.',
  },
};

export function getLocalizedPipelineNodes(
  nodes: ProjectPipelineNode[],
  locale: PortfolioLocale
): ProjectPipelineNode[] {
  if (locale === 'id') return nodes;
  return nodes.map((node) => {
    const en = EN_PIPELINE_NODE_OVERRIDES[node.id];
    if (!en) return node;
    return {
      ...node,
      label: en.label,
      metric: en.metric,
      detail: en.detail,
    };
  });
}
