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

## Deploy (CI/CD)

`.github/workflows/deploy.yml` runs the same pipeline as `hype-admin`: build the
image in CI → `docker save | gzip` → `scp` to the VPS → `docker load` →
`docker run`. No registry. SSH port **30620**.

- **Push to `main`** → build check, then deploy. **Pull requests** run the build
  check only. `workflow_dispatch` deploys on demand.
- The container is `nginx:1.29-alpine` serving the prerendered `build/` — there
  is no Node process in production. It listens on **9500** and is published on
  host **9500** (`http://<VPS_HOST>:9500`).
- It runs unprivileged and `--read-only`: nginx keeps its pid file and temp dirs
  under `/tmp`, mounted as a 64 MB tmpfs (see `nginx/nginx.conf`).
- `docker run -d` returns before nginx is serving, so the deploy step polls the
  image's `HEALTHCHECK` (`/healthz`) and fails with container logs if it never
  goes healthy — a green job means the site actually answered.

### Required GitHub repo settings

Settings → Secrets and variables → Actions:

| Kind     | Name           | Example                     |
| -------- | -------------- | --------------------------- |
| Variable | `VPS_HOST`     | `[IP_ADDRESS]`             |
| Variable | `VPS_USER`     | `ubuntu`                      |
| Variable | `PROJECT_PATH` | `/mysite`        |
| Secret   | `SSH_KEY`      | private key authorized on the VPS |

On the VPS, open the port once: `ufw allow 9500/tcp`. (Docker's published-port
rules usually bypass ufw for bridge networking, but don't count on it —
verify with a request from outside the box.)

### Caching

`nginx/nginx.conf` sets three tiers: `_app/immutable/*` is content-hashed →
`max-age=31536000, immutable`; `static/` images and fonts → 30 days; HTML and
`_app/version.json` → `no-cache` (revalidate), so a deploy is visible on the
next request rather than after a TTL.

## Notes

- The logo here is rebuilt from the desktop app's in-app `Logo.tsx` mark. Drop a
  real SVG/PNG into `static/` and swap `Logo.svelte` / the favicon if it differs.
- Download links are placeholders (`#`) — point them at real releases.
- No Content-Security-Policy is set. The page pulls fonts from
  `api.fontshare.com` / `fonts.googleapis.com` / `fonts.gstatic.com`, so a CSP
  needs those origins in `font-src`/`style-src` before it can be turned on.
