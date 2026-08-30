// Dev-time only: generates production derivatives from the approved V1 PNG.
// Full textures retain oversized bleed; posters use the exact 1800:430 safe-canvas ratio.
import sharp from 'sharp';
import { stat } from 'node:fs/promises';

const OUT = new URL('../assets/', import.meta.url).pathname;

const report = async (file) => {
  const { size } = await stat(file);
  console.log(`${file.replace(OUT, 'assets/')}  ${(size / 1024).toFixed(1)} KB`);
};

const variants = [{
  source: new URL('../assets/paint-source.png', import.meta.url).pathname,
  outputStem: 'paint-source',
  poster: 'paint-poster.webp',
  safeCrop: { left: 243, top: 183, width: 1800, height: 430 },
}];

for (const variant of variants) {
  const meta = await sharp(variant.source).metadata();
  console.log(`${variant.outputStem} source: ${meta.width}x${meta.height}`);

  // Retain the complete source because its outer pixels are simulation bleed.
  // Runtime derivatives drop the fully opaque alpha channel.
  const avif = OUT + `${variant.outputStem}.avif`;
  await sharp(variant.source)
    .removeAlpha()
    .resize({ width: 2048, withoutEnlargement: true })
    .avif({ quality: 58, effort: 6, chromaSubsampling: '4:4:4' })
    .toFile(avif);
  await report(avif);

  const webp = OUT + `${variant.outputStem}.webp`;
  await sharp(variant.source)
    .removeAlpha()
    .resize({ width: 2048, withoutEnlargement: true })
    .webp({ quality: 80, smartSubsample: true })
    .toFile(webp);
  await report(webp);

  // Crop first so the static resting composition exactly matches WebGL.
  const poster = OUT + variant.poster;
  await sharp(variant.source)
    .extract(variant.safeCrop)
    .removeAlpha()
    .resize({ width: 900, height: 215, fit: 'fill' })
    .webp({ quality: 70, smartSubsample: true })
    .toFile(poster);
  await report(poster);
}
