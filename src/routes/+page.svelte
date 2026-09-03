<script lang="ts">
  import { onMount } from 'svelte';
  import Logo from '$lib/components/Logo.svelte';
  import Spectrum from '$lib/components/Spectrum.svelte';
  import Scene3D from '$lib/components/Scene3D.svelte';
  import DownloadButton from '$lib/components/DownloadButton.svelte';
  import SiteFooter from '$lib/components/SiteFooter.svelte';
  import { reveal, countup, tilt } from '$lib/actions';
  import { fetchLatestRelease, formatDate, RELEASES_URL, type LatestRelease } from '$lib/releases';
  import { IOS_URL, PLAY_URL } from '$lib/links';

  let y = $state(0);
  const stuck = $derived(y > 8);

  // Below md the section links have nowhere to live, so they get a
  // disclosure panel rather than disappearing.
  let menuOpen = $state(false);
  const NAV = [
    ['#connect', 'Connect'],
    ['#desktop', 'Desktop'],
    ['#chain', 'The chain'],
    ['#mobile', 'Mobile']
  ];

  // Desktop downloads resolve against the live GitHub release, so publishing a
  // new hype-desktop version updates this page with no rebuild. Until it
  // resolves — and if it never does — the buttons point at the releases page.
  let release = $state<LatestRelease | null>(null);
  onMount(async () => {
    release = await fetchLatestRelease();
  });

  // Deterministic, varied animation timings for the mock equalizer.
  const phoneEq = Array.from({ length: 12 }, (_, i) => ({ delay: (i * 90) % 900 }));


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
  <title>HypeMuzik — Studio-grade sound, on every device</title>
  <meta
    name="description"
    content="A 31-band equalizer, a full custom DSP chain, system-wide audio, and a phone that streams straight into your desktop's sound. One sound engine, every device."
  />
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
  <div class="wrap flex h-[68px] items-center justify-between gap-6">
    <a href="#top" class="flex items-center gap-2.5">
      <Logo size={30} />
      <span class="font-display text-[19px] font-semibold tracking-[-0.01em]">HypeMuzik</span>
    </a>
    <nav class="hidden items-center gap-8 md:flex" aria-label="Primary">
      {#each NAV as [href, label]}
        <a
          {href}
          class="group relative text-[15px] font-medium text-muted transition-colors hover:text-text"
        >
          {label}
          <span
            class="sweep absolute -bottom-1.5 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full"
          ></span>
        </a>
      {/each}
    </nav>
    <div class="flex items-center gap-2">
      <a href="#download" class="btn btn-ghost px-[18px] py-[9px]">Get HypeMuzik</a>
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
  <section class="relative overflow-hidden pb-[clamp(76px,9vw,132px)] pt-[clamp(48px,8vw,100px)]">
    <Scene3D
      class="pointer-events-none absolute inset-x-0 bottom-0 h-[34%] w-full opacity-90"
    />

    <div class="wrap relative z-[2] grid items-center gap-[clamp(24px,4vw,56px)] lg:grid-cols-[1.05fr_0.95fr]">
      <div>
        <p class="eyebrow">
          <span class="sweep h-2 w-2 rounded-full shadow-[0_0_12px_var(--color-gold)]"></span>
          Desktop&nbsp;+&nbsp;Mobile · One sound engine
        </p>
        <h1 class="section-title mt-5 text-[clamp(44px,7.4vw,92px)] leading-[0.98] tracking-[-0.025em]">
          Shape every<br /><span class="grad-text">sound</span> you hear.
        </h1>
        <p class="mt-6 max-w-[34em] text-[clamp(16px,1.5vw,19px)] text-muted">
          A 31-band equalizer, a full custom DSP chain, and system-wide processing —
          on the desktop. A player that carries the same engine in your pocket. And a
          link that streams your phone&rsquo;s music straight through your desktop&rsquo;s sound.
        </p>
        <div class="mt-8 flex flex-wrap gap-3.5">
          <a href="#download" class="btn btn-primary">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"
              ><path fill="currentColor" d="M12 16l-5-5h3V4h4v7h3l-5 5zm-7 2h14v2H5z" /></svg
            >
            Download for desktop
          </a>
          <a href="#mobile" class="btn btn-ghost">Get the mobile app</a>
        </div>
        <ul class="mt-8 flex flex-wrap gap-2.5" aria-label="At a glance">
          {#each ['31-band EQ', 'System-wide audio', 'Phone → Desktop streaming', 'Karaoke lyrics'] as chip}
            <li class="rounded-full border border-line bg-white/[0.02] px-3.5 py-[7px] font-mono text-[12.5px] text-muted">
              {chip}
            </li>
          {/each}
        </ul>
      </div>

      <!-- Device cluster -->
      <div class="relative min-h-[400px] [perspective:1400px]" aria-hidden="true">
        <!-- Desktop window -->
        <div
          class="overflow-hidden rounded-[18px] border border-line bg-surface-1 shadow-[0_40px_80px_-30px_rgba(0,0,0,.8)] transition-transform duration-500 [transform:rotateY(-13deg)_rotateX(5deg)]"
        >
          <div class="flex items-center gap-[7px] border-b border-line bg-white/[0.02] px-4 py-3">
            <span class="h-[11px] w-[11px] rounded-full bg-[#e5564b]"></span>
            <span class="h-[11px] w-[11px] rounded-full bg-[#efab3c]"></span>
            <span class="h-[11px] w-[11px] rounded-full bg-[#34c13a]"></span>
            <b class="ml-2.5 font-mono text-xs font-normal text-faint">HypeMuzik — Player</b>
          </div>
          <img
            src="/app-desktop.png"
            alt="HypeMuzik desktop app — player, library and now-playing"
            class="block w-full"
            width="1600"
            height="966"
          />
        </div>

        <!-- Phone -->
        <div
          class="absolute -bottom-[8%] -right-[6%] w-[168px] rounded-[28px] border border-line-2 bg-surface-1 px-3 pb-4 pt-3 shadow-[0_50px_70px_-30px_rgba(0,0,0,.85)] [transform:rotateY(-13deg)_rotateX(4deg)_translateZ(40px)]"
        >
          <div class="mx-auto mb-3 h-[5px] w-[46px] rounded-full bg-line-2"></div>
          <div class="flex h-[120px] items-end gap-[3px] rounded-[14px] bg-surface-2 p-3">
            {#each phoneEq as b}
              <i
                class="flex-1 animate-vu rounded-[2px] bg-gold/80"
                style="height:34%;animation-delay:{b.delay}ms"
              ></i>
            {/each}
          </div>
          <div class="mt-3 flex flex-col gap-[5px]">
            <p class="text-xs font-bold text-text/50 [filter:blur(.3px)]">Lights blur into the rain</p>
            <p class="text-[13.5px] font-bold text-white">
              <span>Words</span> <span>light</span> <span class="text-text/30">up as they</span>
            </p>
            <p class="text-xs font-bold text-text/25">Following the signal home</p>
          </div>
          <div class="mt-3.5 flex items-center justify-center gap-4">
            <span class="h-[9px] w-[9px] rounded-[2px] bg-faint"></span>
            <span class="sweep h-[26px] w-[26px] rounded-full"></span>
            <span class="h-[9px] w-[9px] rounded-[2px] bg-faint"></span>
          </div>
        </div>

        <!-- Link wire -->
        <svg class="absolute bottom-[14%] right-[4%] z-[1] h-auto w-[46%]" viewBox="0 0 200 120" aria-hidden="true">
          <path
            class="animate-dash"
            d="M20 92 C 80 92, 110 40, 178 28"
            fill="none"
            stroke="url(#cl)"
            stroke-width="2"
            stroke-dasharray="4 6"
            opacity=".55"
          />
      </svg>
      </div>
    </div>

    <div
      class="absolute bottom-[18px] left-1/2 flex animate-bob flex-col items-center gap-1 font-mono text-[11px] uppercase tracking-[0.2em] text-faint"
      aria-hidden="true"
    >
      scroll
      <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12 16l-6-6h12z" /></svg>
    </div>
  </section>

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

  <!-- ============================== DESKTOP (bento) ============================== -->
  <section id="desktop" class="py-[clamp(72px,10vw,140px)]">
    <div class="wrap">
      <header class="reveal mx-auto max-w-[760px] text-center" use:reveal>
        <p class="kicker">02 — The control room</p>
        <h2 class="section-title mt-3.5 text-[clamp(32px,5vw,60px)]">The desktop is a <span class="grad-text">studio</span>.</h2>
        <p class="mx-auto mt-[18px] max-w-[56ch] text-[clamp(15px,1.4vw,18px)] text-muted">
          Everything you hear, shaped — not just HypeMuzik&rsquo;s player, but every app on your machine.
        </p>
      </header>

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
        <p class="kicker">03 — Signal path</p>
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
    <div class="wrap grid items-center gap-[clamp(30px,6vw,80px)] lg:grid-cols-[0.9fr_1.1fr]">
      <div class="order-2 grid place-items-center lg:order-1" aria-hidden="true">
        <div
          class="w-[280px] rounded-[34px] border border-line-2 bg-surface-1 px-4 pb-[22px] pt-4 shadow-[0_50px_80px_-40px_rgba(0,0,0,.9)] [transform:perspective(1600px)_rotateY(12deg)_rotateX(4deg)]"
        >
          <div class="mx-auto mb-3.5 h-[5px] w-[52px] rounded-full bg-line-2"></div>
          <div class="flex h-[200px] items-end gap-[5px] rounded-[16px] bg-surface-2 p-4">
            {#each phoneEq as b}
              <i
                class="flex-1 animate-vu rounded-[3px] bg-gold/80"
                style="height:34%;animation-delay:{b.delay}ms"
              ></i>
            {/each}
          </div>
          <div class="mt-3.5 flex flex-col gap-[5px]">
            <p class="text-xs font-bold text-text/50 [filter:blur(.3px)]">Carry the sound with me</p>
            <p class="text-[13.5px] font-bold text-white"><span>Everywhere</span> <span class="text-text/30">I go</span></p>
            <p class="text-xs font-bold text-text/25">Same engine, smaller screen</p>
          </div>
        </div>
      </div>

      <div class="order-1 lg:order-2">
        <header class="reveal" use:reveal>
          <p class="kicker">04 — In your pocket</p>
          <h2 class="section-title mt-3.5 text-[clamp(32px,5vw,60px)]">The same engine,<br /><span class="grad-text">smaller screen.</span></h2>
          <p class="mt-[18px] text-[clamp(15px,1.4vw,18px)] text-muted">HypeMuzik for Android &amp; iOS carries a hand-tuned C++ DSP pipeline — the desktop&rsquo;s sound, wherever you are.</p>
        </header>
        <ul class="reveal mt-7 flex flex-col" use:reveal={{ delay: 80 }}>
          {#each [
            { b: 'The full chain, on a phone', s: 'Graphic and parametric EQ, tone, dynamics, space, room reverb and a speaker EQ — the desktop stages, hand-tuned in C++.' },
            { b: 'Stem separation on device', s: 'Split a track into vocals, drums, bass and other, then mix the stems live.' },
            { b: 'One search, every source', s: 'Your library, your cloud drives and YouTube Music in a single list — tap anything to start a station.' },
            { b: 'Daily mixes that learn', s: 'Mixes blended from your drive, YouTube and videos, seeded by the time of day and what you actually play.' },
            { b: 'Gapless, crossfade & replay-gain', s: 'Seamless transitions and consistent loudness across your library.' },
            { b: 'Synced lyrics & identify', s: 'Karaoke lyrics and AcoustID fingerprinting, the same as desktop.' },
            { b: 'Be a source, or a speaker', s: 'Stream your library to the desktop over your own Wi-Fi, or receive a cast from it.' }
          ] as f}
            <li class="flex flex-col gap-1 border-b border-line py-[18px] last:border-b-0">
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
          <DownloadButton label="macOS" fallbackUrl={RELEASES_URL} platform={release?.platforms.mac}>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M17.05 12.04c-.03-2.6 2.13-3.85 2.22-3.91-1.21-1.77-3.09-2.01-3.76-2.04-1.6-.16-3.12.94-3.93.94-.81 0-2.06-.92-3.39-.89-1.74.03-3.35 1.01-4.25 2.57-1.81 3.14-.46 7.79 1.3 10.34.86 1.25 1.89 2.65 3.24 2.6 1.3-.05 1.79-.84 3.36-.84 1.57 0 2.01.84 3.39.81 1.4-.03 2.29-1.27 3.15-2.53.99-1.45 1.4-2.86 1.42-2.93-.03-.01-2.72-1.04-2.75-4.13zM14.69 4.81c.72-.87 1.2-2.08 1.07-3.29-1.03.04-2.28.69-3.02 1.56-.66.77-1.24 2-1.08 3.18 1.15.09 2.32-.58 3.03-1.45z"/></svg>
          </DownloadButton>
          <DownloadButton label="Windows" fallbackUrl={RELEASES_URL} platform={release?.platforms.windows}>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M3 4.5l8-1.1v8.1H3V4.5zm0 15l8 1.1v-8H3v6.9zM12 3.3L21 2v9.5h-9V3.3zM12 12.5h9V22l-9-1.3v-8.2z"/></svg>
          </DownloadButton>
          <DownloadButton label="Linux" fallbackUrl={RELEASES_URL} platform={release?.platforms.linux}>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 2c2 0 3 2 3 4 0 1 .6 2 1.4 3.2C17.6 11 19 13 19 16c0 3-2 6-7 6s-7-3-7-6c0-3 1.4-5 2.6-6.8C8.4 8 9 7 9 6c0-2 1-4 3-4z"/></svg>
          </DownloadButton>
          <a href={IOS_URL} target="_blank" rel="noopener noreferrer" class="btn btn-ghost">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M17.05 12.04c-.03-2.6 2.13-3.85 2.22-3.91-1.21-1.77-3.09-2.01-3.76-2.04-1.6-.16-3.12.94-3.93.94-.81 0-2.06-.92-3.39-.89-1.74.03-3.35 1.01-4.25 2.57-1.81 3.14-.46 7.79 1.3 10.34.86 1.25 1.89 2.65 3.24 2.6 1.3-.05 1.79-.84 3.36-.84 1.57 0 2.01.84 3.39.81 1.4-.03 2.29-1.27 3.15-2.53.99-1.45 1.4-2.86 1.42-2.93-.03-.01-2.72-1.04-2.75-4.13zM14.69 4.81c.72-.87 1.2-2.08 1.07-3.29-1.03.04-2.28.69-3.02 1.56-.66.77-1.24 2-1.08 3.18 1.15.09 2.32-.58 3.03-1.45z"/></svg>
            App Store
          </a>
          <a href={PLAY_URL} target="_blank" rel="noopener noreferrer" class="btn btn-ghost">
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
