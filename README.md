# HypeMuzik — marketing site

Award-grade landing page for the HypeMuzik desktop + mobile audio apps. Shows
what each platform does and how they connect (Phone Link, cast, cloud), built
around the app's own brand: a **gold → green "spectrum sweep"** gradient and the
**3-bar equalizer** glyph, on near-black.

## Stack

- **SvelteKit** (Svelte 5) + `adapter-static` — fully prerendered static site.
- **Tailwind CSS v4** (`@tailwindcss/vite`) — brand tokens live in `src/app.css`
  under `@theme` (`bg-bg`, `text-muted`, `font-display`, `animate-vu`, …).
- Fonts: **Clash Display** + **Satoshi** (Fontshare) and **JetBrains Mono**
  (Google), loaded in `src/app.html`.
- Zero runtime deps beyond Svelte — the live equalizer is a small `<canvas>`.

## Develop

```bash
pnpm install
pnpm dev      # http://localhost:5173
pnpm build    # static site → build/
pnpm preview  # serve the production build
```

## Structure

- `src/routes/+page.svelte` — the whole page (nav, hero, connect, desktop bento,
  signal chain, mobile, numbers, CTA, footer).
- `src/lib/components/Spectrum.svelte` — the animated equalizer canvas (the
  signature), used in the hero + CTA. Respects `prefers-reduced-motion`.
- `src/lib/components/Logo.svelte` — the brand mark (gradient tile + EQ glyph).
- `src/lib/actions.ts` — `reveal` (scroll-in) and `countup` Svelte actions.
- `src/app.css` — Tailwind import, `@theme` brand tokens, keyframes, helpers.

## Notes

- The logo here is rebuilt from the desktop app's in-app `Logo.tsx` mark. Drop a
  real SVG/PNG into `static/` and swap `Logo.svelte` / the favicon if it differs.
- Download links are placeholders (`#`) — point them at real releases.
