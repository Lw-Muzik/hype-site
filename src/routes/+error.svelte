<script lang="ts">
  /**
   * Rendered by the 404.html fallback shell, which nginx serves — with a real
   * 404 status — for any path that has no prerendered page. Search engines
   * index a homepage answering 200 at every typo as a soft 404, so this page
   * exists to say "not found" honestly and point somewhere useful.
   */
  import { page } from '$app/state';
  import Logo from '$lib/components/Logo.svelte';
  import SiteFooter from '$lib/components/SiteFooter.svelte';
  import { SITE_NAME } from '$lib/seo';

  const missing = $derived(page.status === 404);

  const paths: [string, string][] = [
    ['/', 'HypeMuzik — the free music player & equalizer'],
    ['/mac-equalizer', 'Free system-wide equalizer for Mac'],
    ['/autoeq', 'AutoEq headphone profiles'],
    ['/vocal-remover', 'Free vocal remover & karaoke'],
    ['/linux-music-player', 'Free music player for Linux']
  ];
</script>

<svelte:head>
  <title>{missing ? 'Page not found' : 'Something went wrong'} — {SITE_NAME}</title>
  <meta name="robots" content="noindex, follow" />
</svelte:head>

<header class="sticky top-0 z-50 border-b border-line bg-bg/80 backdrop-blur-md">
  <div class="wrap flex h-[68px] items-center justify-between gap-6">
    <a href="/" class="flex items-center gap-2.5">
      <Logo size={30} />
      <span class="font-display text-[19px] font-semibold tracking-[-0.01em]">HypeMuzik</span>
    </a>
    <a href="/" class="btn btn-ghost px-[18px] py-[9px]">Back to site</a>
  </div>
</header>

<main class="wrap py-[clamp(72px,12vw,160px)] text-center">
  <p class="kicker">{page.status}</p>
  <h1 class="section-title mt-3.5 text-[clamp(36px,6vw,72px)]">
    {#if missing}
      This page <span class="grad-text">isn&rsquo;t here.</span>
    {:else}
      Something <span class="grad-text">went wrong.</span>
    {/if}
  </h1>
  <p class="mx-auto mt-5 max-w-[48ch] text-[clamp(15px,1.4vw,18px)] text-muted">
    {#if missing}
      The link may be old, or mistyped. Here is where most people are headed:
    {:else}
      Try again in a moment, or start from one of these:
    {/if}
  </p>
  <ul class="mx-auto mt-10 grid max-w-[560px] gap-2.5 text-left">
    {#each paths as [href, label]}
      <li>
        <a
          {href}
          class="flex items-center justify-between gap-4 rounded-[14px] border border-line bg-surface-1 px-5 py-4 text-[15.5px] font-medium transition-colors hover:border-gold/40"
        >
          {label}
          <span class="text-gold" aria-hidden="true">&rarr;</span>
        </a>
      </li>
    {/each}
  </ul>
</main>

<SiteFooter />
