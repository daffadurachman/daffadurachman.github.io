/** @type {import('next').NextConfig} */
const createNextConfig = (phase) => ({
  output: 'export',
  distDir: phase === 'phase-development-server' ? '.next-dev' : '.next',
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  images: {
    unoptimized: true,
  },
});

export default createNextConfig;

