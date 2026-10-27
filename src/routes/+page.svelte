<script lang="ts">
  import { onMount } from 'svelte';
  import Logo from '$lib/components/Logo.svelte';
  import Spectrum from '$lib/components/Spectrum.svelte';
  import Hero from '$lib/components/Hero.svelte';
  import IntroSplash from '$lib/components/IntroSplash.svelte';
  import DownloadButton from '$lib/components/DownloadButton.svelte';
  import SiteFooter from '$lib/components/SiteFooter.svelte';
  import DesktopShowcase from '$lib/components/DesktopShowcase.svelte';
  import { reveal, countup, tilt } from '$lib/actions';
  import { fetchLatestRelease, formatDate, RELEASES_URL, type LatestRelease } from '$lib/releases';
  import { IOS_URL, PLAY_URL, GITHUB_URL, WEB_REMOTE_URL } from '$lib/links';
  import { SITE_URL, SITE_NAME, TITLE, DESCRIPTION, OG_IMAGE, OG_IMAGE_ALT, structuredDataJson } from '$lib/seo';
  import { GOOGLE_DRIVE_SCOPE as DRIVE, GOOGLE_PERMISSIONS_URL } from '$lib/legal';

  let y = $state(0);
  const stuck = $derived(y > 8);

  // Below md the section links have nowhere to live, so they get a
  // disclosure panel rather than disappearing.
  let menuOpen = $state(false);
  // Third item: true = hidden from the inline bar below lg (kept in the menu).
  const NAV: [string, string, boolean?][] = [
    ['#connect', 'Phone Link'],
    ['#hype-connect', 'Hype Connect', true],
    ['#desktop', 'Desktop'],
    ['#chain', 'The chain'],
    ['#mobile', 'Mobile'],
    ['#data', 'Your data']
  ];

  // Desktop downloads resolve against the live GitHub release, so publishing a
  // new hype-desktop version updates this page with no rebuild. Until it
  // resolves — and if it never does — the buttons point at the releases page.
  let release = $state<LatestRelease | null>(null);
  onMount(async () => {
    release = await fetchLatestRelease();
  });

  // Deterministic, varied animation timings for the mock equalizer.


  // #mobile scrollytelling: one real screen per feature, the phone follows the list.
  const shots = [
    { n: 'eq', alt: 'HypeMuzik mobile — graphic equalizer with presets' },
    { n: 'stems', alt: 'HypeMuzik mobile — stem separation: vocals, drums, instruments' },
    { n: 'search', alt: 'HypeMuzik mobile — one search across your library, cloud drives and YouTube Music' },
    { n: 'queue', alt: 'HypeMuzik mobile — now playing with a 26-track daily-mix queue' },
    { n: 'settings', alt: 'HypeMuzik mobile — playback settings: gapless, crossfade, replay gain, autoplay' },
    { n: 'nowplaying', alt: 'HypeMuzik mobile — now playing with album art, waveform and synced lyrics' }
  ];
  const features = [
    { b: 'The full chain, on a phone', s: 'Graphic and parametric EQ, tone, dynamics, space, room reverb and a speaker EQ — the desktop stages, hand-tuned in C++.', shot: 0 },
    { b: 'Stem separation on device', s: 'Split a track into vocals, drums, bass and other, then mix the stems live.', shot: 1 },
    { b: 'One search, every source', s: 'Your library, your cloud drives and YouTube Music in a single list — tap anything to start a station.', shot: 2 },
    { b: 'Daily mixes that learn', s: 'Mixes blended from your drive, YouTube and videos, seeded by the time of day and what you actually play.', shot: 3 },
    { b: 'Gapless, crossfade & replay-gain', s: 'Seamless transitions and consistent loudness across your library.', shot: 4 },
    { b: 'Synced lyrics & identify', s: 'Karaoke lyrics and AcoustID fingerprinting, the same as desktop.', shot: 5 },
    { b: 'Be a source, or a speaker', s: 'Stream your library to the desktop over your own Wi-Fi, or receive a cast from it.', shot: 5 }
  ];
  let activeFeature = $state(0);
  const activeShot = $derived(features[activeFeature].shot);
  // Active feature = the list item crossing the vertical middle of the viewport.
  function story(node: HTMLElement) {
    if (typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) activeFeature = Number((e.target as HTMLElement).dataset.i);
        }
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );
    node.querySelectorAll('[data-i]').forEach((el) => io.observe(el));
    return { destroy: () => io.disconnect() };
  }

  const platforms = ['macOS', 'Windows', 'Linux', 'Android', 'iOS'];
  // The desktop's actual signal chain, in the order StageChain::standard()
  // builds it (crates/hm-dsp/src/lib.rs). The numbering is real: order matters.
  const chain = [
    'Headphone correction',
    '31-band graphic EQ',
    'Bass boost',
    'Stereo spatializer',
    '3D surround',
    'Room reverb',
    'Convolution IR',
    'Multiband compander',
    'Tube saturation',
    'Script processor',
    'Makeup gain',
    'Brickwall limiter'
  ];
  const stats = [
    { n: 31, l: 'EQ bands' },
    { n: 3938, l: 'AutoEq profiles' },
    { n: 12, l: 'DSP stages' },
    { n: 100, l: 'k-track libraries' },
    { n: 5, l: 'platforms' }
  ];
