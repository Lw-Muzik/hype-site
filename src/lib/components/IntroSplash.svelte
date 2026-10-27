<script lang="ts">
  import { onMount } from 'svelte';
  import { INTRO_FADE_MS, drawIntro, toRgb, type IntroTheme } from '$lib/introCanvas';

  // The apps' splash (introCanvas.ts, shared verbatim with the desktop app and
  // the web remote) with a site-only ending: instead of fading out, it hands
  // over to the hero intro. The wordmark tucks back into the mark, the mark
  // glides into the core of the hero's ring as the ground dissolves and the
  // ring blooms around it, then it melts into the phone screenshot's album art
  // as the camera starts to pull back.
  //
  // State lives on <html>, like the hero's:
  //   splash      set by the head script in app.html: this layer covers the
  //               page and the hero's ring is held back.
  //   splash-run  this component took over; the layer stays up until it's done.
  // Removing `splash` + 'hm:splash-handoff' starts the ring and the gate's clock.

  const HOLD = 3.4; // the lockup settles at 3.2 s; a beat to read it
  const MOVE = 0.7; // glide into the ring
  const RING_AT = 0.2; // the ring starts blooming this far into the glide
  const ART = 0.416; // album-art diameter / phone screenshot width
  const MARK = 0.86; // mark width / album-art diameter: its gold disc spans
  // ~the full width, so this leaves a dark gap inside the ring
  const DISC_X = 149 / 304; // the disc's centre in the 304x325 artwork (the
  const DISC_Y = 173.5 / 325; // note's flag pushes the box up and right)

  let root = $state<HTMLDivElement>();
  let canvas = $state<HTMLCanvasElement>();

  const clamp = (v: number) => Math.min(1, Math.max(0, v));
  const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
  const bez = (a: number, b: number, t: number) =>
    3 * a * t * (1 - t) ** 2 + 3 * b * t * t * (1 - t) + t ** 3;
  // --ease-camera, cubic-bezier(.45,0,.15,1): the glide moves like the
  // pull-back it hands over to.
  function camera(x: number) {
    const p = clamp(x);
    let lo = 0;
    let hi = 1;
    let t = p;
    for (let i = 0; i < 16; i++) {
      t = (lo + hi) / 2;
      if (bez(0.45, 0.15, t) < p) lo = t;
      else hi = t;
    }
    return bez(0, 1, t);
  }

  onMount(() => {
    const d = document.documentElement;
    const el = root;
    const cv = canvas;
    const ctx = cv?.getContext('2d');
    // Without `splash-run` the gate drops the splash at 1.6 s on its own.
    if (!d.classList.contains('splash') || !el || !cv || !ctx) return;
    d.classList.add('splash-run');

    const cs = getComputedStyle(d);
    const css = (v: string, f: string) => cs.getPropertyValue(v).trim() || f;
    const theme: IntroTheme = {
      gold: toRgb(css('--color-gold', '#ffca42'), '255,202,66'),
      ground: css('--color-bg', '#0a0b0e'),
      text: css('--color-text', '#eceef2'),
      logo: null,
      logoAspect: 304 / 325,
      family: '"Clash Display", "Satoshi", system-ui, sans-serif'
    };
    const img = new Image();
    img.onload = () => (theme.logo = img);
    img.src = '/brand/logo-325.webp';
    void document.fonts?.load('600 40px "Clash Display"');

    const shot = document.getElementById('phone-shot');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let s = 0; // splash time; paused with the tab, so it never jumps ahead
    let last = 0;
    let raf = 0;
    let released = false;
    let clear = false;
    let fadeAt = 0;
    let goAt = 0;

    const release = () => {
      if (released) return;
      released = true;
      d.classList.remove('splash');
      document.dispatchEvent(new Event('hm:splash-handoff'));
    };
    const off = () => {
      removeEventListener('pointerdown', skip);
      removeEventListener('keydown', skip);
      removeEventListener('wheel', skip);
      removeEventListener('touchmove', skip);
    };
    const finish = () => {
      cancelAnimationFrame(raf);
      off();
      release();
      d.classList.remove('splash-run');
    };
    // The apps' exit: a short fade of the whole layer. Used when the visitor
    // wants in, or when the hero has nothing to hand over to.
    function skip() {
      if (!fadeAt) fadeAt = performance.now();
      release();
    }
    addEventListener('pointerdown', skip);
    addEventListener('keydown', skip);
    addEventListener('wheel', skip, { passive: true });
    addEventListener('touchmove', skip, { passive: true });

    // introCanvas.ts's resting lockup (t >= 3.2), recomputed to animate it out.
    function lockup(w: number, h: number) {
      const m = Math.min(w, h) * 0.2;
      const mw = m * theme.logoAspect;
      const fs = m * 0.62;
      const gap = m * 0.22;
      ctx!.font = `600 ${fs}px ${theme.family}`;
      ctx!.textBaseline = 'middle';
      const left = w / 2 - (mw + gap + ctx!.measureText('Hype Muzik').width) / 2;
      return { m, mw, fs, gap, left };
    }

    function handoff(k: number, w: number, h: number) {
      if (k >= RING_AT) release();
      if (d.classList.contains('intro-skip')) skip();
      if (!goAt && d.classList.contains('intro-go')) goAt = k;
      const L = lockup(w, h);

      ctx!.clearRect(0, 0, w, h);
      const ground = 1 - clamp((k - 0.05) / 0.4);
      if (ground > 0) {
        ctx!.globalAlpha = ground;
        ctx!.fillStyle = theme.ground;
        ctx!.fillRect(0, 0, w, h);
      }

      // The wordmark tucks back the way it came in.
      const word = 1 - clamp(k / 0.22);
      if (word > 0) {
        ctx!.globalAlpha = word;
        ctx!.fillStyle = theme.text;
        ctx!.fillText('Hype Muzik', L.left + L.mw + L.gap - L.m * 0.3 * (1 - word), h / 2 + L.fs * 0.04);
      }

      // The mark's disc lands on the screenshot's album art and follows it
      // live (the camera's pull-back included) while it dissolves into it, in
      // step with the phone screen fading in (0.1-0.45 s after intro-go).
      const mark = goAt ? 1 - clamp((k - goAt - 0.1) / 0.25) : 1;
      if (goAt && mark <= 0) return finish();
      const r = shot?.getBoundingClientRect();
      const e = camera(k / MOVE);
      const mw = lerp(L.mw, r?.width ? ART * MARK * r.width : L.mw, e);
      const mh = mw / theme.logoAspect;
      // Box centre: the lockup's at rest, then wherever puts the disc on the ring.
      const x = r?.width ? r.left + r.width / 2 - (DISC_X - 0.5) * mw : w / 2;
      const y = r?.width ? r.top + r.height / 2 - (DISC_Y - 0.5) * mh : h / 2;
      if (theme.logo) {
        ctx!.globalAlpha = mark;
        ctx!.drawImage(theme.logo, lerp(L.left + L.mw / 2, x, e) - mw / 2, lerp(h / 2, y, e) - mh / 2, mw, mh);
      }
      ctx!.globalAlpha = 1;
    }

    const frame = (now: number) => {
      try {
        s += last ? Math.min(0.1, (now - last) / 1000) : 0;
        last = now;
        const w = el.clientWidth;
        const h = el.clientHeight;
        if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) {
          cv.width = Math.round(w * dpr);
          cv.height = Math.round(h * dpr);
        }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        if (s < HOLD) {
          drawIntro(ctx, w, h, s, theme);
        } else {
          // From here the canvas draws (and dissolves) the ground itself.
          if (!clear) {
            clear = true;
            el.style.background = 'transparent';
            el.style.pointerEvents = 'none';
          }
          handoff(s - HOLD, w, h);
          if (!d.classList.contains('splash-run')) return;
        }
        if (fadeAt) {
          const k = (now - fadeAt) / INTRO_FADE_MS;
          el.style.opacity = String(Math.max(0, 1 - k));
          if (k >= 1) return finish();
        }
        raf = requestAnimationFrame(frame);
      } catch {
        finish();
      }
    };
    raf = requestAnimationFrame(frame);
    return finish;
  });
</script>

<div bind:this={root} class="splash" aria-hidden="true">
  <canvas bind:this={canvas}></canvas>
</div>

<style>
  /* In the prerendered page so the first paint is already the splash ground;
     shown only when the head script in app.html chose to play it. */
  .splash {
    display: none;
    position: fixed;
    inset: 0;
    z-index: 100; /* over the sticky header (z-50) */
    background: var(--color-bg);
  }
  :global(html.splash) .splash,
  :global(html.splash-run) .splash {
    display: block;
  }
  canvas {
    display: block;
    width: 100%;
    height: 100%;
  }
</style>
