import type { RunbookCaselet } from '@/types/portfolio';

export const RUNBOOK_CASELETS: RunbookCaselet[] = [
  {
    id: 'runbook-amikom-lan',
    domain: 'IT Support',
    title: 'Perawatan PC & Isolasi Gangguan Jaringan LAN Lab',
    context: 'Staf Laboratorium · Universitas Amikom Yogyakarta (Apr 2026 – Sep 2026)',
    symptom:
      'Sebagian workstation praktikum mengalami gagal koneksi jaringan lokal (LAN) atau performa lambat menjelang sesi praktikum berlangsung.',
    diagnosis:
      'Pengecekan bertahap mulai dari status link kabel UTP/port switch, konfigurasi IP/DHCP klien, hingga audit kondisi hardware dan aplikasi latar pada unit PC.',
    resolution:
      'Mengisolasi jalur kabel dan port bermasalah, melakukan pemulihan konfigurasi jaringan lokal, pembersihan perangkat, serta pencatatan inventaris perbaikan.',
    outcome:
      'Predikat Memuaskan pada evaluasi Staf Laboratorium (Nilai 90 Perawatan PC, 85 Troubleshooting, 80 Jaringan LAN).',
    tracks: ['it-support'],
    relatedCertificate: {
      id: 'runbook-cert-amikom',
      title: 'Sertifikat Staf Laboratorium · Universitas Amikom Yogyakarta',
      issuer: 'UPT Laboratorium Universitas Amikom Yogyakarta',
      date: 'Apr 2026 – Sep 2026',
      summary: 'Predikat Memuaskan · Nilai 90 PC, 85 Troubleshooting, 80 LAN',
      credentialId: '014/UPT/LAB/SS/IX/2026',
      pdfUrl: '/docs/Sertifikat_Staf_Laboratorium_Amikom_Daffa_Hanif.pdf',
    },
  },
  {
    id: 'runbook-ccna-network',
    domain: 'Network',
    title: 'Perancangan Dasar Jaringan, Subnetting & Konektivitas LAN',
    context: 'CCNAv7 Cisco Networking Academy (2023) & TKJ SMK Tamansiswa Jetis',
    symptom:
      'Kebutuhan segmentasi alamat IP dan penataan komunikasi antar perangkat dalam jaringan lokal agar stabil dan mudah dilacak saat terjadi kendala.',
    diagnosis:
      'Pemetaan kebutuhan host per segmen (IPv4/subnetting), verifikasi tabel routing/switching dasar, serta pengujian konektivitas end-to-end (ping/traceroute).',
    resolution:
      'Menerapkan skema pengalamatan terstruktur, konfigurasi dasar switch dan router, serta dokumentasi topologi untuk mempercepat proses troubleshooting.',
    outcome:
      'Lulus sertifikasi resmi CCNAv7: Introduction to Networks (Cisco Networking Academy) dan lulusan TKJ dengan rerata 85,5.',
    tracks: ['it-support'],
    relatedCertificate: {
      id: 'runbook-cert-ccna',
      title: 'CCNAv7: Introduction to Networks',
      issuer: 'Cisco Networking Academy',
      date: '17 Okt 2023',
      credentialId: '2b8abaae-2b3d-47d2-a2f1-c30893c7b04f',
      pdfUrl: '/docs/Sertifikat_CCNAv7_Introduction_to_Networks_Daffa_Hanif.pdf',
    },
  },
  {
    id: 'runbook-field-ops',
    domain: 'Data Ops',
    title: 'Diagnosa Hardware Workstation & Validasi Data Lapangan',
    context: 'BPS Kabupaten Sleman (Regsosek) · PT Kanisius · IMDKOM',
    symptom:
      'Dua pola tantangan lapangan: kegagalan booting/OS pada PC kantor & pelanggan, serta risiko inkonsistensi kuesioner dan koordinat pada pendataan ratusan rumah tangga.',
    diagnosis:
      'Isolasi kerusakan komponen (RAM, storage, OS) sebelum reinstall pada unit PC; verifikasi kelengkapan atribut, geotagging GPS, dan foto bangunan di lapangan.',
    resolution:
      'Perbaikan hardware serta instalasi ulang OS bersih pada perangkat terdampak, dan validasi silang berkala pada setiap entri kuesioner Regsosek.',
    outcome:
      '>250 data keluarga valid terselesaikan dalam 1 bulan (100% target wilayah BPS Sleman) serta operasional workstation kantor kembali normal.',
    tracks: ['web-data', 'it-support'],
    relatedCertificate: {
      id: 'runbook-cert-bps',
      title: 'Sertifikat Petugas Pendataan Lapangan (Regsosek)',
      issuer: 'Badan Pusat Statistik Kabupaten Sleman',
      date: '22 Desember 2022',
      summary: '>250 data keluarga valid dalam 1 bulan · 100% target wilayah',
      credentialId: 'BPS Kabupaten Sleman · BSrE BSSN',
      pdfUrl: '/docs/Sertifikat_BPS_Regsosek_Sleman_Daffa_Hanif.pdf',
    },
  },
];
