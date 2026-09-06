<script lang="ts">
  /**
   * Shared chrome for /privacy and /terms.
   *
   * Both documents need the same things — a way back to the site, a title
   * block with the effective date, a table of contents that tracks where you
   * are, and the site footer — so they live here once rather than being
   * copied into two routes and drifting apart.
   *
   * The page owns its own <svelte:head>: a legal document that a Google
   * reviewer must reach has to be indexable and have a stable canonical URL.
   */
  import { onMount } from 'svelte';
  import Logo from '$lib/components/Logo.svelte';
  import SiteFooter from '$lib/components/SiteFooter.svelte';
  import { SITE_URL, SITE_NAME } from '$lib/seo';
  import { EFFECTIVE_DISPLAY, EFFECTIVE_ISO } from '$lib/legal';

  type Section = { id: string; label: string };

  let {
    title,
    description,
    path,
    intro,
    sections = [],
    children
  }: {
    title: string;
    description: string;
    /** Absolute path of this page, e.g. '/privacy'. Used for the canonical URL. */
    path: string;
    intro: string;
    sections?: Section[];
    children: import('svelte').Snippet;
  } = $props();

  const canonical = $derived(`${SITE_URL}${path}`);

  /**
   * The section currently under the reader; drives the TOC highlight.
   * Null until the observer fires, so the first entry is highlighted on load
   * without capturing `sections` in a non-reactive initialiser.
   */
  let seen = $state<string | null>(null);
  const active = $derived(seen ?? sections[0]?.id ?? '');

  onMount(() => {
    const headings = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);

    if (headings.length === 0) return;

    // rootMargin pulls the trigger line down from the very top of the viewport
    // so a heading counts as "current" once it has settled under the sticky
    // header, not the instant its first pixel appears.
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) seen = entry.target.id;
        }
      },
      { rootMargin: '-96px 0px -70% 0px', threshold: 0 }
    );

    for (const h of headings) io.observe(h);
    return () => io.disconnect();
  });
</script>

<svelte:head>
  <title>{title} — {SITE_NAME}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonical} />
  <meta property="og:title" content="{title} — {SITE_NAME}" />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={canonical} />
  <meta property="og:type" content="article" />
  <meta name="robots" content="index, follow" />
</svelte:head>

<header class="sticky top-0 z-50 border-b border-line bg-bg/80 backdrop-blur-md">
  <div class="wrap flex h-[68px] items-center justify-between gap-6">
    <a href="/" class="flex items-center gap-2.5">
      <Logo size={30} />
      <span class="font-display text-[19px] font-semibold tracking-[-0.01em]">HypeMuzik</span>
    </a>
    <nav class="flex items-center gap-6" aria-label="Legal">
      <a
        href="/privacy"
        class="text-[14.5px] font-medium transition-colors {path === '/privacy'
          ? 'text-text'
          : 'text-muted hover:text-text'}"
        aria-current={path === '/privacy' ? 'page' : undefined}
      >
        Privacy
      </a>
      <a
        href="/terms"
        class="text-[14.5px] font-medium transition-colors {path === '/terms'
          ? 'text-text'
          : 'text-muted hover:text-text'}"
        aria-current={path === '/terms' ? 'page' : undefined}
      >
        Terms
      </a>
      <a href="/" class="btn btn-ghost px-[18px] py-[9px]">Back to site</a>
    </nav>
  </div>
</header>

<main id="top">
  <div class="wrap pb-[clamp(56px,8vw,96px)] pt-[clamp(40px,6vw,76px)]">
    <div class="max-w-[62ch]">
      <p class="kicker">Legal</p>
      <h1 class="section-title mt-3 text-[clamp(34px,5.4vw,52px)]">{title}</h1>
      <p class="mt-5 text-[16.5px] leading-relaxed text-muted">{intro}</p>
      <p class="mt-6 font-mono text-[12.5px] text-faint">
        Effective <time datetime={EFFECTIVE_ISO}>{EFFECTIVE_DISPLAY}</time>
      </p>
    </div>

    <div class="mt-[clamp(40px,6vw,72px)] grid gap-x-14 gap-y-10 lg:grid-cols-[minmax(0,1fr)_240px]">
      <article class="legal max-w-[68ch] lg:order-1">
        {@render children()}
      </article>

      {#if sections.length > 0}
        <nav class="lg:order-2" aria-labelledby="toc-heading">
          <div class="lg:sticky lg:top-[96px]">
            <h2 id="toc-heading" class="font-mono text-[11.5px] uppercase tracking-[0.06em] text-faint">
              On this page
            </h2>
            <ul class="mt-4 space-y-1 border-l border-line">
              {#each sections as { id, label } (id)}
                <li>
                  <a
                    href="#{id}"
                    class="-ml-px block border-l py-1.5 pl-4 text-[13.5px] leading-snug transition-colors {active ===
                    id
                      ? 'border-gold text-text'
                      : 'border-transparent text-faint hover:text-muted'}"
                    aria-current={active === id ? 'true' : undefined}
                  >
                    {label}
                  </a>
                </li>
              {/each}
            </ul>
          </div>
        </nav>
      {/if}
    </div>
  </div>
</main>

<SiteFooter />
