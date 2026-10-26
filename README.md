# joshuafreemn.space

Portfolio site, built with [Astro](https://astro.build) from the Figma file "Frosh 2.0" (page V3).

## Develop

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to dist/
```

## Structure

- `src/pages/index.astro` – home page (Figma frames "V2a - Home" and "iPhone 13 & 14 - 1")
- `src/components/FolderTabs.astro` – the Motion / Design / Web / About folder tabs
- `src/styles/tokens.css` – colours and type, mirrored from `public/Assets/tokens.json`
- `public/` – the previous hand-written pages and all assets, served as-is until they are rebuilt in Astro

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages.
In the repo's Settings → Pages, set **Source** to **GitHub Actions**.