</script>

<svelte:head>
  <link rel="preload" as="image" type="image/avif" imagesrcset="/hero/app-desktop-960.avif 960w, /hero/app-desktop-1440.avif 1440w, /hero/app-desktop-2160.avif 2160w" imagesizes="(min-width: 800px) 760px, 92vw" fetchpriority="high" />
  <!-- The intro's gate waits on the phone screenshot (the first thing shown),
       so fetch it as early as the desktop one. Sizes must match the <img>. -->
  <link rel="preload" as="image" type="image/avif" imagesrcset="/hero/phone-visualiser-540.avif 540w, /hero/phone-visualiser-1080.avif 1080w" imagesizes="(min-width: 800px) 480px, 66vw" />
  <title>{TITLE}</title>
  <meta name="description" content={DESCRIPTION} />
  <link rel="canonical" href={SITE_URL} />

  <meta property="og:type" content="website" />
  <meta property="og:site_name" content={SITE_NAME} />
  <meta property="og:title" content={TITLE} />
  <meta property="og:description" content={DESCRIPTION} />
  <meta property="og:url" content={SITE_URL} />
  <meta property="og:image" content={OG_IMAGE} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content={OG_IMAGE_ALT} />
  <meta property="og:locale" content="en_US" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={TITLE} />
  <meta name="twitter:description" content={DESCRIPTION} />
  <meta name="twitter:image" content={OG_IMAGE} />
  <meta name="twitter:image:alt" content={OG_IMAGE_ALT} />

  <!-- Describes the product itself, so a result can carry the platforms and
       price rather than just a blue link. Deliberately omits the version: this
       page is prerendered, and the release is resolved at runtime, so a baked
       version number would go stale on the next release. -->
  {@html `<script type="application/ld+json">${structuredDataJson}<\/script>`}
  <meta
    name="robots"
    content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
  />
  <meta property="og:image:type" content="image/png" />
  <meta name="apple-itunes-app" content="app-id=6760889647" />
</svelte:head>

<svelte:window bind:scrollY={y} />

<!-- ============================== NAV ============================== -->
<header
  class="sticky top-0 z-50 border-b transition-colors duration-300"
  class:border-transparent={!stuck}
  class:border-line={stuck}
  class:bg-bg={false}
  style={stuck
    ? 'background:rgba(10,11,14,.72);backdrop-filter:blur(16px) saturate(140%);-webkit-backdrop-filter:blur(16px) saturate(140%)'
    : ''}
