<script lang="ts">
  /**
   * Shared layout for the long-tail feature pages (/mac-equalizer, /autoeq,
   * /vocal-remover, /linux-music-player).
   *
   * Each page supplies its copy and a FAQ array. The visible FAQ and the
   * FAQPage JSON-LD are both built from that one array, so the structured data
   * can never claim something the page doesn't say. The page owns its own
   * <svelte:head>: these are search landing pages and must be indexable, with
   * a stable canonical.
   */
  import { onMount } from 'svelte';
  import Logo from '$lib/components/Logo.svelte';
  import SiteFooter from '$lib/components/SiteFooter.svelte';
  import DownloadButton from '$lib/components/DownloadButton.svelte';
  import { SITE_URL, SITE_NAME, OG_IMAGE, OG_IMAGE_ALT } from '$lib/seo';
  import { fetchLatestRelease, formatDate, RELEASES_URL, type LatestRelease } from '$lib/releases';
  import { IOS_URL, PLAY_URL } from '$lib/links';
  import { FEATURE_PAGES } from '$lib/feature-pages';

  type Faq = { q: string; a: string };

  let {
    path,
    title,
    description,
    crumb,
    kicker,
    h1,
    lede,
    faqs,
    hero,
    heroSide = false,
    children
  }: {
    /** Absolute path, e.g. '/mac-equalizer'. */
    path: string;
    /** Full <title>, brand suffix included. */
    title: string;
    description: string;
    /** Last breadcrumb label (Home › crumb). */
    crumb: string;
    kicker: string;
    h1: string;
    /** First paragraph. Opens with a definitional sentence. */
    lede: string;
    faqs: Faq[];
    /** Optional screenshot block shown straight under the intro. */
    hero?: import('svelte').Snippet;
    /** Put the hero beside the intro from lg up (for a tall phone screenshot). */
    heroSide?: boolean;
    children: import('svelte').Snippet;
  } = $props();

  const canonical = $derived(`${SITE_URL}${path}`);
  const others = $derived(FEATURE_PAGES.filter((p) => p.path !== path));

  // Same live GitHub release the homepage buttons use; until it resolves (or if
  // it never does) the buttons point at the releases page.
  let release = $state<LatestRelease | null>(null);
  onMount(async () => {
    release = await fetchLatestRelease();
  });

  const jsonLd = $derived(
    JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
            { '@type': 'ListItem', position: 2, name: crumb, item: canonical }
          ]
        },
        {
          '@type': 'FAQPage',
          mainEntity: faqs.map(({ q, a }) => ({
            '@type': 'Question',
            name: q,
            acceptedAnswer: { '@type': 'Answer', text: a }
          }))
        }
      ]
    }).replace(/</g, '\\u003c')
  );
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonical} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={canonical} />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content={SITE_NAME} />
  <meta property="og:image" content={OG_IMAGE} />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content={OG_IMAGE_ALT} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={OG_IMAGE} />
  <meta name="twitter:image:alt" content={OG_IMAGE_ALT} />
  <meta name="robots" content="index,follow,max-image-preview:large" />
  {@html `<script type="application/ld+json">${jsonLd}</script>`}
</svelte:head>

<header class="sticky top-0 z-50 border-b border-line bg-bg/80 backdrop-blur-md">
  <div class="wrap flex h-[68px] items-center justify-between gap-6">
    <a href="/" class="flex items-center gap-2.5">
      <Logo size={30} />
      <span class="font-display text-[19px] font-semibold tracking-[-0.01em] max-sm:sr-only">HypeMuzik</span>
    </a>
    <nav class="flex items-center gap-4 sm:gap-6" aria-label="Site">
      <a href="/support" class="text-[14.5px] font-medium text-muted transition-colors hover:text-text">Supporter pack</a>
      <a href="/" class="btn btn-ghost px-[18px] py-[9px]">Back to site</a>
    </nav>
  </div>
</header>

