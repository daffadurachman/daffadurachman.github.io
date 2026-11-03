# Portofolio Daffa Hanif Durachman

Web portofolio dan studi kasus proyek Daffa Hanif Durachman (S1 Informatika Universitas Amikom Yogyakarta), mencakup pengembangan aplikasi web, pengolahan data Python, serta dukungan perawatan PC dan jaringan LAN.

## Tech Stack

- **Framework:** Next.js 15 (App Router, Static Export `output: 'export'`)
- **UI Library:** React 19 & TypeScript
- **Styling:** CSS Modules & Custom Design Tokens (Light & AMOLED Dark Mode)
- **Motion & Scroll:** GSAP (`ScrollTrigger`), Motion (`motion/react`), dan Lenis Smooth Scroll

## Menjalankan Proyek secara Lokal

Pastikan menggunakan **Node.js >= 20** (sesuai `.nvmrc`).

```bash
# Pasang dependensi
npm install

# Jalankan server development
npm run dev

# Build static export ke direktori out/
npm run build

# Pratinjau hasil static build (out/) di http://localhost:3000
npm run serve

# Jalankan rangkaian pengujian otomatis
npm test
```

## Konfigurasi Deployment

Proyek ini dikonfigurasi untuk menghasilkan static HTML di folder `out/` (`output: 'export'`, `public/.nojekyll`).

### GitHub Pages (`https://daffadurachman.github.io`)

- Workflow otomatis tersedia di `.github/workflows/deploy.yml` (Node.js `20` dari `.nvmrc`, `npm ci`, `npm run build`, `npm test`, deploy `./out`).
- Pada repositori `daffadurachman/daffadurachman.github.io`, aktifkan **Settings -> Pages -> Build and deployment -> Source: GitHub Actions**.

### Cloudflare Pages (Opsional)

- **Framework preset:** Next.js (Static HTML Export)
- **Build command:** `npm run build`
- **Build output directory:** `out`
- **Node.js version:** `20` (otomatis terbaca dari `.nvmrc` atau variabel environment `NODE_VERSION = 20`)
