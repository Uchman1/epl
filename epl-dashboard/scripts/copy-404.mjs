// GitHub Pages has no server-side rewrites, so a direct visit or refresh on
// a deep link (e.g. /teams/arsenal) would 404. GitHub Pages does serve a
// custom 404.html for any unmatched path, so shipping a copy of index.html
// as 404.html makes the app boot there too — React Router then reads the
// real URL from the browser and renders the right route client-side.
import { copyFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const dist = resolve(process.cwd(), 'dist');
const indexPath = resolve(dist, 'index.html');
const notFoundPath = resolve(dist, '404.html');

if (!existsSync(indexPath)) {
  console.error('dist/index.html not found — run `vite build` first.');
  process.exit(1);
}

copyFileSync(indexPath, notFoundPath);
console.log('Copied dist/index.html -> dist/404.html for GitHub Pages SPA fallback.');
