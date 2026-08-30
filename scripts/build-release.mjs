import { execFile } from 'node:child_process';
import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const run = promisify(execFile);
const root = fileURLToPath(new URL('../', import.meta.url));
const docs = `${root}docs`;
const release = `${root}release`;
const downloads = `${root}downloads`;
const packageRoot = `${release}/sr008-banner`;

await rm(docs, { recursive: true, force: true });
await rm(release, { recursive: true, force: true });
await rm(downloads, { recursive: true, force: true });

for (const directory of [
  docs,
  `${docs}/assets/fonts`,
  `${docs}/dist`,
  `${docs}/downloads`,
  `${docs}/src`,
  `${docs}/styles`,
  downloads,
  `${packageRoot}/assets`,
  `${packageRoot}/dist`,
]) {
  await mkdir(directory, { recursive: true });
}

const publicFiles = [
  ['index.html', 'index.html'],
  ['banner.html', 'banner.html'],
  ['src/preview.js', 'src/preview.js'],
  ['styles/preview.css', 'styles/preview.css'],
  ['dist/fluid-header.min.js', 'dist/fluid-header.min.js'],
  ['assets/paint-source.avif', 'assets/paint-source.avif'],
  ['assets/paint-source.webp', 'assets/paint-source.webp'],
  ['assets/paint-poster.webp', 'assets/paint-poster.webp'],
  ['assets/sr008-wordmark.svg', 'assets/sr008-wordmark.svg'],
  ['assets/fonts/MessinaSans-VF-Upright.ttf', 'assets/fonts/MessinaSans-VF-Upright.ttf'],
  ['assets/fonts/MessinaSansCondensed-SemiBold.otf', 'assets/fonts/MessinaSansCondensed-SemiBold.otf'],
];

for (const [source, target] of publicFiles) {
  await cp(`${root}${source}`, `${docs}/${target}`);
}
await writeFile(`${docs}/.nojekyll`, '');

for (const file of [
  'banner.html',
  'dist/fluid-header.min.js',
  'assets/paint-source.avif',
  'assets/paint-source.webp',
  'assets/paint-poster.webp',
  'assets/sr008-wordmark.svg',
]) {
  await cp(`${root}${file}`, `${packageRoot}/${file}`);
}
await cp(`${root}HOSTING.md`, `${packageRoot}/README.md`);
await cp(`${root}wordpress/embed-snippet.html`, `${packageRoot}/wordpress-embed.html`);

await run('zip', ['-qr', 'sr008-banner-cdn.zip', 'sr008-banner'], { cwd: release });
await cp(`${release}/sr008-banner-cdn.zip`, `${docs}/downloads/sr008-banner-cdn.zip`);
await cp(`${release}/sr008-banner-cdn.zip`, `${downloads}/sr008-banner-cdn.zip`);

console.log('release: docs/ refreshed');
console.log('release: release/sr008-banner-cdn.zip created');
