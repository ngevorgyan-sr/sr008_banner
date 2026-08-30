import { access, readFile, stat } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import sharp from 'sharp';

const required = [
  'assets/paint-source.avif',
  'assets/paint-source.webp',
  'assets/paint-poster.webp',
  'assets/sr008-wordmark.svg',
  'assets/fonts/MessinaSans-CondensedRegular.ttf',
  'src/fluid-header.js',
  'src/fluid-header-liquid.js',
  'src/liquid-edge-tuner.js',
  'src/preview.js',
  'dist/fluid-header.min.js',
  'dist/fluid-header-liquid.min.js',
  'index.html',
  'banner.html',
  'liquid-edge-preview.html',
  'liquid-edge.html',
  'styles/preview.css',
  'styles/liquid-edge-tuner.css',
  'wordpress/embed-snippet.html',
  'HOSTING.md',
  'docs/index.html',
  'docs/banner.html',
  'docs/liquid-edge-preview.html',
  'docs/liquid-edge.html',
  'docs/src/liquid-edge-tuner.js',
  'docs/styles/liquid-edge-tuner.css',
  'docs/dist/fluid-header.min.js',
  'docs/dist/fluid-header-liquid.min.js',
  'docs/downloads/sr008-banner-cdn.zip',
  'downloads/sr008-banner-cdn.zip',
  'release/sr008-banner-cdn.zip',
];

await Promise.all(required.map((file) => access(file)));

const expectations = new Map([
  ['assets/paint-source.avif', [2048, 713]],
  ['assets/paint-source.webp', [2048, 713]],
  ['assets/paint-poster.webp', [900, 215]],
]);

for (const [file, [width, height]] of expectations) {
  const meta = await sharp(file).metadata();
  if (meta.width !== width || meta.height !== height) {
    throw new Error(`${file}: expected ${width}x${height}, got ${meta.width}x${meta.height}`);
  }
  if (meta.hasAlpha) throw new Error(`${file}: production image unexpectedly contains alpha`);
}

const source = await readFile('src/fluid-header.js', 'utf8');
for (const token of [
  'export function mount',
  'webgl2',
  'velocityDissipation: 4.65',
  'viscosity: 1.5',
  'restoreRate: 0.005',
  'logoWidth: 0.44',
  'logoChromeStrength: 1.8',
  'logoChromeBevel: 0.1',
  'logoChromeBlackBarAWidth: 2.78',
  'logoChromeBlackBarBWidth: 1.27',
  "logoChromeGradientColor: '#e6edf5'",
  'chromeSurface',
  'whiteTrailA',
  'whiteTrailB',
]) {
  if (!source.includes(token)) throw new Error(`source missing locked production feature ${token}`);
}

for (const removed of ['logoMode', 'logoFluidStrength']) {
  if (source.includes(removed)) throw new Error(`source still includes removed treatment code ${removed}`);
}

const liquidSource = await readFile('src/fluid-header-liquid.js', 'utf8');
for (const token of [
  'FluidHeaderLiquid',
  'logoLiquidEdgeStrength: 1.4',
  'logoLiquidEdgeWidth: 0.1',
  'logoLiquidEdgeSpeed: 1.65',
  'logoLiquidEdgeScale: 0.75',
  'logoLiquidEdgeDistortion: 0.85',
  'logoLiquidEdgeContrast: 0.25',
  'logoLiquidEdgeBrightness: 2',
  'logoLiquidEdgeInner: 0.66',
  'logoLiquidEdgeGlowOpacity: 0.33',
  'logoLiquidEdgeAngle: -65',
  'liquidEdgeMask',
  'liquidEdgeGlowMask',
  'liquidMetalEdge',
  'uniform float uTime',
  'update,',
]) {
  if (!liquidSource.includes(token)) throw new Error(`liquid-edge experiment missing ${token}`);
}

const banner = await readFile('banner.html', 'utf8');
for (const token of [
  'aspect-ratio: 1800 / 430',
  '--sr-radius-banner: 12px',
  'border-radius: var(--sr-radius-banner)',
  'background: transparent',
  'FluidHeader.mount',
  'v=final-5',
  'velocityDissipation: 4.65',
  'viscosity: 1.5',
  'logoWidth: 0.44',
  'logoChromeStrength: 1.8',
  'logoChromeBevel: 0.1',
  'logoChromeBlackBarAWidth: 2.78',
  'logoChromeBlackBarBWidth: 1.27',
  "logoChromeGradientColor: '#e6edf5'",
  'logoChromeGradientOpacity: 0.79',
  'logoChromePointer: 1.15',
]) {
  if (!banner.includes(token)) throw new Error(`banner missing ${token}`);
}
for (const removed of ['Copy Config', '>Reset<', '>Pause<', 'Logo Treatment', 'data-logo-mode']) {
  if (banner.includes(removed)) throw new Error(`banner still contains removed UI ${removed}`);
}

