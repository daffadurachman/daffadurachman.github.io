import type { SupportingSkillGroup, TechSkillItem } from '@/types/portfolio';

export const TECHNICAL_SKILLS: TechSkillItem[] = [
  {
    name: 'Python',
    category: 'dev',
    description: 'Skrip olah data, otomasi, dan pelatihan model machine learning.',
    tracks: ['web-data', 'it-support'],
  },
  {
    name: 'HTML',
    category: 'dev',
    tracks: ['web-data'],
  },
  {
    name: 'CSS',
    category: 'dev',
    tracks: ['web-data'],
  },
  {
    name: 'MySQL',
    category: 'dev',
    description: 'Perancangan tabel relasional dan kueri SQL.',
    tracks: ['web-data', 'it-support'],
  },
  {
    name: 'Laravel',
    category: 'learning',
    description: 'Pengembangan aplikasi web PHP berbasis MVC.',
    tracks: ['web-data'],
  },
  {
    name: 'Flutter',
    category: 'learning',
    description: 'Pengembangan aplikasi mobile lintas platform.',
    tracks: ['web-data'],
  },
  {
    name: 'Git',
    category: 'tools',
    tracks: ['web-data', 'it-support'],
  },
  {
    name: 'Docker',
    category: 'tools',
    description: 'Kontainerisasi lingkungan aplikasi agar konsisten.',
    tracks: ['web-data', 'it-support'],
  },
  {
    name: 'VS Code',
    category: 'tools',
    tracks: ['web-data'],
  },
  {
    name: 'Visual Studio',
    category: 'tools',
    tracks: ['web-data'],
  },
  {
    name: 'Antigravity',
    category: 'tools',
    description: 'Editor AI harian untuk akselerasi kode dan debugging.',
    tracks: ['web-data'],
  },
  {
    name: 'Figma',
    category: 'tools',
    description: 'Wireframe, komponen UI, dan sistem desain.',
    tracks: ['web-data'],
  },
  {
    name: 'Microsoft Word',
    category: 'tools',
    tracks: ['it-support', 'web-data'],
  },
  {
    name: 'Microsoft Excel',
    category: 'tools',
    tracks: ['it-support', 'web-data'],
  },
];

export const SUPPORTING_SKILLS: SupportingSkillGroup[] = [
  {
    title: 'Koordinasi Tim',
    items: [
      'Menyusun jadwal dan pembagian tugas menggunakan Gantt Chart.',
      'Mengawal koordinasi kerja dan pemecahan kendala teknis lapangan.',
    ],
  },
  {
    title: 'Bahasa',
    items: [
      'Bahasa Indonesia: Penutur asli.',
      'Bahasa Inggris: Membaca dokumentasi teknis & menyimak (menengah).',
    ],
  },
];
