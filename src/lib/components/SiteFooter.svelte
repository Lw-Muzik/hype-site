<script lang="ts">
  import Logo from '$lib/components/Logo.svelte';
  import { RELEASES_URL, formatDate, type LatestRelease } from '$lib/releases';
  import { IOS_URL, PLAY_URL, GITHUB_URL } from '$lib/links';

  let { release = null }: { release?: LatestRelease | null } = $props();

  // The footer's top edge is the product: 31 ticks, one per EQ band, in the
  // smile curve the app opens with. It replaces the hairline rule rather than
  // sitting on top of one, so it carries structure instead of decoration.
  const BANDS = Array.from({ length: 31 }, (_, i) => {
    const t = i / 30;
    return {
      height: 7 + 15 * (0.5 + 0.5 * Math.cos(2 * Math.PI * t)),
      // Gold at the low bands, green at the high ones — the brand sweep read
      // left to right across the spectrum.
      mix: Math.round(t * 100)
    };
  });

  const product = [
    ['#connect', 'Connect'],
    ['#desktop', 'Desktop'],
    ['#chain', 'The chain'],
    ['#mobile', 'Mobile']
  ];

  // Same live release the download buttons use, so the footer is a second,
  // quieter way to get the app — and never points at a stale version.
  const desktop = $derived([
    { label: 'macOS', url: release?.platforms.mac?.primary.url ?? RELEASES_URL },
    { label: 'Windows', url: release?.platforms.windows?.primary.url ?? RELEASES_URL },
    { label: 'Linux', url: release?.platforms.linux?.primary.url ?? RELEASES_URL }
  ]);
</script>

<footer class="mt-[clamp(56px,8vw,104px)]">
  <div class="wrap" aria-hidden="true">
    <div class="flex h-[22px] items-end gap-[3px] opacity-60">
      {#each BANDS as band}
        <span
          class="flex-1 rounded-t-[2px]"
          style="height: {band.height}px;
                 background: color-mix(in oklab, var(--color-green) {band.mix}%, var(--color-gold));"
        ></span>
      {/each}
    </div>
  </div>

  <div class="border-t border-line">
    <div class="wrap grid gap-x-10 gap-y-11 py-[clamp(40px,6vw,72px)] sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
      <div class="max-w-[34ch]">
        <a href="#top" class="inline-flex items-center gap-2.5">
          <Logo size={28} />
          <span class="font-display text-[18px] font-semibold">HypeMuzik</span>
        </a>
        <p class="mt-4 text-[14.5px] leading-relaxed text-muted">
          One sound engine, every device — a 31-band equalizer and a full DSP chain on the
          desktop, in your pocket, and streaming between them.
        </p>
      </div>

      <nav aria-labelledby="footer-product">
        <h2 id="footer-product" class="text-[13px] font-semibold text-faint">Product</h2>
        <ul class="mt-4 space-y-2.5">
          {#each product as [href, label]}
            <li>
              <a {href} class="text-[14.5px] text-muted transition-colors hover:text-text">{label}</a>
            </li>
          {/each}
        </ul>
      </nav>

      <nav aria-labelledby="footer-desktop">
        <h2 id="footer-desktop" class="text-[13px] font-semibold text-faint">Desktop</h2>
        <ul class="mt-4 space-y-2.5">
          {#each desktop as { label, url }}
            <li>
              <a href={url} rel="noopener" class="text-[14.5px] text-muted transition-colors hover:text-text">
                {label}
              </a>
            </li>
          {/each}
          <li>
            <a
              href={release?.htmlUrl ?? RELEASES_URL}
              rel="noopener"
              class="text-[14.5px] text-muted transition-colors hover:text-text"
            >
              All releases
            </a>
          </li>
        </ul>
      </nav>

      <nav aria-labelledby="footer-mobile">
        <h2 id="footer-mobile" class="text-[13px] font-semibold text-faint">Mobile</h2>
        <ul class="mt-4 space-y-2.5">
          <li>
            <a href={IOS_URL} target="_blank" rel="noopener noreferrer" class="text-[14.5px] text-muted transition-colors hover:text-text">
              App Store
            </a>
          </li>
          <li>
            <a href={PLAY_URL} target="_blank" rel="noopener noreferrer" class="text-[14.5px] text-muted transition-colors hover:text-text">
              Google Play
            </a>
          </li>
        </ul>
      </nav>
    </div>

    <div class="border-t border-line">
      <div class="wrap flex flex-wrap items-center justify-between gap-x-8 gap-y-4 py-6">
        <p class="text-[13px] text-faint">© 2026 HypeMuzik. Studio-grade sound, on every device.</p>

        <div class="flex flex-wrap items-center gap-3">
          {#if release}
            <a
              href={release.htmlUrl}
              rel="noopener"
              class="inline-flex items-center gap-2 rounded-full border border-line-2 px-3 py-1.5
                     font-mono text-[12px] text-muted transition hover:border-gold hover:text-text"
            >
              <span class="size-1.5 rounded-full bg-green"></span>
              Desktop v{release.version}
              {#if release.publishedAt}
                <span class="text-faint">{formatDate(release.publishedAt)}</span>
              {/if}
            </a>
          {/if}

          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="HypeMuzik on GitHub"
            class="flex size-9 items-center justify-center rounded-full border border-line-2 text-muted
                   transition hover:border-gold hover:text-text"
          >
            <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49l-.01-1.72c-2.78.62-3.37-1.37-3.37-1.37-.45-1.19-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.57 2.34 1.12 2.91.86.09-.66.35-1.12.63-1.38-2.22-.26-4.55-1.14-4.55-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.05.36.32.68.94.68 1.9l-.01 2.82c0 .27.18.6.69.49A10.03 10.03 0 0 0 22 12.25C22 6.58 17.52 2 12 2z"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </div>
</footer>
