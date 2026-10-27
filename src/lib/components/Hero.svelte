<script lang="ts">
  import { onMount } from 'svelte';
  import Logo from '$lib/components/Logo.svelte';

  // Deterministic (no Math.random: prerender and hydration must agree).
  const rnd = (i: number, salt: number) =>
    Math.abs(Math.sin((i + 1) * 12.9898 + salt * 78.233) * 43758.5453) % 1;
  // Retuned to the mobile app's own visualiser: base r=35.5, mostly short
  // spikes, a few tall ones clustered at the top (angle 0 = 12 o'clock).
  const SPIKES = 96;
  const spikes = Array.from({ length: SPIKES }, (_, i) => {
    const angle = (i * 360) / SPIKES;
    const fromTop = Math.min(angle, 360 - angle);
    const peak = fromTop < 32 ? (1 - fromTop / 32) * (6 + rnd(i, 2) * 8) : 0;
    return {
      angle: +angle.toFixed(3),
      len: +(5 + rnd(i, 0) * 9 + peak).toFixed(2),
      delay: +((i / SPIKES) * 0.3).toFixed(3),
      dur: +(0.38 + rnd(i, 1) * 0.52).toFixed(3)
    };
  });

  // Remount the ring on replay so its bloom restarts from frame 0.
  let ringKey = $state(0);
  let doneTimer: ReturnType<typeof setTimeout> | undefined;

  // Once the timeline has played, `intro-done` drops will-change (releasing the
  // big compositor layers) and removes the ring (stops its 64 looping spikes).
  function armDone() {
    clearTimeout(doneTimer);
    doneTimer = setTimeout(() => document.documentElement.classList.add('intro-done'), 3300);
  }

  // Same measurement as the gate script in app.html: where the phone must start
  // so its screen centre sits at the window centre (layout offsets, not
  // getBoundingClientRect, so running transforms don't pollute it).
  function measureDock() {
    const dock = document.getElementById('phone-dock');
    const cx = dock?.offsetParent as HTMLElement | null;
    if (!dock || !cx) return;
    const s = document.documentElement.style;
    s.setProperty('--dock-x', cx.offsetWidth * 0.545 - (dock.offsetLeft + dock.offsetWidth / 2) + 'px');
    s.setProperty('--dock-y', cx.offsetHeight / 2 - (dock.offsetTop + dock.offsetHeight / 2) + 'px');
  }

  function replay() {
    const d = document.documentElement;
    measureDock();
    clearTimeout(doneTimer);
    d.classList.remove('intro-go', 'intro-skip', 'intro-done');
    d.classList.add('intro-replay');
    ringKey += 1;
    void d.offsetWidth;
    setTimeout(() => {
      d.classList.add('intro-go');
      armDone();
    }, 650);
  }

  onMount(() => {
    const d = document.documentElement;
    if (d.classList.contains('intro-go')) {
      armDone();
      return () => clearTimeout(doneTimer);
    }
    // The gate script in app.html decides go/skip; wait for its verdict.
    const mo = new MutationObserver(() => {
      if (d.classList.contains('intro-go')) armDone();
      if (d.classList.contains('intro-go') || d.classList.contains('intro-skip')) mo.disconnect();
    });
    mo.observe(d, { attributes: true, attributeFilter: ['class'] });
    return () => {
      mo.disconnect();
      clearTimeout(doneTimer);
    };
  });
</script>

