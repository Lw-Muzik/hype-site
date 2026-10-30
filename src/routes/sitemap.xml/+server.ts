import { SITE_URL } from '$lib/seo';
import { EFFECTIVE } from '$lib/legal';

export const prerender = true;

/**
 * lastmod is the day a page's copy last changed — not the build date: a
 * lastmod that moves on every deploy teaches crawlers to ignore it. Bump a
 * page's date when you change what it says. Legal pages use their own
 * effective dates.
 */
export function GET() {
  const pages: [string, string][] = [
    ['/', '2026-10-30'],
    ['/support', '2026-10-30'],
    ['/mac-equalizer', '2026-10-30'],
    ['/autoeq', '2026-10-30'],
    ['/vocal-remover', '2026-10-30'],
    ['/linux-music-player', '2026-10-30'],
    ['/privacy', EFFECTIVE.privacy.iso],
    ['/terms', EFFECTIVE.terms.iso],
    ['/refunds', EFFECTIVE.refunds.iso]
  ];
  const urls = pages
    .map(
      ([path, lastmod]) =>
        `  <url>\n    <loc>${SITE_URL}${path}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`
    )
    .join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
