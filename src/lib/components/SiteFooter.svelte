<script lang="ts">
  import Logo from '$lib/components/Logo.svelte';
  import { RELEASES_URL, formatDate, type LatestRelease } from '$lib/releases';
  import { IOS_URL, PLAY_URL, GITHUB_URL } from '$lib/links';
  import { CONTACT_EMAIL } from '$lib/legal';

  let { release = null }: { release?: LatestRelease | null } = $props();

  // The footer opens on the frequency axis the equalizer above it sits on:
  // the ISO ⅓-octave centres of the app's actual 31 bands. Those are evenly
  // spaced on a log scale, which is why 31 evenly spaced ticks is the honest
  // drawing of them — and why the labels below land where they do.
  const CENTRES = [
    20, 25, 31.5, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630,
    800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000, 6300, 8000, 10000,
    12500, 16000, 20000
  ];

  /** The marked frequencies: decades, plus the two ends of the range. */
  const MARKED = new Map([
    [20, '20 Hz'],
    [100, '100'],
    [1000, '1k'],
    [10000, '10k'],
    [20000, '20 kHz']
  ]);

  const AXIS_LABELS = [...MARKED].map(([hz, text], i, all) => ({
    text,
    left: (CENTRES.indexOf(hz) / (CENTRES.length - 1)) * 100,
    // The end labels sit inside the axis rather than hanging off it.
    shift: i === 0 ? '0' : i === all.length - 1 ? '-100%' : '-50%'
  }));

  // Absolute, not bare '#connect': this footer also renders on /privacy and
  // /terms, where those sections do not exist and a bare hash goes nowhere.
  const product = [
    ['/#connect', 'Connect'],
    ['/#desktop', 'Desktop'],
    ['/#chain', 'The chain'],
    ['/#mobile', 'Mobile']
  ];

  const legal = [
    ['/privacy', 'Privacy Policy'],
    ['/terms', 'Terms & Conditions'],
    [`mailto:${CONTACT_EMAIL}`, 'Contact']
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
  <div class="wrap pb-5" aria-hidden="true">
    <div class="relative flex h-[11px] items-end justify-between">
      {#each CENTRES as hz}
        <span
          class="w-px {MARKED.has(hz) ? 'bg-gold' : 'bg-line-2'}"
          style="height: {MARKED.has(hz) ? 11 : 5}px;"
        ></span>
      {/each}
    </div>
    <div class="relative mt-2 h-[13px]">
      {#each AXIS_LABELS as { text, left, shift }}
        <span
          class="absolute top-0 whitespace-nowrap font-mono text-[10.5px] leading-none text-faint"
          style="left: {left}%; transform: translateX({shift});"
        >
          {text}
        </span>
      {/each}
    </div>
  </div>

  <div class="border-t border-line">
    <div class="wrap grid gap-x-10 gap-y-11 py-[clamp(40px,6vw,72px)] sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]">
      <div class="max-w-[34ch]">
        <a href="/#top" class="inline-flex items-center gap-2.5">
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

      <nav aria-labelledby="footer-legal">
        <h2 id="footer-legal" class="text-[13px] font-semibold text-faint">Legal</h2>
        <ul class="mt-4 space-y-2.5">
          {#each legal as [href, label]}
            <li>
              <a {href} class="text-[14.5px] text-muted transition-colors hover:text-text">{label}</a>
            </li>
          {/each}
        </ul>
      </nav>
    </div>

    <div class="border-t border-line">
      <div class="wrap flex flex-wrap items-center justify-between gap-x-8 gap-y-4 py-6">
        <p class="text-[13px] text-faint">
          © 2026 HypeMuzik. Studio-grade sound, on every device.
          <span class="mx-1.5 text-line-2">·</span>
          <a href="/privacy" class="transition-colors hover:text-muted">Privacy</a>
          <span class="mx-1.5 text-line-2">·</span>
          <a href="/terms" class="transition-colors hover:text-muted">Terms</a>
        </p>

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
