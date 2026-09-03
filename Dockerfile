# syntax=docker/dockerfile:1.6

# ---------- Build ----------
FROM node:22-alpine AS builder
WORKDIR /app

# Pin the same pnpm the lockfile was written with (lockfile v9 / pnpm 11).
RUN corepack enable && corepack prepare pnpm@11.9.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install scripts are deliberately NOT disabled globally here. This project's
# build genuinely needs two of them — esbuild's binary shim and
# @tailwindcss/oxide's native binding — and without them `vite build` dies with
# ERR_PNPM_IGNORED_BUILDS. pnpm 11's `allowBuilds:` block in
# pnpm-workspace.yaml IS the explicit allowlist: those two packages may run
# scripts, every other dependency is still blocked.
RUN pnpm install --frozen-lockfile

COPY . .

# `pnpm exec vite build` rather than `pnpm build`: pnpm-workspace.yaml makes
# this directory a workspace root, and at the pinned pnpm version a bare
# `pnpm <script>` there can fail with "Command not found" (same reason the
# hype-admin/hype-backend images call binaries through `pnpm exec`).
RUN pnpm exec vite build

# ---------- Runtime ----------
# The site is fully prerendered by @sveltejs/adapter-static, so the runtime is
# a plain file server — no Node process in production.
FROM nginx:1.29-alpine AS runner

COPY nginx/nginx.conf            /etc/nginx/nginx.conf
COPY nginx/security-headers.conf /etc/nginx/security-headers.conf
COPY --from=builder /app/build   /usr/share/nginx/html

EXPOSE 9500
USER nginx

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:9500/healthz || exit 1

# Bypass /docker-entrypoint.sh: its scripts patch files under /etc/nginx, which
# is not writable once the container runs with --read-only.
ENTRYPOINT ["nginx", "-g", "daemon off;"]