>
  <div class="wrap flex h-[68px] items-center justify-between gap-3 sm:gap-6">
    <a href="#top" class="flex min-w-0 items-center gap-2.5">
      <Logo size={30} />
      <span class="font-display text-[19px] font-semibold tracking-[-0.01em]">HypeMuzik</span>
    </a>
    <nav class="hidden items-center gap-5 md:flex lg:gap-8" aria-label="Primary">
      {#each NAV as [href, label, lgOnly]}
        <a
          {href}
          class="group relative text-[15px]{lgOnly ? ' hidden lg:inline' : ''} font-medium text-muted transition-colors hover:text-text"
        >
          {label}
          <span
            class="sweep absolute -bottom-1.5 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full"
          ></span>
        </a>
      {/each}
    </nav>
    <div class="flex shrink-0 items-center gap-2">
      <a href="#download" data-track="nav-get-app" class="btn btn-ghost px-3.5 py-[9px] sm:px-[18px]"><span class="sm:hidden">Get the app</span><span class="hidden sm:inline">Get HypeMuzik</span></a>
      <button
        type="button"
        class="flex size-10 items-center justify-center rounded-full border border-line-2 text-muted transition hover:border-gold hover:text-text md:hidden"
        aria-expanded={menuOpen}
        aria-controls="mobile-nav"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        onclick={() => (menuOpen = !menuOpen)}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
          {#if menuOpen}
            <path d="M6 6l12 12M18 6L6 18" />
          {:else}
            <path d="M4 7h16M4 12h16M4 17h16" />
          {/if}
        </svg>
      </button>
    </div>
  </div>

  {#if menuOpen}
    <nav
      id="mobile-nav"
      aria-label="Sections"
      class="border-t border-line bg-bg px-5 pb-4 pt-2 sm:px-8 md:hidden"
    >
      <ul>
        {#each NAV as [href, label]}
          <li>
            <a
              {href}
              class="block border-b border-line py-3 text-[15px] text-muted transition-colors last:border-b-0 hover:text-text"
              onclick={() => (menuOpen = false)}
            >
              {label}
            </a>
          </li>
        {/each}
      </ul>
    </nav>
  {/if}
</header>

<main id="top">
  <!-- ============================== HERO ============================== -->
  <Hero />
  <IntroSplash />

  <!-- platform ribbon -->
  <div
    class="wrap flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-y border-line py-7 font-mono text-[13px] tracking-[0.08em] text-faint"
    aria-hidden="true"
  >
    {#each platforms as p, i}
      <span>{p}</span>
      {#if i < platforms.length - 1}<i class="h-1 w-1 rounded-full bg-line-2"></i>{/if}
    {/each}
  </div>

  <!-- ============================== CONNECT ============================== -->
  <section
    id="connect"
    class="py-[clamp(72px,10vw,140px)]"
  >
    <div class="wrap">
      <header class="reveal mx-auto max-w-[760px] text-center" use:reveal>
        <p class="kicker">01 — The link</p>
        <h2 class="section-title mt-3.5 text-[clamp(32px,5vw,60px)]">
          Two devices.<br /><span class="grad-text">One signal path.</span>
        </h2>
        <p class="mx-auto mt-[18px] max-w-[56ch] text-[clamp(15px,1.4vw,18px)] text-muted">
          Your phone holds the music. Your desktop holds the engine. Phone Link joins them over
          your own Wi-Fi — no cloud middleman — so every track you stream is re-rendered through
          the desktop&rsquo;s full DSP chain.
        </p>
      </header>

      <!-- flow diagram -->
      <div class="reveal mt-14 grid items-stretch gap-4 md:grid-cols-[1fr_1.3fr_1fr]" use:reveal
        role="img"
        aria-label="Phone streams over local Wi-Fi to the desktop engine, which re-renders the sound; the desktop can cast back to the phone."
      >
        <div class="rounded-[18px] border border-line bg-surface-1 p-7 text-center">
          <div class="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-[14px] border border-line bg-white/[0.03] text-gold">
            <svg viewBox="0 0 24 24" width="26" height="26"><path fill="currentColor" d="M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 3v12h10V5H7zm5 14.2a.9.9 0 1 0 0 1.8.9.9 0 0 0 0-1.8z" /></svg>
          </div>
          <h3 class="font-display text-[21px] font-semibold">Phone</h3>
          <p class="mt-2 text-[14.5px] text-muted">Your on-device library, shared to the desktop after a quick PIN pair.</p>
        </div>

        <div class="flex flex-col justify-center gap-2.5 px-1.5">
          <span class="text-center font-mono text-[11px] tracking-[0.08em] text-faint">mDNS · PIN-paired · LAN</span>
          <Spectrum class="h-[46px] w-full opacity-70" bars={40} />
          <span class="text-center font-mono text-[11px] tracking-[0.08em] text-green">Cast back · Now-playing sync</span>
        </div>

        <div class="rounded-[18px] border border-gold/35 bg-surface-1 p-7 text-center shadow-[0_30px_60px_-34px_rgba(255,202,66,.3)]">
          <div class="sweep mx-auto mb-4 grid h-14 w-14 place-items-center rounded-[14px] text-bg">
            <svg viewBox="0 0 24 24" width="26" height="26"><path fill="currentColor" d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm2 4v2h2V9H6zm0 4v2h8v-2H6zm10-4v6h2V9h-2z" /></svg>
          </div>
          <h3 class="font-display text-[21px] font-semibold">Desktop engine</h3>
          <p class="mt-2 text-[14.5px] text-muted">EQ, DSP chain and limiter re-render the stream in real time, then out to your speakers.</p>
        </div>
      </div>

      <!-- connect cards -->
      <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {#each [
          { tag: 'Phone Link', h: 'Play your phone through the desktop', p: 'Discover phones on the network, pair once, and stream their library straight into the enhancement chain.' },
          { tag: 'Cast', h: 'Send playback to the phone', p: 'Hand the current track to a paired phone and keep the now-playing state in sync, both directions.' },
          { tag: 'Lyrics travel too', h: 'Phone .lrc files render on the desktop', p: 'Lyric files you keep next to your music on the phone show up in the desktop’s karaoke view automatically.' },
          { tag: 'Cloud', h: 'One account, both apps', p: 'Connect Google Drive or Dropbox once and stream the same music on desktop and mobile.' }
        ] as c, i}
          <article
            class="reveal rounded-2xl border border-line bg-surface-1 p-6 transition-colors hover:border-line-2" use:tilt={5}
            use:reveal={{ delay: i * 70 }}
          >
            <span class="font-mono text-[11px] uppercase tracking-[0.08em] text-gold-deep">{c.tag}</span>
            <h4 class="mt-3 text-[16.5px] font-bold leading-snug">{c.h}</h4>
            <p class="mt-2 text-sm text-muted">{c.p}</p>
          </article>
        {/each}
      </div>
    </div>
  </section>

  <!-- ============================== HYPE CONNECT ============================== -->
  <section id="hype-connect" class="py-[clamp(72px,10vw,140px)]">
    <div class="wrap">
      <header class="reveal mx-auto max-w-[760px] text-center" use:reveal>
        <p class="kicker">02 — Hype Connect</p>
        <h2 class="section-title mt-3.5 text-[clamp(32px,5vw,60px)]">
          Pick it here.<br /><span class="grad-text">Play it there.</span>
        </h2>
        <p class="mx-auto mt-[18px] max-w-[56ch] text-[clamp(15px,1.4vw,18px)] text-muted">
          Hype Connect links your phone, your desktop and any web browser to one account. Choose the device that plays, then search, queue and skip from whichever one is in your hand — the sound always comes from the player, through its own engine.
        </p>
      </header>

      <DesktopShowcase
        base="web-remote"
        url="play.hypemuzik.com"
        height={757}
        alt="Hype Connect in a browser — a phone's queue and now playing, controlled from play.hypemuzik.com"
      />

      <ol class="mt-14 grid gap-4 lg:grid-cols-3" aria-label="How Hype Connect works">
        {#each [
          { t: 'Open the remote', s: 'Go to play.hypemuzik.com on any computer, tablet or TV browser. It shows a QR code and a 6-digit code.' },
          { t: 'Link your phone', s: 'In HypeMuzik on your phone, open Settings → Cloud & Devices → Hype Connect, then scan the code — or type the 6 digits — and approve. No email, no password.' },
          { t: 'Pick where it plays', s: 'Choose your phone or your desktop as the player, then search, queue, skip, follow the synced lyrics and watch the live visualiser from the browser.' }
        ] as step, i}
          <li
            class="reveal rounded-[18px] border border-line bg-surface-1 p-[30px]"
            use:reveal={{ delay: i * 150 }}
          >
            <span class="font-mono text-[44px] leading-none text-gold-deep">0{i + 1}</span>
            <h3 class="section-title mt-5 text-[22px]">{step.t}</h3>
            <p class="mt-2.5 text-[14.5px] text-muted">{step.s}</p>
          </li>
        {/each}
      </ol>

      <div class="reveal mt-4 rounded-[18px] border border-line bg-surface-1 p-[30px] md:p-10" use:reveal>
        <h3 class="section-title text-[clamp(22px,2.6vw,30px)]">Your phone and desktop, as one</h3>
        <p class="mt-3 max-w-[62ch] text-[15px] text-muted">
          On the desktop, open Settings → Devices → Hype Connect and scan its code with your phone. The phone asks where music should play — from then on, what you pick on one plays on the other. Press play on any device and it takes over; only one plays at a time.
        </p>
      </div>

      <div class="mx-auto mt-14 max-w-[760px]">
        <h3 class="reveal section-title text-[clamp(22px,2.6vw,30px)]" use:reveal>Get the most out of it</h3>
        <ul class="reveal mt-4 flex flex-col" use:reveal={{ delay: 80 }}>
          {#each [
            { b: 'Play on the desktop for the full chain', s: 'Make the desktop the player and every song runs through its 12-stage chain, while your phone or browser does the choosing.' },
            { b: 'Leave Hype Connect on', s: 'On Android it keeps running in the background with a quiet notification, so the remote can always reach your phone.' },
            { b: 'Local songs stay local', s: 'Files that live on one device play there; HypeMuzik offers to switch the player for you.' },
            { b: 'Media keys follow the music', s: 'On the desktop, media keys and the tray control whichever device is playing.' },
            { b: 'Nothing to install in the browser', s: 'The web remote never plays audio itself, so any screen with a browser works — even a TV.' }
          ] as f}
            <li class="flex flex-col gap-1 border-b border-line py-[18px] last:border-b-0">
              <b class="text-[16.5px]">{f.b}</b>
              <span class="text-[14.5px] text-muted">{f.s}</span>
            </li>
          {/each}
        </ul>
        <div class="mt-8 flex flex-wrap items-center gap-3.5">
          <a href={WEB_REMOTE_URL} data-track="web-remote-open" target="_blank" rel="noopener" class="btn btn-primary">Open the web remote <span aria-hidden="true">↗</span></a>
          <a href="#download" class="btn btn-ghost">Get the mobile app</a>
        </div>
        <p class="mt-4 font-mono text-[12px] text-faint">Needs HypeMuzik on your phone, or the desktop app v0.1.31 or later.</p>
      </div>
    </div>
  </section>

  <!-- ============================== DESKTOP (bento) ============================== -->
  <section id="desktop" class="py-[clamp(72px,10vw,140px)]">
    <div class="wrap">
      <header class="reveal mx-auto max-w-[760px] text-center" use:reveal>
        <p class="kicker">03 — The control room</p>
        <h2 class="section-title mt-3.5 text-[clamp(32px,5vw,60px)]">The desktop is a <span class="grad-text">studio</span>.</h2>
        <p class="mx-auto mt-[18px] max-w-[56ch] text-[clamp(15px,1.4vw,18px)] text-muted">
          Everything you hear, shaped — not just HypeMuzik&rsquo;s player, but every app on your machine.
        </p>
      </header>

      <DesktopShowcase />

      <div class="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <!-- wide: system-wide -->
        <article class="reveal group relative overflow-hidden rounded-[18px] border border-line bg-surface-1 p-[30px] transition-colors hover:border-line-2 md:col-span-2" use:tilt={4} use:reveal>
          <div class="grid h-[52px] w-[52px] place-items-center rounded-[13px] border border-gold/20 bg-gold/10 text-gold">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M2 12h2l2-6 4 14 4-18 3 10h5"/></svg>
          </div>
          <h3 class="section-title mt-[18px] text-[22px]">System-wide equalization</h3>
          <p class="mt-2.5 max-w-[46ch] text-[14.5px] text-muted">Route <em class="text-text italic">all</em> system audio through the chain — a macOS Core Audio process tap or per-app WASAPI control on Windows. Tune the whole machine, not one player.</p>
          <ul class="mt-4 flex flex-wrap gap-2">
            {#each ['Core Audio tap', 'Per-app mixer', 'macOS 14.4+'] as t}
              <li class="rounded-full border border-line px-2.5 py-[5px] font-mono text-[11.5px] text-muted">{t}</li>
            {/each}
          </ul>
        </article>

        <!-- EQ -->
        <article class="reveal group rounded-[18px] border border-line bg-surface-1 p-[30px] transition-colors hover:border-line-2" use:tilt use:reveal={{ delay: 60 }}>
          <div class="grid h-[52px] w-[52px] place-items-center rounded-[13px] border border-gold/20 bg-gold/10 text-gold">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 21V10M5 6V3M12 21v-7M12 10V3M19 21v-4M19 13V3M3 8h4M10 12h4M17 15h4"/></svg>
          </div>
          <h3 class="section-title mt-[18px] text-[22px]">31-band graphic EQ</h3>
          <p class="mt-2.5 text-[14.5px] text-muted">A live response curve over a real-time spectrum, with 12 built-in presets and 3,938 AutoEq headphone profiles.</p>
        </article>

        <!-- DSP -->
        <article class="reveal group rounded-[18px] border border-line bg-surface-1 p-[30px] transition-colors hover:border-line-2" use:tilt use:reveal={{ delay: 120 }}>
          <div class="grid h-[52px] w-[52px] place-items-center rounded-[13px] border border-gold/20 bg-gold/10 text-gold">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><rect x="7" y="7" width="10" height="10" rx="1.5"/><path stroke-linecap="round" d="M10 3v2M14 3v2M10 19v2M14 19v2M3 10h2M3 14h2M19 10h2M19 14h2"/></svg>
          </div>
          <h3 class="section-title mt-[18px] text-[22px]">Full DSP chain</h3>
          <p class="mt-2.5 text-[14.5px] text-muted">Headphone correction, bass boost, spatializer, 3D surround, room reverb, convolution IR, multiband compander and tube saturation — into a brickwall limiter.</p>
        </article>

        <!-- library -->
        <article class="reveal group rounded-[18px] border border-line bg-surface-1 p-[30px] transition-colors hover:border-line-2" use:tilt use:reveal={{ delay: 60 }}>
          <div class="grid h-[52px] w-[52px] place-items-center rounded-[13px] border border-gold/20 bg-gold/10 text-gold">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="18" r="2.5"/><path d="M9.5 18V5l10-2v11"/><circle cx="17" cy="16" r="2.5"/></svg>
          </div>
          <h3 class="section-title mt-[18px] text-[22px]">A library that scales</h3>
          <p class="mt-2.5 text-[14.5px] text-muted">Smooth past 100,000 tracks. Real ID3 tags, lazy cover art, instant search across every source.</p>
        </article>

        <!-- identify -->
        <article class="reveal group rounded-[18px] border border-line bg-surface-1 p-[30px] transition-colors hover:border-line-2" use:tilt use:reveal={{ delay: 120 }}>
          <div class="grid h-[52px] w-[52px] place-items-center rounded-[13px] border border-gold/20 bg-gold/10 text-gold">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/></svg>
          </div>
          <h3 class="section-title mt-[18px] text-[22px]">Fingerprint identify</h3>
          <p class="mt-2.5 text-[14.5px] text-muted">Untagged track? A Chromaprint fingerprint and an AcoustID match fill in the title, artist and album.</p>
        </article>

        <!-- stems -->
        <article class="reveal group rounded-[18px] border border-line bg-surface-1 p-[30px] transition-colors hover:border-line-2" use:tilt use:reveal={{ delay: 60 }}>
          <div class="grid h-[52px] w-[52px] place-items-center rounded-[13px] border border-gold/20 bg-gold/10 text-gold">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/></svg>
          </div>
          <h3 class="section-title mt-[18px] text-[22px]">Split a song into stems</h3>
          <p class="mt-2.5 text-[14.5px] text-muted">Separate any track into vocals, drums, bass and everything else — then solo, mute or remix the parts while it plays.</p>
        </article>

        <!-- stations + movies -->
        <article class="reveal group rounded-[18px] border border-line bg-surface-1 p-[30px] transition-colors hover:border-line-2" use:tilt use:reveal={{ delay: 120 }}>
          <div class="grid h-[52px] w-[52px] place-items-center rounded-[13px] border border-gold/20 bg-gold/10 text-gold">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="7" width="19" height="13" rx="2.5"/><path d="M8 7l8-4"/><circle cx="17" cy="13.5" r="1.6"/></svg>
          </div>
          <h3 class="section-title mt-[18px] text-[22px]">Radio, TV and movies</h3>
          <p class="mt-2.5 text-[14.5px] text-muted">Internet radio and world TV, checked for a live signal before you tune in — plus a movies browser, in the same window.</p>
        </article>

        <!-- cloud + ytmusic -->
        <article class="reveal group rounded-[18px] border border-line bg-surface-1 p-[30px] transition-colors hover:border-line-2" use:tilt use:reveal={{ delay: 60 }}>
          <div class="grid h-[52px] w-[52px] place-items-center rounded-[13px] border border-gold/20 bg-gold/10 text-gold">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 18h10a3.5 3.5 0 0 0 .5-6.96 5.5 5.5 0 0 0-10.6-1.2A4 4 0 0 0 7 18z"/></svg>
          </div>
          <h3 class="section-title mt-[18px] text-[22px]">Your cloud, and YouTube Music</h3>
          <p class="mt-2.5 text-[14.5px] text-muted">Play straight from Google Drive or Dropbox — several accounts at once — and search YouTube Music for tracks, playlists and endless radio.</p>
        </article>

        <!-- wide: lyrics -->
        <article class="reveal group relative overflow-hidden rounded-[18px] border border-line bg-surface-1 p-[30px] transition-colors hover:border-line-2 md:col-span-2" use:tilt={4} use:reveal>
          <div class="grid h-[52px] w-[52px] place-items-center rounded-[13px] border border-gold/20 bg-gold/10 text-gold">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M7 7h5v6c0 2.2-1.8 4-4 4v-2c1.1 0 2-.9 2-2H7V7zm8 0h5v6c0 2.2-1.8 4-4 4v-2c1.1 0 2-.9 2-2h-3V7z"/></svg>
          </div>
          <h3 class="section-title mt-[18px] text-[22px]">Apple-Music-style lyrics</h3>
          <p class="mt-2.5 max-w-[52ch] text-[14.5px] text-muted">Word-by-word karaoke fill, a spring-driven auto-scroll, and a depth-of-field blur on the lines around the one being sung — all synced to the beat.</p>
          <ul class="mt-4 flex flex-wrap gap-2">
            {#each ['Synced LRC', 'Word timing', 'Tap to seek'] as t}
              <li class="rounded-full border border-line px-2.5 py-[5px] font-mono text-[11.5px] text-muted">{t}</li>
            {/each}
          </ul>
        </article>
      </div>
    </div>
  </section>

  <!-- ============================== SIGNAL CHAIN ============================== -->
  <section id="chain" class="border-y border-line bg-surface-1 py-[clamp(72px,10vw,140px)]">
    <div class="wrap">
      <header class="reveal mx-auto max-w-[760px] text-center" use:reveal>
        <p class="kicker">04 — Signal path</p>
        <h2 class="section-title mt-3.5 text-[clamp(32px,5vw,60px)]">Every sample, <span class="grad-text">in order.</span></h2>
        <p class="mx-auto mt-[18px] max-w-[56ch] text-[clamp(15px,1.4vw,18px)] text-muted">
          The same custom chain runs on both platforms. Order matters — so we show it the way the audio actually flows.
        </p>
      </header>

      <ol class="reveal mt-14 flex overflow-x-auto pb-2" aria-label="DSP signal chain, in processing order" use:reveal>
        {#each chain as step, i}
          {@const last = i === chain.length - 1}
          <li
            class="relative flex min-w-[132px] flex-1 flex-col gap-2 border border-line px-[18px] py-[22px] first:rounded-l-[14px] last:rounded-r-[14px] {last
              ? 'bg-gold/10'
              : 'border-r-0 bg-surface-2'}"
          >
            <span class="font-mono text-xs text-gold-deep">{String(i + 1).padStart(2, '0')}</span>
            <span class="text-[14.5px] font-bold tracking-[-0.01em]">{step}</span>
            {#if !last}
              <span class="absolute -right-[9px] top-1/2 z-[2] -translate-y-1/2 text-[13px] text-faint">→</span>
            {/if}
          </li>
        {/each}
      </ol>
      <p class="reveal mt-[22px] text-center font-mono text-[13px] text-faint" use:reveal>
        Hand-written C++/Rust DSP — no off-the-shelf system effects. Denormal-flushed, sample-rate adaptive, zero-overshoot limiting.
      </p>
    </div>
  </section>

  <!-- ============================== MOBILE ============================== -->
  <section id="mobile" class="py-[clamp(72px,10vw,140px)]">
    <div class="wrap grid items-center gap-[clamp(30px,6vw,80px)] lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
      <!-- lg+: sticky phone; the screen follows the story -->
      <div class="order-2 hidden lg:order-1 lg:block">
        <div class="phone-sticky">
          <div class="pframe mx-auto w-[var(--pw)]">
            <div class="pbezel">
              <div class="pscreen">
                {#each shots as s, i}
                  <picture class="shot-fade" data-active={activeShot === i}>
                    <source type="image/avif" srcset="/shots/mobile-{s.n}-540.avif 540w, /shots/mobile-{s.n}-1080.avif 1080w" sizes="300px" />
                    <img
                      src="/shots/mobile-{s.n}-540.webp"
                      srcset="/shots/mobile-{s.n}-540.webp 540w, /shots/mobile-{s.n}-1080.webp 1080w"
                      sizes="300px"
                      width="540"
                      height="1170"
                      loading="lazy"
                      decoding="async"
                      alt={s.alt}
                      class="absolute inset-0 h-full w-full"
                    />
                  </picture>
                {/each}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="order-1 min-w-0 lg:order-2 lg:pb-[22svh]">
        <header class="reveal" use:reveal>
          <p class="kicker">05 — In your pocket</p>
          <h2 class="section-title mt-3.5 text-[clamp(32px,5vw,60px)]">The same engine,<br /><span class="grad-text">smaller screen.</span></h2>
          <p class="mt-[18px] text-[clamp(15px,1.4vw,18px)] text-muted">HypeMuzik for Android &amp; iOS carries a hand-tuned C++ DSP pipeline — the desktop&rsquo;s sound, wherever you are.</p>
        </header>

        <!-- below lg: horizontal scroll-snap gallery -->
        <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
        <div
          class="gallery mt-8 lg:hidden"
          role="region"
          aria-label="HypeMuzik mobile screens"
          tabindex="0"
        >
          {#each shots as s, i}
            <figure class="gallery-card">
              <div class="pframe">
                <div class="pbezel">
                  <div class="pscreen">
                    <picture>
                      <source type="image/avif" srcset="/shots/mobile-{s.n}-540.avif 540w, /shots/mobile-{s.n}-1080.avif 1080w" sizes="(min-width: 420px) 260px, 62vw" />
                      <img
                        src="/shots/mobile-{s.n}-540.webp"
                        srcset="/shots/mobile-{s.n}-540.webp 540w, /shots/mobile-{s.n}-1080.webp 1080w"
                        sizes="(min-width: 420px) 260px, 62vw"
                        width="540"
                        height="1170"
                        loading="lazy"
                        decoding="async"
                        alt={s.alt}
                        class="absolute inset-0 h-full w-full"
                      />
                    </picture>
                  </div>
                </div>
              </div>
              <figcaption class="mt-3 text-center font-mono text-[12px] text-muted">{features[i].b}</figcaption>
            </figure>
          {/each}
        </div>

        <ul class="reveal mt-7 flex flex-col" use:reveal={{ delay: 80 }} use:story>
          {#each features as f, i}
            <li
              class="story-item flex flex-col gap-1 border-b border-line py-[18px] last:border-b-0"
              data-i={i}
              data-active={activeFeature === i}
            >
              <b class="text-[16.5px]">{f.b}</b>
              <span class="text-[14.5px] text-muted">{f.s}</span>
            </li>
          {/each}
        </ul>
        <a href="#download" class="btn btn-ghost reveal mt-6" use:reveal>Get the mobile app</a>
      </div>
    </div>
  </section>

  <!-- ============================== NUMBERS ============================== -->
  <section class="border-y border-line bg-surface-1 py-[clamp(64px,8vw,110px)]" aria-label="By the numbers">
    <div class="wrap grid grid-cols-2 gap-x-6 gap-y-9 text-center sm:grid-cols-3 lg:grid-cols-5">
      {#each stats as s}
        <div class="reveal" use:reveal>
          <b class="grad-text block font-display text-[clamp(40px,5vw,66px)] font-semibold leading-none" use:countup={s.n}>{s.n}</b>
          <span class="mt-2 block text-sm text-muted">{s.l}</span>
        </div>
      {/each}
    </div>
  </section>

  <!-- ============================== YOUR DATA ==============================
       Google's OAuth verification requires the homepage to state, in plain
       language and without a login, exactly why the app asks for user data.
       The scope text comes from $lib/legal so this block, the privacy policy
       and the consent screen cannot drift apart. -->
  <section id="data" class="py-[clamp(72px,10vw,140px)]">
    <div class="wrap">
      <header class="reveal mx-auto max-w-[760px] text-center" use:reveal>
        <p class="kicker">06 &mdash; Your data</p>
        <h2 class="section-title mt-3.5 text-[clamp(32px,5vw,60px)]">
          Your library<br /><span class="grad-text">stays yours.</span>
        </h2>
        <p class="mx-auto mt-[18px] max-w-[58ch] text-[clamp(15px,1.4vw,18px)] text-muted">
          HypeMuzik has no accounts, no ads, and no server holding your music. Here is
          exactly what it touches, and why &mdash; before you install anything.
        </p>
      </header>

      <div class="mt-14 grid gap-4 lg:grid-cols-[1fr_1.25fr_1fr]">
        <article class="reveal rounded-2xl border border-line bg-surface-1 p-7" use:reveal>
          <span class="font-mono text-[11px] uppercase tracking-[0.08em] text-gold-deep">On device</span>
          <h3 class="mt-3 font-display text-[19px] font-semibold leading-snug">Nothing leaves your machine</h3>
          <p class="mt-2.5 text-[14.5px] text-muted">
            Your library index, your EQ curves, your presets and your play history are stored
            locally and never uploaded. Phone Link streams device to device over your own
            Wi-Fi &mdash; there is no middleman to send it through.
          </p>
        </article>

        <article
          class="reveal rounded-2xl border border-gold/35 bg-surface-1 p-7 shadow-[0_30px_60px_-34px_rgba(255,202,66,.3)]"
          use:reveal={{ delay: 70 }}
        >
          <span class="font-mono text-[11px] uppercase tracking-[0.08em] text-gold-deep">Why we ask</span>
          <h3 class="mt-3 font-display text-[19px] font-semibold leading-snug">Google Drive access, in full</h3>
          <p class="mt-2.5 text-[14.5px] text-muted">
            Connecting Drive is optional and never on by default. When you connect, HypeMuzik
            requests one permission &mdash; {DRIVE.grants} &mdash; {DRIVE.purpose}.
          </p>
          <p class="mt-3 text-[14.5px] text-muted">
            Your files stream <strong class="font-semibold text-text">straight from Google to your
            device</strong>. They are never copied to, cached on, or read by any server we run.
            HypeMuzik only ever reads; it cannot change or delete anything in your Drive.
          </p>
          <p class="mt-4 font-mono text-[11.5px] leading-relaxed break-all text-faint">{DRIVE.id}</p>
          <p class="mt-4 text-[14.5px] text-muted">
            Disconnect inside the app at any time, or revoke it at
            <a
              href={GOOGLE_PERMISSIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              class="text-text underline decoration-line-2 underline-offset-[3px] transition-colors hover:decoration-gold"
            >your Google Account permissions</a>.
          </p>
        </article>

        <article class="reveal rounded-2xl border border-line bg-surface-1 p-7" use:reveal={{ delay: 140 }}>
          <span class="font-mono text-[11px] uppercase tracking-[0.08em] text-gold-deep">Never</span>
          <h3 class="mt-3 font-display text-[19px] font-semibold leading-snug">What we don&rsquo;t do</h3>
          <ul class="mt-3 space-y-2.5 text-[14.5px] text-muted">
            {#each ['We never sell or share your data', 'We never use it for advertising', 'We never train AI models on it', 'We never upload your music library'] as line}
              <li class="flex gap-2.5">
                <span class="mt-[7px] size-1.5 shrink-0 rounded-full bg-green"></span>
                <span>{line}</span>
              </li>
            {/each}
          </ul>
        </article>
      </div>

      <p class="reveal mt-8 text-center text-[14.5px] text-muted" use:reveal>
        The full detail lives in our
        <a href="/privacy" class="text-text underline decoration-line-2 underline-offset-[3px] transition-colors hover:decoration-gold">Privacy Policy</a>
        and
        <a href="/terms" class="text-text underline decoration-line-2 underline-offset-[3px] transition-colors hover:decoration-gold">Terms &amp; Conditions</a>.
      </p>
    </div>
  </section>

  <!-- ============================== CTA ============================== -->
  <section id="download" class="py-[clamp(72px,10vw,140px)] text-center">
    <div class="wrap">
      <div class="relative overflow-hidden rounded-[28px] border border-line bg-surface-1 px-6 py-[clamp(48px,8vw,96px)]">
        <Spectrum
          class="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] w-full opacity-35 [mask-image:linear-gradient(to_top,#000,transparent)]"
        />
        <h2 class="section-title relative text-[clamp(36px,6vw,76px)] tracking-[-0.025em]">Hear the difference.</h2>
        <p class="relative mt-3.5 text-lg text-muted">Free to try. Studio-grade out of the box.</p>
        <div class="relative mt-8 flex flex-wrap justify-center gap-3">
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

        <!-- Reserves its own height so resolving the release doesn't shift the
             buttons above it. -->
        <p class="relative mt-6 min-h-[20px] font-mono text-[12.5px] text-faint">
          {#if release}
            Desktop v{release.version}
            {#if release.publishedAt}· {formatDate(release.publishedAt)}{/if}
            · macOS is one universal build (Apple Silicon + Intel) ·
            <a href={release.htmlUrl} rel="noopener" class="underline decoration-line-2 underline-offset-4 transition hover:text-gold">
              all downloads
            </a>
          {/if}
        </p>
      </div>
    </div>
  </section>
</main>

<SiteFooter {release} />