const preview = await readFile('index.html', 'utf8');
for (const token of ['SR008 Banner Treatment', 'Copy Embed Code', 'Download CDN Package', 'banner.html']) {
  if (!preview.includes(token)) throw new Error(`preview missing ${token}`);
}


const liquidBanner = await readFile('liquid-edge.html', 'utf8');
for (const token of [
  'FluidHeaderLiquid.mount',
  'fluid-header-liquid.min.js?v=liquid-edge-test-5',
  'logoLiquidEdgeStrength: 1.4',
  'logoLiquidEdgeWidth: 0.1',
  'logoLiquidEdgeSpeed: 1.65',
  'logoLiquidEdgeScale: 0.75',
  'logoLiquidEdgeDistortion: 0.85',
  'logoLiquidEdgeContrast: 0.25',
  'logoLiquidEdgeBrightness: 2',
  'logoLiquidEdgeInner: 0.66',
  'logoLiquidEdgeGlowOpacity: 0.33',
  'logoLiquidEdgeAngle: -65',
  'sr008-liquid-edge-config',
]) {
  if (!liquidBanner.includes(token)) throw new Error(`liquid-edge banner missing ${token}`);
}

const liquidPreview = await readFile('liquid-edge-preview.html', 'utf8');
for (const token of [
  'Liquid Edge Controls',
  'data-edge-setting="logoLiquidEdgeWidth"',
  'data-edge-setting="logoLiquidEdgeGlowOpacity"',
  'data-edge-setting="logoLiquidEdgeSpeed"',
  'data-edge-setting="logoLiquidEdgeAngle"',
  'src/liquid-edge-tuner.js?v=liquid-edge-test-5',
]) {
  if (!liquidPreview.includes(token)) throw new Error(`liquid-edge preview missing ${token}`);
}

const tuner = await readFile('src/liquid-edge-tuner.js', 'utf8');
for (const token of ['sendSettings', 'sr008-liquid-edge-config', 'copySettings', 'reset-edge-settings']) {
  if (!tuner.includes(token)) throw new Error(`liquid-edge tuner missing ${token}`);
}

for (const [sourceFile, publicFile] of [
  ['index.html', 'docs/index.html'],
  ['banner.html', 'docs/banner.html'],
  ['liquid-edge-preview.html', 'docs/liquid-edge-preview.html'],
  ['liquid-edge.html', 'docs/liquid-edge.html'],
  ['src/liquid-edge-tuner.js', 'docs/src/liquid-edge-tuner.js'],
  ['styles/liquid-edge-tuner.css', 'docs/styles/liquid-edge-tuner.css'],
  ['dist/fluid-header.min.js', 'docs/dist/fluid-header.min.js'],
  ['dist/fluid-header-liquid.min.js', 'docs/dist/fluid-header-liquid.min.js'],
]) {
  const [sourceBytes, publicBytes] = await Promise.all([readFile(sourceFile), readFile(publicFile)]);
  if (!sourceBytes.equals(publicBytes)) throw new Error(`${publicFile} is stale`);
}

const bundle = await readFile('dist/fluid-header.min.js');
const bundleStat = await stat('dist/fluid-header.min.js');
const liquidBundleStat = await stat('dist/fluid-header-liquid.min.js');
const gzipBytes = gzipSync(bundle, { level: 9 }).byteLength;
const zipStat = await stat('release/sr008-banner-cdn.zip');

if (bundleStat.size > 40 * 1024) {
  throw new Error(`bundle is ${(bundleStat.size / 1024).toFixed(1)} KB; budget is 40 KB`);
}
if (liquidBundleStat.size > 45 * 1024) {
  throw new Error(`liquid-edge bundle is ${(liquidBundleStat.size / 1024).toFixed(1)} KB; budget is 45 KB`);
}
if (zipStat.size > 2 * 1024 * 1024) {
  throw new Error(`CDN package is ${(zipStat.size / 1024 / 1024).toFixed(1)} MB; budget is 2 MB`);
}

console.log(`bundle: ${(bundleStat.size / 1024).toFixed(1)} KB minified`);
console.log(`bundle: ${(gzipBytes / 1024).toFixed(1)} KB gzip`);
console.log(`liquid-edge bundle: ${(liquidBundleStat.size / 1024).toFixed(1)} KB minified`);
console.log(`CDN package: ${(zipStat.size / 1024 / 1024).toFixed(2)} MB`);
console.log('validation: passed');
