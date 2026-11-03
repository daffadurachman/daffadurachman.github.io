import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.resolve(process.cwd(), 'out');
const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || 'localhost';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function resolveFilePath(urlPath) {
  const safePath = path.normalize(urlPath).replace(/^(\.\.(\/|\\|$))+/, '');
  let candidate = path.join(OUT_DIR, safePath);

  if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
    const indexHtml = path.join(candidate, 'index.html');
    if (fs.existsSync(indexHtml)) return indexHtml;
  }

  if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
    return candidate;
  }

  if (!path.extname(candidate) && fs.existsSync(`${candidate}.html`)) {
    return `${candidate}.html`;
  }

  return null;
}

const server = http.createServer((req, res) => {
  const reqUrl = decodeURIComponent((req.url || '/').split('?')[0]);
  const filePath = resolveFilePath(reqUrl);

  if (!filePath) {
    const notFoundPage = path.join(OUT_DIR, '404.html');
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    if (fs.existsSync(notFoundPage)) {
      res.end(fs.readFileSync(notFoundPage));
    } else {
      res.end('404 Not Found');
    }
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': contentType });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, () => {
  console.log(`Server portofolio statis berjalan di http://${HOST}:${PORT}`);
});

