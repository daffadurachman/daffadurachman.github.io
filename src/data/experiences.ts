import type { ExperienceItem } from '@/types/portfolio';

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: 'exp-amikom-lab',
    role: 'Staf Laboratorium',
    company: 'Universitas Amikom Yogyakarta',
    period: 'Apr 2026 – Sep 2026',
    location: 'Sleman, Yogyakarta',
    type: 'Kerja',
    highlights: [
      'Merawat komputer, mencatat inventaris alat, dan menangani kendala hardware serta jaringan kelas praktikum.',
    ],
    achievementCallout: 'Predikat Memuaskan · Nilai 90 PC, 85 Troubleshooting, 80 LAN',
    certificateUrl: '/docs/Sertifikat_Staf_Laboratorium_Amikom_Daffa_Hanif.pdf',
    certificateLabel: 'Lihat Sertifikat',
    certificateNumber: '014/UPT/LAB/SS/IX/2026',
    tracks: ['it-support'],
  },
  {
    id: 'exp-spx-firstmile',
    role: 'Kurir First Mile',
    company: 'ShopeeXpress Hub Depok',
    period: 'Agu 2025 – Mar 2026',
    location: 'Sleman, Yogyakarta',
    type: 'Kerja',
    highlights: [
      'Menjemput paket penjual area Condongcatur sesuai jadwal harian menuju gudang sortir tepat waktu.',
    ],
    tracks: ['it-support', 'web-data'],
  },
  {
    id: 'exp-bps-regsosek',
    role: 'Petugas Pendataan Lapangan (Regsosek)',
    company: 'BPS Kabupaten Sleman',
    period: 'Okt 2022 – Nov 2022',
    location: 'Sleman, Yogyakarta',
    type: 'Kerja',
    highlights: [
      'Wawancara warga dengan kuesioner Regsosek, geotagging koordinat rumah, dan dokumentasi bangunan.',
    ],
    achievementCallout: '>250 data keluarga valid dalam 1 bulan · 100% target wilayah',
    certificateUrl: '/docs/Sertifikat_BPS_Regsosek_Sleman_Daffa_Hanif.pdf',
    certificateLabel: 'Lihat Sertifikat',
    certificateNumber: 'BPS Kabupaten Sleman · 22 Desember 2022',
    tracks: ['web-data'],
  },
  {
    id: 'exp-pt-mnj',
    role: 'Staf Gudang',
    company: 'PT MNJ (Distributor Resmi PT Konimex)',
    period: 'Okt 2021 – Nov 2021',
    location: 'Serang, Banten',
    type: 'Kerja',
    highlights: [
      'Memeriksa barang masuk dan keluar produk farmasi serta konsumsi agar stok fisik sesuai pencatatan.',
    ],
    tracks: ['web-data', 'it-support'],
  },
  {
    id: 'exp-pt-kanisius',
    role: 'Teknisi Hardware dan Software',
    company: 'PT Kanisius',
    period: 'Jun 2019 – Agu 2019',
    location: 'Sleman, Yogyakarta',
    type: 'Magang',
    highlights: [
      'Menangani kendala perangkat keras, perangkat lunak, dan jalur jaringan lokal workstation kantor.',
    ],
    tracks: ['it-support'],
  },
  {
    id: 'exp-imdkom',
    role: 'Teknisi Hardware Komputer & Laptop',
    company: 'IMDKOM',
    period: 'Mar 2019 – Mei 2019',
    location: 'Sleman, Yogyakarta',
    type: 'Magang',
    highlights: [
      'Mendiagnosis kerusakan komputer dan laptop pelanggan, memperbaiki hardware, serta instalasi ulang OS.',
    ],
    tracks: ['it-support'],
  },
];
