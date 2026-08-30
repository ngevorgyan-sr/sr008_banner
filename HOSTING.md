# SR008 Banner Hosting

The production embed is a self-contained iframe page. It expands to the width of its WordPress container while preserving the exact 1800×430 composition.

## Fastest Option: GitHub Pages

The repository's `docs/` folder is ready to publish with GitHub Pages. In GitHub, open **Settings → Pages**, choose **Deploy from a branch**, then select the `main` branch and `/docs` folder.

- Public preview: `https://ngevorgyan-sr.github.io/sr008_banner/`
- Direct embed: `https://ngevorgyan-sr.github.io/sr008_banner/banner.html?v=final-5`

## Hosting on a CDN

1. Download `sr008-banner-cdn.zip` from the preview page.
2. Unzip it without changing the included folder structure.
3. Upload the complete `sr008-banner/` folder to any HTTPS-enabled CDN or static host.
4. Confirm that `banner.html` opens directly in a browser.
5. Replace the iframe `src` in `wordpress/embed-snippet.html` with that public `banner.html` URL. The included snippet already points to the GitHub Pages version.
6. Paste the iframe into a WordPress **Custom HTML** block or an Elementor/Divi HTML widget.

The host should serve `.js`, `.svg`, `.webp`, and `.avif` using their normal MIME types. The banner and its assets must remain in the same relative folder structure. No WordPress plugin, PHP, build process, database, or API is required.

## Files Required on the Host

- `banner.html`
- `dist/fluid-header.min.js`
- `assets/paint-source.avif`
- `assets/paint-source.webp`
- `assets/paint-poster.webp`
- `assets/sr008-wordmark.svg`

## Rebuild the Export

From the project folder:

```bash
npm run release
```

This rebuilds the optimized runtime, refreshes `docs/`, and creates `release/sr008-banner-cdn.zip`.
