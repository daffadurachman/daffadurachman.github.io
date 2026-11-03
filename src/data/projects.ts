import type { ProjectItem } from '@/types/portfolio';

export const PROJECTS: ProjectItem[] = [
  {
    slug: 'klasifikasi-ikan-resnet50-gradcam',
    title:
      'Analisis Performa Melalui Optimasi Adam dan Grad-CAM dengan ResNet50 pada Klasifikasi Multi-Kelas Ikan',
    shortTitle: 'Klasifikasi Multi-Kelas Ikan & XAI (ResNet50 + Grad-CAM)',
    subtitle:
      'Mengklasifikasikan 9 spesies ikan laut memakai ResNet50 dan memverifikasi fokus model lewat Grad-CAM.',
    category: 'Python & Data',
    statusLabel: 'Selesai',
    year: '2026',
    role: 'Deep Learning & Aplikasi Web',
    isFeatured: true,
    thumbnail: {
      src: '/images/projects/classifishcation-streamlit.jpg',
      alt: 'Tampilan aplikasi web Streamlit Classifishcation untuk klasifikasi 9 spesies ikan dengan ResNet50 dan Grad-CAM karya Daffa Hanif D.',
      width: 1280,
      height: 670,
    },
    summary: 'Klasifikasi 9 spesies ikan dari 9.000 foto dengan peta panas Grad-CAM di Streamlit.',
    cardTags: ['TensorFlow', 'ResNet50', 'Streamlit'],
    problemStatement:
      'Model klasifikasi citra sering menebak spesies ikan dari warna air atau latar belakang, bukan bentuk tubuhnya. Grad-CAM ditambahkan untuk memastikan prediksi benar-benar membaca morfologi ikan.',
    approachHeading: 'Tahapan Teknis & Metodologi',
    approachSummary: 'Pipeline pelatihan dari 9.000 foto hingga rilis demo Streamlit:',
    approachSteps: [
      'Menyaring 9.000 foto (9 spesies) dari A Large-Scale Fish Dataset dan membuang mask biner.',
      'Membagi data latih/uji 80:20, resize 224×224 px, dan normalisasi standar ImageNet.',
      'Membekukan backbone ResNet50 dengan head Dense 512, Dropout 0.5, dan Softmax 9 kelas.',
      'Melatih dengan Adam, EarlyStopping, dan ReduceLROnPlateau.',
      'Memvalidasi area fokus lewat Grad-CAM pada layer conv5_block3_out.',
      'Menayangkan antarmuka unggah foto dan heatmap langsung di Streamlit.',
    ],
    sectionTwoMutedHeading: 'Hasil ',
    sectionTwoPrimaryHeading: '& Metrik Evaluasi',
    resultsHeading: 'Ringkasan Hasil',
    techStack: [
      {
        name: 'Python',
        purpose: 'Olah citra, pelatihan model, dan perhitungan metrik evaluasi',
      },
      {
        name: 'TensorFlow',
        purpose: 'Pelatihan model beserta EarlyStopping dan ReduceLROnPlateau',
      },
      {
        name: 'ResNet50',
        purpose: 'Backbone Transfer Learning dengan head Dense 512, Dropout 0.5, Softmax 9 kelas',
      },
      {
        name: 'Grad-CAM',
        purpose: 'Peta panas visual pada conv5_block3_out untuk memverifikasi fokus tubuh ikan',
      },
      {
        name: 'Streamlit',
        purpose: 'Antarmuka web untuk unggah foto dan uji prediksi langsung',
      },
    ],
    results: [
      {
        metric: 'Test Accuracy: 99.94%',
        description: 'Pada klasifikasi 9 spesies ikan laut (split uji 20%).',
      },
      {
        metric: 'Test Loss: 0.00412',
        description: 'Konvergen rendah tanpa indikasi overfitting berat.',
      },
      {
        metric: 'Epoch ke-10 (15,15 Menit)',
        description: 'Stabil cepat menggunakan optimizer Adam.',
      },
      {
        metric: 'Validasi XAI (Grad-CAM)',
        description: 'Sorotan jatuh tepat pada kepala, sirip, dan badan ikan.',
      },
    ],
    repoUrl: 'https://github.com/daffahanif6/ResNet50-fish-classifier-Adam-gradcam.git',
    repoStatusLabel: 'Repositori Publik Tersedia',
    liveUrl: 'https://klasifikasiikan.streamlit.app/',
    pipelineNodes: [
      {
        id: 'fish-1-dataset',
        step: '01',
        label: 'Dataset Citra',
        metric: '9.000 Foto · 9 Spesies',
        detail: 'Menyaring citra asli dari A Large-Scale Fish Dataset dan membuang file mask biner agar model fokus pada morfologi ikan.',
      },
      {
        id: 'fish-2-preprocess',
        step: '02',
        label: 'Preprocessing',
        metric: '224×224 px · 80:20',
        detail: 'Resize citra seragam ke 224×224 px, normalisasi standar ImageNet, serta pemisahan data latih dan uji 80:20.',
      },
      {
        id: 'fish-3-resnet',
        step: '03',
        label: 'ResNet50 + Adam',
        metric: 'Epoch 10 · 15,15 mnt',
        detail: 'Backbone ResNet50 dibekukan dengan head Dense 512, Dropout 0.5, Softmax 9 kelas, EarlyStopping, dan ReduceLROnPlateau.',
      },
      {
        id: 'fish-4-gradcam',
        step: '04',
        label: 'Validasi Grad-CAM',
        metric: 'conv5_block3_out',
        detail: 'Ekstraksi peta panas visual pada layer konvolusi akhir untuk membuktikan prediksi membaca kepala, sirip, dan badan ikan.',
      },
      {
        id: 'fish-5-streamlit',
        step: '05',
        label: 'Rilis Streamlit',
        metric: 'Test Acc 99.94%',
        detail: 'Antarmuka web interaktif untuk unggah foto ikan, melihat skor probabilitas, serta memverifikasi overlay Grad-CAM secara langsung.',
      },
    ],
    mediaBlocks: [
      {
        id: 'resnet50-gradcam-arch',
        layout: 'full',
        caption:
          'Antarmuka Streamlit Classifishcation untuk prediksi 9 spesies ikan dan peta panas Grad-CAM.',
        images: [
          {
            src: '/images/projects/classifishcation-streamlit.jpg',
            alt: 'Tangkapan layar beranda aplikasi Streamlit Classifishcation (21.11.4470 | Daffa Hanif D.)',
            width: 1280,
            height: 670,
          },
        ],
      },
    ],
  },
  {
    slug: 'klasifikasi-alkohol-spark-mllib',
    title:
      'Perbandingan Kinerja Klasifikasi Menggunakan MLlib Apache Spark pada Efek Konsumsi Alkohol dan Rokok',
    shortTitle: 'Klasifikasi Data Klinis Skala Besar (Apache Spark MLlib)',
    subtitle:
      'Mengolah 991.346 catatan klinis secara terdistribusi memakai Apache Spark MLlib untuk memprediksi konsumsi alkohol.',
    category: 'Python & Data',
    statusLabel: 'Grade A · Selesai',
    year: '2025',
    role: 'ML & Big Data (90% Kode)',
    achievementMeta: 'Grade A (Big Data & Predictive Analytics Advance)',
    isFeatured: false,
    thumbnail: {
      src: '/images/projects/spark-mllib-alcohol-classification.svg',
      alt: 'Komparasi 4 model Apache Spark MLlib dan XGBoost pada 991.346 data klinis',
      width: 800,
      height: 500,
    },
    summary: 'Komparasi 4 model ML pada 991.346 data klinis terdistribusi (Nilai A).',
    cardTags: ['PySpark', 'Spark MLlib', 'XGBoost'],
    problemStatement:
      'Hampir satu juta baris data dengan 24 variabel medis (tekanan darah, kolesterol, SGOT/SGPT/Gamma-GTP) terlalu berat diproses di satu mesin biasa. Kluster Spark dipakai agar pembersihan dan pelatihan empat model berjalan tanpa kehabisan memori.',
    approachHeading: 'Alur Pengolahan Terdistribusi',
    approachSummary: 'Tahapan pipeline data dan komparasi empat model di PySpark:',
    approachSteps: [
      'Konfigurasi SparkSession (executor 4 GB, driver 2 GB).',
      'Audit nilai kosong, sebaran fitur, keseimbangan kelas (50:50), dan korelasi.',
      'Clipping outlier IQR, hapus 26 duplikat, dan buang nilai inf/NaN.',
      'Encoding label dengan StringIndexer dan rakit 23 fitur via VectorAssembler.',
      'Split 70:30 (693.869 latih, 297.451 uji) dengan seed tetap.',
      'Latih dan bandingkan GBT, Random Forest, Naive Bayes, dan XGBoost.',
    ],
    sectionTwoMutedHeading: 'Hasil ',
    sectionTwoPrimaryHeading: '& Komparasi Model',
    resultsHeading: 'Sorotan Evaluasi',
    evaluationTable: {
      heading: 'Tabel Evaluasi Data Uji (297.451 sampel)',
      columns: ['Model Algoritma', 'Akurasi', 'F1-Score', 'Weighted Precision', 'AUC-ROC'],
      rows: [
        ['XGBoost Classifier', '74.00%', '74.00%', '74.00%', '0.8100'],
        ['GBT Classifier (Spark MLlib)', '72.89%', '72.88%', '72.91%', '0.8083'],
        ['Random Forest (Spark MLlib)', '71.06%', '71.06%', '71.07%', '0.7891'],
        ['Naive Bayes (Spark MLlib)', '64.02%', '63.74%', '64.46%', '0.4104'],
      ],
    },
    evaluationInsight:
      'Model berbasis pohon seperti XGBoost (AUC 0.8100) dan GBT (AUC 0.8083) paling kuat menangkap interaksi biomarker darah, terutama kadar enzim hati Gamma-GTP.',
    techStack: [
      {
        name: 'PySpark',
        purpose: 'Komputasi kluster SparkSession (Executor 4 GB, Driver 2 GB)',
      },
      {
        name: 'Apache Spark MLlib',
        purpose: 'Pipeline StringIndexer, VectorAssembler (23 fitur), GBT, RF, dan Naive Bayes',
      },
      {
        name: 'XGBoost',
        purpose: 'Model skor tertinggi pada data uji (Akurasi 74.00%, AUC 0.8100)',
      },
      {
        name: 'Python',
        purpose: 'Eksplorasi data, clipping outlier IQR, dan evaluasi metrik',
      },
    ],
    results: [
      {
        metric: 'AUC-ROC 0.8100 (XGBoost)',
        description: 'Tertinggi dari empat model yang diuji pada 297.451 sampel.',
      },
      {
        metric: '991.346 Catatan Klinis',
        description: 'Mencakup 24 variabel medis dari tekanan darah hingga enzim hati.',
      },
      {
        metric: 'Grade A · 90% Codebase',
        description: 'Menangani mayoritas kode pipeline Big Data & evaluasi.',
      },
    ],
    repoUrl: 'https://github.com/daffahanif6/BDPA-Klasifikasi-Peminum.git',
    repoStatusLabel: 'Repositori GitHub Tersedia',
    liveUrl: null,
    pipelineNodes: [
      {
        id: 'spark-1-cluster',
        step: '01',
        label: 'SparkSession',
        metric: '991.346 Baris · 4 GB',
        detail: 'Menginisialisasi sesi terdistribusi PySpark (Executor 4 GB, Driver 2 GB) agar hampir satu juta catatan klinis terolah stabil tanpa OOM.',
      },
      {
        id: 'spark-2-clean',
        step: '02',
        label: 'Pembersihan IQR',
        metric: '24 Variabel Medis',
        detail: 'Audit nilai kosong dan keseimbangan kelas 50:50, clipping outlier IQR pada biomarker darah, penghapusan 26 duplikat dan nilai NaN/inf.',
      },
      {
        id: 'spark-3-vector',
        step: '03',
        label: 'Pipeline MLlib',
        metric: 'Split 70:30 · 23 Fitur',
        detail: 'Encoding label dengan StringIndexer dan perakitan 23 fitur numerik via VectorAssembler ke 693.869 data latih dan 297.451 data uji.',
      },
      {
        id: 'spark-4-bench',
        step: '04',
        label: 'Benchmark 4 Model',
        metric: 'XGBoost AUC 0.8100',
        detail: 'Komparasi GBT, Random Forest, Naive Bayes, dan XGBoost; model berbasis pohon tertinggi berkat sensitivitas terhadap enzim Gamma-GTP.',
      },
    ],
    mediaBlocks: [
      {
        id: 'spark-mllib-arch-1',
        layout: 'full',
        caption: 'Ringkasan skor komparasi 4 algoritma klasifikasi pada 991.346 catatan klinis.',
        images: [
          {
            src: '/images/projects/spark-mllib-alcohol-classification.svg',
            alt: 'Visualisasi komparasi model Apache Spark MLlib dan XGBoost pada data klinis',
            width: 800,
            height: 500,
          },
        ],
      },
    ],
  },
  {
    slug: 'deteksi-apd-konstruksi-yolov12',
    title: 'Implementasi YOLOv12 untuk Deteksi dan Klasifikasi Pekerja dengan APD di Lokasi Konstruksi',
    shortTitle: 'Deteksi APD Konstruksi Real-Time (YOLOv12)',
    subtitle:
      'Mendeteksi kepatuhan helm dan rompi pekerja proyek secara real-time memakai YOLOv12n.',
    category: 'Python & Data',
    statusLabel: 'Grade A · Selesai',
    year: '2025',
    role: 'Computer Vision',
    achievementMeta: 'Grade A (Mata Kuliah Big Data & Data Mining)',
    isFeatured: false,
    thumbnail: {
      src: '/images/projects/yolov12-apd-detection.svg',
      alt: 'Visualisasi deteksi real-time APD konstruksi (helmet, vest, person) menggunakan YOLOv12n',
      width: 800,
      height: 500,
    },
    summary: 'Deteksi 5 kelas helm & rompi pekerja konstruksi real-time (Nilai A).',
    cardTags: ['YOLOv12', 'PyTorch', 'Roboflow'],
    problemStatement:
      'Di lokasi proyek yang ramai, pengawas sulit mengecek kepatuhan helm dan rompi setiap pekerja secara manual. Deteksi objek otomatis menandai pelanggaran APD langsung dari umpan kamera.',
    approachHeading: 'Metodologi Pelatihan',
    approachSummary: 'Lima tahap pelatihan YOLOv12n (2,52M parameter) di GPU Tesla T4:',
    approachSteps: [
      'Memakai arsitektur attention-centric YOLOv12n (2,52M parameter) pada GPU Tesla T4.',
      'Mengambil dataset 5 kelas lewat Roboflow API (helmet, no-helmet, vest, no-vest, person).',
      'Augmentasi rotasi, geser posisi, HSV, dan horizontal flip.',
      'Pelatihan AdamW, early stopping (patience 10), resolusi 640×640 px.',
      'Evaluasi mAP multi-skala (small, medium, large) memakai pustaka supervision.',
    ],
    sectionTwoMutedHeading: 'Hasil ',
    sectionTwoPrimaryHeading: '& Metrik Evaluasi',
    resultsHeading: 'Metrik Kunci',
    evaluationInsight:
      'Deteksi terkuat muncul pada kelas person dan helmet (>220 true positives), dengan skor 78.00% mAP@50 pada objek kecil untuk pantauan kamera jarak jauh.',
    techStack: [
      {
        name: 'YOLOv12',
        purpose: 'Detektor objek berbasis attention mechanism (YOLOv12n, 2,52M parameter)',
      },
      {
        name: 'PyTorch',
        purpose: 'Pelatihan tensor dengan optimizer AdamW pada GPU Tesla T4',
      },
      {
        name: 'Roboflow',
        purpose: 'Pengelolaan anotasi 5 kelas APD konstruksi',
      },
      {
        name: 'Supervision',
        purpose: 'Evaluasi mAP per ukuran objek (small, medium, large)',
      },
      {
        name: 'OpenCV',
        purpose: 'Pra-proses frame 640×640 px dan rendering kotak deteksi',
      },
    ],
    results: [
      {
        metric: 'Peak Val mAP@50: 87.41%',
        description: 'Capaian validasi puncak pada input 640×640 px.',
      },
      {
        metric: 'Optimal F1-Score: 0.80',
        description: 'Tercapai pada confidence threshold 0.539.',
      },
      {
        metric: 'Test Set mAP@50: 68.92%',
        description: 'Evaluasi data uji independen (mAP@50:95: 35.30%).',
      },
    ],
    repoUrl: 'https://github.com/daffahanif6',
    repoButtonLabel: 'Lihat Repositori & Notebook',
    repoStatusLabel: 'Repositori & Notebook Tersedia',
    liveUrl: null,
    pipelineNodes: [
      {
        id: 'yolo-1-roboflow',
        step: '01',
        label: 'Anotasi Roboflow',
        metric: '5 Kelas APD',
        detail: 'Mengambil dataset terlabel 5 kelas lapangan konstruksi (helmet, no-helmet, vest, no-vest, person) melalui Roboflow API.',
      },
      {
        id: 'yolo-2-augment',
        step: '02',
        label: 'Augmentasi Citra',
        metric: 'Resolusi 640×640 px',
        detail: 'Menerapkan rotasi, translasi, variasi warna HSV, dan horizontal flip agar detektor tahan terhadap variasi cahaya lapangan.',
      },
      {
        id: 'yolo-3-train',
        step: '03',
        label: 'YOLOv12n (T4)',
        metric: '2,52M Param · AdamW',
        detail: 'Melatih arsitektur attention-centric YOLOv12n di GPU Tesla T4 menggunakan optimizer AdamW dan early stopping (patience 10).',
      },
      {
        id: 'yolo-4-eval',
        step: '04',
        label: 'Evaluasi Multi-Skala',
        metric: 'Peak mAP@50 87.41%',
        detail: 'Mengukur mAP per ukuran objek via Supervision; optimal F1-Score 0.80 pada threshold 0.539 dan 78.00% mAP@50 pada objek kecil.',
      },
    ],
    mediaBlocks: [
      {
        id: 'yolov12-apd-arch-1',
        layout: 'full',
        caption: 'Skema deteksi 5 kelas APD konstruksi YOLOv12n dan ringkasan skor mAP.',
        images: [
          {
            src: '/images/projects/yolov12-apd-detection.svg',
            alt: 'Visualisasi deteksi objek YOLOv12n pada pekerja konstruksi dengan APD',
            width: 800,
            height: 500,
          },
        ],
      },
    ],
  },
];
