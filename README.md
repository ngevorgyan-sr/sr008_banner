# SR008 Banner Treatment

Final production build of the responsive SR008 interactive paint banner. The paint uses the approved lacquer-like fluid settings and the centered wordmark uses the locked Chrome treatment with two non-repeating black reflection bars, white trailing highlights, the approved gradient overlay, and an animated liquid-metal inner edge with highlight glow.

- Public preview: `https://ngevorgyan-sr.github.io/sr008_banner/`
- Direct WordPress embed: `https://ngevorgyan-sr.github.io/sr008_banner/banner.html?v=final-6`

## Preview

Run the local server and open the preview:

```bash
npm run serve
```

- Preview: `http://127.0.0.1:4173/`
- Production banner only: `http://127.0.0.1:4173/banner.html`

The preview contains only the final banner, a copyable WordPress iframe embed, and the downloadable CDN package.

## Production Files

- `banner.html` — responsive, transparent, rounded iframe document.
- `dist/fluid-header.min.js` — optimized Chrome and liquid-metal-edge WebGL runtime.
- `assets/paint-source.avif` and `.webp` — optimized paint texture.
- `assets/paint-poster.webp` — fallback poster.
- `assets/sr008-wordmark.svg` — logo mask.
- `docs/` — ready-to-publish GitHub Pages site.
- `release/sr008-banner-cdn.zip` — minimal CDN upload package.

## Build and Export

```bash
npm install
npm run release
```

See [HOSTING.md](HOSTING.md) for GitHub Pages, CDN, and WordPress instructions.

## Browser Behavior

The embed always fills its parent width and preserves the 1800×430 aspect ratio. All artwork, fluid displacement, and logo proportions scale together. Transparent iframe and document backgrounds allow the 12px rounded banner corners to blend into the host page.

Reduced-motion, data-saver, missing WebGL2, and image-load failures fall back to the optimized poster.