<main id="top">
  <section class="wrap pb-[clamp(32px,5vw,56px)] pt-[clamp(28px,4vw,52px)]">
    <nav aria-label="Breadcrumb" class="font-mono text-[12.5px] text-faint">
      <ol class="flex flex-wrap items-center gap-x-2">
        <li><a href="/" class="transition-colors hover:text-text">Home</a></li>
        <li aria-hidden="true">›</li>
        <li aria-current="page" class="text-muted">{crumb}</li>
      </ol>
    </nav>

    <div class="mt-[clamp(28px,4vw,48px)] {heroSide && hero ? 'grid items-start gap-x-14 gap-y-10 lg:grid-cols-[minmax(0,1fr)_260px]' : ''}">
    <div class="max-w-[820px]">
      <p class="kicker">{kicker}</p>
      <h1 class="section-title mt-3 text-[clamp(34px,5.4vw,60px)]">{h1}</h1>
      <p class="mt-6 max-w-[64ch] text-[clamp(16.5px,1.5vw,19px)] leading-relaxed text-muted">{lede}</p>
      <div class="mt-8 flex flex-wrap gap-3">
        <a href="#download" class="btn btn-primary">Download free</a>
        <a href="/" class="btn btn-ghost">Explore HypeMuzik</a>
      </div>
    </div>

    {#if hero && heroSide}
      <div class="flex justify-start lg:justify-end">
        {@render hero()}
      </div>
    {/if}
    </div>

    {#if hero && !heroSide}
      <div class="mt-[clamp(36px,5vw,64px)] flex justify-start">
        {@render hero()}
      </div>
    {/if}
  </section>

  <div class="wrap pb-[clamp(40px,6vw,80px)]">
    <div class="feature-body">
      {@render children()}
    </div>
  </div>

  <section id="download" class="border-t border-line py-[clamp(48px,7vw,88px)]" aria-labelledby="download-heading">
    <div class="wrap">
      <div class="rounded-[24px] border border-line bg-surface-1 px-6 py-[clamp(36px,5vw,64px)] text-center">
        <h2 id="download-heading" class="section-title text-[clamp(28px,4.4vw,48px)]">Free on every device.</h2>
        <p class="mx-auto mt-3.5 max-w-[52ch] text-[16.5px] text-muted">
          Every feature, no ads, and no sign-up to play music or use the equalizer.
        </p>
        <div class="mt-8 flex flex-wrap justify-center gap-3">
          <DownloadButton label="macOS" platformId="macos" fallbackUrl={RELEASES_URL} platform={release?.platforms.mac}>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M17.05 12.04c-.03-2.6 2.13-3.85 2.22-3.91-1.21-1.77-3.09-2.01-3.76-2.04-1.6-.16-3.12.94-3.93.94-.81 0-2.06-.92-3.39-.89-1.74.03-3.35 1.01-4.25 2.57-1.81 3.14-.46 7.79 1.3 10.34.86 1.25 1.89 2.65 3.24 2.6 1.3-.05 1.79-.84 3.36-.84 1.57 0 2.01.84 3.39.81 1.4-.03 2.29-1.27 3.15-2.53.99-1.45 1.4-2.86 1.42-2.93-.03-.01-2.72-1.04-2.75-4.13zM14.69 4.81c.72-.87 1.2-2.08 1.07-3.29-1.03.04-2.28.69-3.02 1.56-.66.77-1.24 2-1.08 3.18 1.15.09 2.32-.58 3.03-1.45z"/></svg>
          </DownloadButton>
          <DownloadButton label="Windows" platformId="windows" fallbackUrl={RELEASES_URL} platform={release?.platforms.windows}>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M3 4.5l8-1.1v8.1H3V4.5zm0 15l8 1.1v-8H3v6.9zM12 3.3L21 2v9.5h-9V3.3zM12 12.5h9V22l-9-1.3v-8.2z"/></svg>
          </DownloadButton>
          <DownloadButton label="Linux" platformId="linux" fallbackUrl={RELEASES_URL} platform={release?.platforms.linux}>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 2c2 0 3 2 3 4 0 1 .6 2 1.4 3.2C17.6 11 19 13 19 16c0 3-2 6-7 6s-7-3-7-6c0-3 1.4-5 2.6-6.8C8.4 8 9 7 9 6c0-2 1-4 3-4z"/></svg>
          </DownloadButton>
          <a href={IOS_URL} data-download="ios" target="_blank" rel="noopener noreferrer" class="btn btn-ghost">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M17.05 12.04c-.03-2.6 2.13-3.85 2.22-3.91-1.21-1.77-3.09-2.01-3.76-2.04-1.6-.16-3.12.94-3.93.94-.81 0-2.06-.92-3.39-.89-1.74.03-3.35 1.01-4.25 2.57-1.81 3.14-.46 7.79 1.3 10.34.86 1.25 1.89 2.65 3.24 2.6 1.3-.05 1.79-.84 3.36-.84 1.57 0 2.01.84 3.39.81 1.4-.03 2.29-1.27 3.15-2.53.99-1.45 1.4-2.86 1.42-2.93-.03-.01-2.72-1.04-2.75-4.13zM14.69 4.81c.72-.87 1.2-2.08 1.07-3.29-1.03.04-2.28.69-3.02 1.56-.66.77-1.24 2-1.08 3.18 1.15.09 2.32-.58 3.03-1.45z"/></svg>
            App Store
          </a>
          <a href={PLAY_URL} data-download="android" target="_blank" rel="noopener noreferrer" class="btn btn-ghost">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M3.6 2.3a1 1 0 0 0-.6.9v17.6a1 1 0 0 0 .6.9l9.8-9.7L3.6 2.3zm11.2 7.5L5.5 1.3l11.2 6.4-1.9 2.1zm0 4.4 1.9 2.1L5.5 22.7l9.3-8.5zM17.9 9l2.7 1.5c.7.4.7 1.6 0 2l-2.7 1.5-2.1-2.5L17.9 9z"/></svg>
            Google Play
          </a>
        </div>
        <p class="mt-6 min-h-[20px] font-mono text-[12.5px] text-faint">
          {#if release}
            Desktop v{release.version}{#if release.publishedAt}{' · '}{formatDate(release.publishedAt)}{/if}
          {/if}
        </p>
        <p class="mt-2 text-[14px] text-faint">
          Want to back the project? The optional <a href="/support" class="underline decoration-line-2 underline-offset-4 hover:text-text">Supporter pack</a> adds a badge; nothing is locked behind it.
        </p>
      </div>
    </div>
  </section>

  <section class="border-t border-line bg-surface-1 py-[clamp(56px,8vw,96px)]" aria-labelledby="faq-heading">
    <div class="wrap max-w-[860px]">
      <h2 id="faq-heading" class="section-title text-[clamp(28px,4vw,40px)]">Questions</h2>
      <div class="mt-8 border-t border-line">
        {#each faqs as { q, a } (q)}
          <details class="faq group border-b border-line">
            <summary class="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[16.5px] font-semibold text-text">
              {q}
              <span class="text-gold transition-transform duration-200 group-open:rotate-45" aria-hidden="true">+</span>
            </summary>
            <p class="-mt-1 max-w-[64ch] pb-5 text-[15px] leading-relaxed text-muted">{a}</p>
          </details>
        {/each}
      </div>
    </div>
  </section>

  <section class="border-t border-line py-[clamp(48px,7vw,88px)]" aria-labelledby="more-heading">
    <div class="wrap">
      <h2 id="more-heading" class="section-title text-[clamp(26px,3.6vw,36px)]">More from HypeMuzik</h2>
      <ul class="mt-8 grid gap-4 md:grid-cols-3">
        {#each others as p (p.path)}
          <li>
            <a href={p.path} class="group block h-full rounded-[18px] border border-line bg-surface-1 p-6 transition hover:border-gold">
              <span class="font-display text-[19px] font-semibold text-text">{p.label}</span>
              <span class="mt-2 block text-[14.5px] leading-relaxed text-muted">{p.blurb}</span>
              <span class="mt-4 inline-block text-[14px] font-semibold text-gold" aria-hidden="true">Read more →</span>
            </a>
          </li>
        {/each}
      </ul>
      <p class="mt-8 text-[15px] text-muted">
        Or see everything on the <a href="/" class="text-text underline decoration-line-2 underline-offset-4 hover:decoration-gold">HypeMuzik home page</a>:
        one sound engine for your desktop and your phone.
      </p>
    </div>
  </section>
</main>

<SiteFooter {release} />

<style>
  .faq summary::-webkit-details-marker {
    display: none;
  }

  /* Long-form copy. The pages write plain h2/p/ul/ol/table; the type lives
     here once. :global because the markup is rendered by each route. */
  .feature-body > :global(* + *) {
    margin-top: 1.1rem;
  }
  .feature-body :global(h2) {
    font-family: var(--font-display);
    font-weight: 600;
    letter-spacing: -0.02em;
    line-height: 1.08;
    word-spacing: 0.12em;
    font-size: clamp(26px, 3.6vw, 38px);
    margin-top: clamp(44px, 6vw, 72px);
    max-width: 24ch;
    scroll-margin-top: 90px;
  }
  .feature-body :global(h2:first-child) {
    margin-top: 0;
  }
  .feature-body :global(h3) {
    font-family: var(--font-display);
    font-weight: 600;
    font-size: 20px;
    margin-top: 2rem;
  }
  .feature-body :global(p),
  .feature-body :global(ul),
  .feature-body :global(ol) {
    max-width: 66ch;
    font-size: 16.5px;
    line-height: 1.7;
    color: var(--color-muted);
  }
  .feature-body :global(ul),
  .feature-body :global(ol) {
    padding-left: 1.3rem;
  }
  .feature-body :global(ul) {
    list-style: disc;
  }
  .feature-body :global(ol) {
    list-style: decimal;
  }
  .feature-body :global(li + li) {
    margin-top: 0.55rem;
  }
  .feature-body :global(li::marker) {
    color: var(--color-gold-deep);
  }
  .feature-body :global(strong) {
    color: var(--color-text);
    font-weight: 600;
  }
  .feature-body :global(p a),
  .feature-body :global(li a),
  .feature-body :global(figcaption a) {
    color: var(--color-text);
    text-decoration: underline;
    text-decoration-color: var(--color-line-2);
    text-underline-offset: 4px;
    transition: text-decoration-color 0.15s;
  }
  .feature-body :global(p a:hover),
  .feature-body :global(li a:hover) {
    text-decoration-color: var(--color-gold);
  }
  .feature-body :global(code) {
    font-family: var(--font-mono);
    font-size: 0.88em;
    color: var(--color-text);
    background: var(--color-surface-2);
    border-radius: 6px;
    padding: 0.1em 0.4em;
  }
  .feature-body :global(.note) {
    border-left: 2px solid var(--color-gold-deep);
    padding-left: 1rem;
  }
  .feature-body :global(figure) {
    margin-top: 2rem;
  }
  .feature-body :global(.figure-row) {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 24px;
    max-width: none;
    margin-top: 2rem;
  }
  .feature-body :global(.table-wrap) {
    max-width: 760px;
    overflow-x: auto;
    border: 1px solid var(--color-line);
    border-radius: 14px;
  }
  .feature-body :global(table) {
    width: 100%;
    border-collapse: collapse;
    font-size: 15px;
  }
  .feature-body :global(th),
  .feature-body :global(td) {
    text-align: left;
    padding: 0.7rem 1rem;
    border-bottom: 1px solid var(--color-line);
    vertical-align: top;
  }
  .feature-body :global(tr:last-child td) {
    border-bottom: 0;
  }
  .feature-body :global(th) {
    color: var(--color-text);
    font-weight: 600;
    white-space: nowrap;
  }
  .feature-body :global(td) {
    color: var(--color-muted);
  }
</style>
