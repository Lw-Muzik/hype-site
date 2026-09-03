<script lang="ts">
  import { onMount } from 'svelte';

  // A live, audio-reactive-looking equalizer — the brand's signature, echoing
  // the 3-bar logo. Pure layered sines (no real audio); respects reduced motion.
  let { class: klass = '', bars = 72 }: { class?: string; bars?: number } = $props();
  let canvas: HTMLCanvasElement;

  onMount(() => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // roundRect is Safari 16.4+. This canvas is also what Scene3D falls back to
    // when WebGL is unavailable — largely the same old-Safari population — so
    // calling it blind would blank the fallback on exactly the browsers that
    // need it. An uncaught throw inside the rAF callback would also kill the
    // loop before it could reschedule.
    const hasRoundRect = typeof ctx.roundRect === 'function';

    let raf = 0;
    let w = 1;
    let h = 1;
    let onScreen = true;
    const phases = Array.from({ length: bars }, (_, i) => i * 0.55);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      w = Math.max(1, r.width);
      h = Math.max(1, r.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      // Flat accent fill — no gradient. Depth comes from bar height alone.
      ctx.fillStyle = 'rgba(255,202,66,0.9)';

      const gap = 3;
      const bw = (w - gap * (bars - 1)) / bars;
      for (let i = 0; i < bars; i++) {
        const p = phases[i];
        const a = Math.sin(t * 0.0016 + p) * 0.5 + 0.5;
        const b = Math.sin(t * 0.0041 + p * 1.7) * 0.5 + 0.5;
        const c = Math.sin(t * 0.0009 + p * 0.6) * 0.5 + 0.5;
        let v = a * 0.5 + b * 0.3 + c * 0.2;
        const center = 1 - Math.abs(i / (bars - 1) - 0.5) * 1.15;
        v *= 0.32 + 0.68 * Math.max(0, center);
        const bh = Math.max(2, v * h * 0.94);
        const x = i * (bw + gap);
        if (hasRoundRect) {
          const r = Math.min(bw / 2, 3);
          ctx.beginPath();
          ctx.roundRect(x, h - bh, bw, bh, [r, r, 0, 0]);
          ctx.fill();
        } else {
          ctx.fillRect(x, h - bh, bw, bh);
        }
      }
      // Only keep the loop alive while it is animating AND on screen. A
      // marketing page is scrolled past in seconds; rendering for the rest of
      // the visit keeps the GPU out of idle power states for nothing.
      if (!reduce && onScreen) raf = requestAnimationFrame(draw);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(draw);
    };

    let io: IntersectionObserver | undefined;
    try {
      io = new IntersectionObserver(
        ([entry]) => {
          onScreen = entry.isIntersecting;
          if (onScreen && !reduce) start();
        },
        { threshold: 0 }
      );
      io.observe(canvas);
    } catch {
      onScreen = true;
    }

    // One static frame under reduced motion; otherwise animate.
    if (reduce) draw(900);
    else start();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io?.disconnect();
    };
  });
</script>

<canvas bind:this={canvas} class={klass} aria-hidden="true"></canvas>
