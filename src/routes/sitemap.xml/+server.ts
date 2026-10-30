import { SITE_URL } from '$lib/seo';
import { EFFECTIVE } from '$lib/legal';

export const prerender = true;

/** The homepage ships with every deploy, so its lastmod is the build date. */
export function GET() {
  const built = new Date().toISOString().slice(0, 10);
  const pages: [string, string][] = [
    ['/', built],
    ['/support', built],
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