<section class="hero" aria-labelledby="hero-title">
  <div class="stage">
    <div class="cluster">
      <div class="cluster-x">
        <div class="window">
          <div class="frame" aria-hidden="true">
            <div class="titlebar">
              <span class="dot" style="background:#e5564b"></span>
              <span class="dot" style="background:#efab3c"></span>
              <span class="dot" style="background:#34c13a"></span>
              <b class="title">HypeMuzik — Equalizer</b>
            </div>
          </div>
          <div class="titlebar-spacer"></div>
          <div class="shot-area">
            <div class="shot">
              <picture>
                <source
                  type="image/avif"
                  srcset="/hero/app-desktop-960.avif 960w, /hero/app-desktop-1440.avif 1440w, /hero/app-desktop-2160.avif 2160w"
                  sizes="(min-width: 800px) 760px, 92vw"
                />
                <img
                  id="hero-shot"
                  src="/hero/app-desktop-1440.webp"
                  srcset="/hero/app-desktop-960.webp 960w, /hero/app-desktop-1440.webp 1440w, /hero/app-desktop-2160.webp 2160w"
                  sizes="(min-width: 800px) 760px, 92vw"
                  width="1440"
                  height="870"
                  fetchpriority="high"
                  loading="eager"
                  alt="HypeMuzik desktop app — 31-band equalizer over a live spectrum, now playing and queue"
                />
              </picture>
            </div>
            <span class="window-dim" aria-hidden="true"></span>
          </div>
        </div>

        <!-- Story: the ring blooms -> it is the phone's own visualiser -> the
             camera pulls back to the phone -> the phone docks and the desktop
             powers on beside it. -->
        <div class="phone-dock" id="phone-dock" aria-hidden="true">
          <div class="phone-cam">
            <span class="phone-bezel"></span>
            <div class="phone-screen">
              <picture>
                <source
                  type="image/avif"
                  srcset="/hero/phone-visualiser-540.avif 540w, /hero/phone-visualiser-1080.avif 1080w"
                  sizes="(min-width: 800px) 480px, 66vw"
                />
                <img
                  id="phone-shot"
                  src="/hero/phone-visualiser-540.webp"
                  srcset="/hero/phone-visualiser-540.webp 540w, /hero/phone-visualiser-1080.webp 1080w"
                  sizes="(min-width: 800px) 480px, 66vw"
                  width="540"
                  height="1170"
                  loading="eager"
                  alt=""
                />
              </picture>
            </div>
            {#key ringKey}
              <div class="halo">
                <svg viewBox="-100 -100 200 200">
                  <circle class="outer" r="89" fill="none" />
                  <g class="orbit-g">
                    <circle class="orbit o1" r="60" fill="none" />
                    <circle class="orbit o2" r="48" fill="none" />
                  </g>
                  <g class="ring-spikes">
                    {#each spikes as s, i (i)}
                      <g transform="rotate({s.angle})">
                        <rect
                          class="spike"
                          x="-0.75"
                          y={-(35.5 + s.len)}
                          width="1.5"
                          height={s.len}
                          rx="0.75"
                          style="--i-delay:{s.delay}s;--dur:{s.dur}s"
                        />
                      </g>
                    {/each}
                  </g>
                  <circle class="ring-stroke" r="34" fill="none" />
                </svg>
              </div>
            {/key}
          </div>
        </div>
      </div>
    </div>

    <button class="replay" type="button" aria-label="Replay the intro animation" onclick={replay}>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M3 4v5h5" />
        <path d="M3.6 14a8.5 8.5 0 1 0 1.2-6.6L3 9" />
      </svg>
    </button>
  </div>

  <div class="copy wrap">
    <div class="hero-top">
      <Logo size={40} />
      <p class="product">HypeMuzik</p>
      <h1 id="hero-title">Shape every <span class="grad-text">sound</span> you hear.</h1>
    </div>
    <div class="hero-body">
      <p class="lede">
        A 31-band equalizer, a full custom DSP chain, and system-wide processing —
        on the desktop. A player that carries the same engine in your pocket. And a
        link that streams your phone&rsquo;s music straight through your desktop&rsquo;s sound.
      </p>
      <div class="ctas">
        <a href="#download" class="btn btn-primary">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"
            ><path fill="currentColor" d="M12 16l-5-5h3V4h4v7h3l-5 5zm-7 2h14v2H5z" /></svg
          >
          Download for desktop
        </a>
        <a href="#mobile" class="btn btn-ghost">Get the mobile app</a>
      </div>
      <a href="#hype-connect" class="announce">
        <b>New</b>
        <span>Hype Connect — play from any browser</span>
        <i aria-hidden="true">›</i>
      </a>
    </div>
  </div>
</section>

<style>
  /* ---------- final (no-JS / reduced-motion) layout ---------- */
  .hero {
    position: relative;
    overflow: hidden; /* the zoomed screenshot must never cause horizontal scroll */
    padding-top: clamp(24px, 4vw, 48px);
    --cam: 3; /* camera start scale */
    padding-bottom: clamp(64px, 8vw, 112px);
  }
  .stage {
    position: relative;
    width: 100%;
  }
  .cluster {
    /* W: window width. 90% (not 100%) leaves room for the phone's right overhang. */
    width: clamp(300px, min(90%, 820px, (100svh - 490px) * 1.43), 820px);
    margin-inline: auto;
  }
  .cluster-x {
    position: relative;
    width: 100%;
    container-type: inline-size;
    transform: translateX(-4.5%); /* window + phone read as centred */
  }
  .window {
    position: relative;
    padding: 1px;
    --tb: max(26px, 5cqw);
  }
  .frame {
    position: absolute;
    inset: 0;
    z-index: 0;
    background: var(--color-surface-1);
    border: 1px solid var(--color-line);
    border-radius: 18px;
    box-shadow: 0 40px 80px -30px rgba(0, 0, 0, 0.8);
  }
  .titlebar {
    display: flex;
    align-items: center;
    gap: max(5px, 0.95cqw);
    height: var(--tb);
    padding-left: max(10px, 2cqw);
    border-bottom: 1px solid var(--color-line);
    background: rgba(255, 255, 255, 0.02);
    border-radius: 17px 17px 0 0;
  }
  .dot {
    width: max(7px, 1.45cqw);
    height: max(7px, 1.45cqw);
    border-radius: 50%;
  }
  .title {
    margin-left: max(4px, 0.8cqw);
    font-family: var(--font-mono);
    font-size: clamp(9px, 1.6cqw, 12px);
    font-weight: 400;
    color: var(--color-faint);
  }
  .titlebar-spacer {
    height: var(--tb);
  }
  .shot-area {
    position: relative;
    z-index: 1;
    aspect-ratio: 2880 / 1740;
  }
  .shot img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 0 0 17px 17px;
  }

  .window-dim {
    position: absolute;
    inset: 0;
    border-radius: 0 0 17px 17px;
    background: #000;
    opacity: 0;
    pointer-events: none;
  }

  /* ---------- phone (real screenshot in a flat bezel) ---------- */
  .phone-dock {
    position: absolute;
    z-index: 3;
    right: -8%;
    bottom: -7%;
    width: 21%;
    container-type: inline-size;
  }
  .phone-cam {
    position: relative;
    padding: 2.2cqw;
    transform-origin: 50% 50%; /* = the screen centre (bezel is symmetric) */
  }
  .phone-bezel {
    position: absolute;
    inset: 0;
    border: 1px solid var(--color-line-2);
    border-radius: 13cqw;
    background: #060708;
    box-shadow: 0 30cqw 42cqw -18cqw rgba(0, 0, 0, 0.85);
  }
  .phone-screen {
    position: relative;
    background: #0a0b0e;
    overflow: hidden;
    border-radius: 10.8cqw;
  }
  .phone-screen img {
    display: block;
    width: 100%;
    height: auto;
    aspect-ratio: 1080 / 2340;
  }

  /* ---------- ring: the phone's own visualiser, as vector ----------
     viewBox -100..100 with the core circle r=34 <-> 0.208 x screen width, so
     the ring box is 1.224 x the screen width and registers onto the
     screenshot at any zoom (it lives inside the scaled .phone-cam). */
  .halo {
    display: none;
    position: absolute;
    z-index: 2;
    left: 50%;
    top: 50%;
    width: 117cqw; /* 1.224 x (100cqw - 2 x 2.2cqw) */
    aspect-ratio: 1;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }
  .halo svg {
    display: block;
    width: 100%;
    height: 100%;
    overflow: visible;
  }
  .spike {
    fill: var(--color-gold);
    transform-box: fill-box;
    transform-origin: 50% 100%;
  }
  .ring-stroke {
    stroke: var(--color-gold);
    stroke-width: 1.2;
    stroke-dasharray: 213.6;
    stroke-dashoffset: 0;
  }
  .outer {
    stroke: var(--color-gold);
    stroke-width: 0.8;
    opacity: 0.35;
  }
  .orbit {
    stroke: var(--color-gold);
    stroke-width: 0.8;
    stroke-dasharray: 0.6 5;
    stroke-linecap: round;
    opacity: 0.45;
    transform-box: fill-box;
    transform-origin: center;
  }

  /* ---------- copy ---------- */
  .copy {
    position: relative;
    z-index: 3;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-top: clamp(28px, 4vw, 44px);
    --rise-top: 64px;
    --rise-body: 48px;
  }
  .hero-top {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .product {
    margin: 10px 0 0;
    font-family: var(--font-display);
    font-size: 21px;
    font-weight: 600;
    line-height: 1.2;
    word-spacing: 0.12em;
  }
  h1 {
    margin: 14px 0 0;
    font-family: var(--font-display);
    font-weight: 600;
    font-size: clamp(40px, 5.2vw, 76px);
    line-height: 1;
    letter-spacing: -0.025em;
    word-spacing: 0.12em; /* Clash's narrow space; see .section-title in app.css */
    text-wrap: balance;
  }
  .lede {
    margin: 24px auto 0;
    max-width: 40em;
    font-size: clamp(16px, 1.5vw, 19px);
    color: var(--color-muted);
  }
  .ctas {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 14px;
    margin-top: 32px;
  }
  .announce {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    margin-top: 22px;
    padding: 5px 14px 5px 6px;
    border: 1px solid var(--color-line-2);
    border-radius: 999px;
    font-size: 13.5px;
    color: var(--color-muted);
    transition: border-color 0.2s, color 0.2s;
  }
  .announce:hover { border-color: var(--color-gold); color: var(--color-text); }
  .announce b {
    padding: 2px 8px;
    border-radius: 999px;
    background: var(--color-gold);
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--color-bg);
  }
  .announce i { font-style: normal; color: var(--color-gold); }
  @media (max-width: 639px) {
    .hero { --cam: 4; }
    .copy {
      --rise-top: 40px;
      --rise-body: 32px;
    }
  }

  /* ---------- replay ---------- */
  .replay {
    position: absolute;
    right: 16px;
    bottom: -48px;
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    padding: 0;
    border: 0;
    border-radius: 50%;
    color: rgba(236, 238, 242, 0.8);
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    cursor: pointer;
    visibility: hidden;
    opacity: 0;
    pointer-events: none;
    transition: background-color 0.2s, transform 0.15s;
  }
  @media (min-width: 1100px) {
    .replay {
      right: calc(50% - 480px); /* clear of the phone's overhang */
      bottom: 0;
    }
  }
  .replay:hover { background: rgba(255, 255, 255, 0.14); }
  .replay:active { transform: scale(0.95); }

  /* =====================================================================
     Intro. Only under html.js and never with reduced motion; everything
     else above IS the final layout. All animations are transform/opacity and
     use fill-mode `backwards`, so after the intro each layer falls back to its
     plain base style above. State classes live on <html> (set by the gate
     script in app.html), which Svelte never manages.
     ===================================================================== */
  @media (prefers-reduced-motion: no-preference) {
    :global(html.js:not(.intro-skip)) .halo { display: block; }
    /* Must out-specify the rule above, or the invisible ring keeps its 96
       spike animations running forever after the intro. */
    :global(html.js:not(.intro-skip).intro-done) .halo { display: none; }
    /* Held while the splash covers the page, so the ring blooms (display:none
       -> block restarts its animations) around the mark as it arrives. */
    :global(html.js.splash:not(.intro-skip)) .halo { display: none; }

    /* --- will-change only while the intro is live --- */
    :global(html.js:not(.intro-skip):not(.intro-done)) .window,
    :global(html.js:not(.intro-skip):not(.intro-done)) .cluster,
    :global(html.js:not(.intro-skip):not(.intro-done)) .phone-dock,
    :global(html.js:not(.intro-skip):not(.intro-done)) .phone-cam,
    :global(html.js:not(.intro-skip):not(.intro-done)) .phone-bezel,
    :global(html.js:not(.intro-skip):not(.intro-done)) .phone-screen {
      will-change: transform, opacity;
    }

    /* --- WAITING: parked at animation start values --- */
    :global(html.js:not(.intro-go):not(.intro-skip)) .phone-screen { opacity: 0; }
    :global(html.js:not(.intro-go):not(.intro-skip)) .phone-bezel { opacity: 0; }
    :global(html.js:not(.intro-go):not(.intro-skip)) .phone-cam { transform: scale(var(--cam)); }
    :global(html.js:not(.intro-go):not(.intro-skip)) .phone-dock {
      transform: translate(var(--dock-x, 0px), var(--dock-y, 0px));
    }
    :global(html.js:not(.intro-go):not(.intro-skip)) .cluster { transform: translateY(28px); }
    :global(html.js:not(.intro-go):not(.intro-skip)) .window {
      opacity: 0;
      transform: translateX(-5%) scale(0.97);
    }
    :global(html.js:not(.intro-go):not(.intro-skip)) .window-dim { opacity: 0.8; }
    :global(html.js:not(.intro-go):not(.intro-skip):not(.intro-replay)) .hero-top {
      opacity: 0;
      transform: translateY(var(--rise-top));
    }
    :global(html.js:not(.intro-go):not(.intro-skip):not(.intro-replay)) .hero-body {
      opacity: 0;
      transform: translateY(var(--rise-body));
    }

    /* --- ring: blooms and loops from first paint (waiting + go) --- */
    :global(html.js:not(.intro-skip)) .spike {
      animation:
        spike-in 0.4s var(--ease-out-cubic) var(--i-delay) both,
        spike-pulse var(--dur) ease-in-out calc(var(--i-delay) + 0.3s) infinite alternate backwards;
    }
    :global(html.js:not(.intro-skip)) .ring-stroke { animation: ring-draw 0.55s var(--ease-out-cubic) both; }
    :global(html.js:not(.intro-skip)) .outer { animation: fade-in 0.6s var(--ease-out-quad) both; }
    :global(html.js:not(.intro-skip)) .o1 { animation: orbit-out 1.4s var(--ease-out-quad) 0.1s both; }
    :global(html.js:not(.intro-skip)) .o2 { animation: orbit-out 1.4s var(--ease-out-quad) 0.45s both; }

    /* --- GO: the timeline (t = 0 when intro-go is added) --- */
    :global(html.intro-go) .phone-screen { animation: fade-in 0.35s var(--ease-out-quad) 0.1s backwards; }
    /* The visualiser never freezes: only the outer circle + orbits leave at
       once; core circle + pulsing spikes stay registered over the screenshot
       through the pull-back and fade at 1.25s (pull-back ends 1.55s). */
    :global(html.js.intro-go) .outer,
    :global(html.js.intro-go) .orbit-g { animation: ring-out 0.3s linear forwards; }
    :global(html.js.intro-go) .ring-spikes,
    :global(html.js.intro-go) .ring-stroke { animation: ring-out 0.35s linear 1.25s forwards; }
    :global(html.intro-go) .phone-cam { animation: cam 1.2s var(--ease-camera) 0.35s backwards; }
    :global(html.intro-go) .phone-bezel { animation: fade-in 0.4s var(--ease-out-quad) 0.6s backwards; }
    :global(html.intro-go) .cluster { animation: drift 1s var(--ease-out-quad) 0.7s backwards; }
    :global(html.intro-go:not(.intro-replay)) .hero-top { animation: rise-top 0.5s var(--ease-out-cubic) 1.1s backwards; }
    :global(html.intro-go:not(.intro-replay)) .hero-body { animation: rise-body 0.7s var(--ease-out-quad) 1.35s backwards; }
    :global(html.intro-go) .phone-dock { animation: dock 0.75s var(--ease-arrive) 1.45s backwards; }
    :global(html.intro-go) .window {
      animation:
        fade-in 0.35s linear 1.45s backwards,
        win-in 0.75s var(--ease-arrive) 1.45s backwards;
    }
    :global(html.intro-go) .window-dim { animation: dim-off 0.5s ease-out 1.6s backwards; }
    :global(html.intro-go) .replay {
      pointer-events: auto;
      animation: replay-in 0.4s ease-in-out 2.4s both;
    }

    /* --- SKIP: no intro, just a quick copy rise --- */
    :global(html.js.intro-skip) .hero-top { animation: rise-top 0.5s var(--ease-out-cubic) backwards; }
    :global(html.js.intro-skip) .hero-body { animation: rise-body 0.7s var(--ease-out-quad) backwards; }

    @keyframes spike-in { from { opacity: 0; scale: 0; } to { opacity: 1; scale: 1; } }
    @keyframes spike-pulse { from { transform: scaleY(0.3); } to { transform: scaleY(1); } }
    @keyframes ring-draw { from { stroke-dashoffset: 213.6; } to { stroke-dashoffset: 0; } }
    @keyframes orbit-out {
      from { transform: scale(0.7); opacity: 0.5; }
      to { transform: scale(1.7); opacity: 0; }
    }
    @keyframes ring-out { to { opacity: 0; } }
    @keyframes fade-in { from { opacity: 0; } }
    @keyframes cam { from { transform: scale(var(--cam)); } }
    @keyframes drift { from { transform: translateY(28px); } }
    @keyframes dock { from { transform: translate(var(--dock-x, 0px), var(--dock-y, 0px)); } }
    @keyframes win-in { from { transform: translateX(-5%) scale(0.97); } }
    @keyframes dim-off { from { opacity: 0.8; } }
    @keyframes rise-top { from { opacity: 0; transform: translateY(var(--rise-top)); } }
    @keyframes rise-body { from { opacity: 0; transform: translateY(var(--rise-body)); } }
    @keyframes replay-in {
      from { visibility: hidden; opacity: 0; }
      to { visibility: visible; opacity: 1; }
    }
  }
</style>
