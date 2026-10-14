<script lang="ts">
  import { reveal } from '$lib/actions';
</script>

<!-- Section-hero window: scales 0.92 -> 1 and fades in as it enters the viewport. -->
<div class="showcase mx-auto mt-12 w-full max-w-[1040px]" use:reveal>
  <div class="win">
    <div class="frame" aria-hidden="true">
      <div class="titlebar">
        <span class="dot" style="background:#e5564b"></span>
        <span class="dot" style="background:#efab3c"></span>
        <span class="dot" style="background:#34c13a"></span>
        <b class="title">HypeMuzik — Enhancer</b>
      </div>
    </div>
    <div class="spacer"></div>
    <picture>
      <source
        type="image/avif"
        srcset="/shots/desktop-enhancer-960.avif 960w, /shots/desktop-enhancer-1440.avif 1440w, /shots/desktop-enhancer-2160.avif 2160w"
        sizes="(min-width: 1104px) 1040px, 92vw"
      />
      <img
        src="/shots/desktop-enhancer-1440.webp"
        srcset="/shots/desktop-enhancer-960.webp 960w, /shots/desktop-enhancer-1440.webp 1440w, /shots/desktop-enhancer-2160.webp 2160w"
        sizes="(min-width: 1104px) 1040px, 92vw"
        width="1440"
        height="870"
        loading="lazy"
        decoding="async"
        alt="HypeMuzik desktop — Enhancer: the effects chain with live toggles, beside synced lyrics"
      />
    </picture>
  </div>
</div>

<style>
  .win {
    position: relative;
    padding: 1px;
    container-type: inline-size;
    --tb: max(26px, 3.6cqw);
  }
  .frame {
    position: absolute;
    inset: 0;
    background: var(--color-surface-1);
    border: 1px solid var(--color-line);
    border-radius: 18px;
    box-shadow: 0 40px 80px -30px rgba(0, 0, 0, 0.8);
  }
  .titlebar {
    display: flex;
    align-items: center;
    gap: 7px;
    height: var(--tb);
    padding-left: 14px;
    border-bottom: 1px solid var(--color-line);
    background: rgba(255, 255, 255, 0.02);
    border-radius: 17px 17px 0 0;
  }
  .dot {
    width: 11px;
    height: 11px;
    border-radius: 50%;
  }
  .title {
    margin-left: 6px;
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 400;
    color: var(--color-faint);
  }
  .spacer {
    height: var(--tb);
  }
  img {
    position: relative;
    display: block;
    width: 100%;
    height: auto;
    border-radius: 0 0 17px 17px;
  }
  @media (max-width: 520px) {
    .win { --tb: 26px; }
    .title { font-size: 10px; }
    .dot { width: 8px; height: 8px; }
  }

  /* scroll-linked entrance; compositor-only, static without JS / reduced motion */
  :global(html.js) .showcase {
    opacity: 0;
    transform: scale(0.92);
    transition:
      opacity 0.9s var(--ease-out-cubic),
      transform 0.9s var(--ease-out-cubic);
  }
  :global(html.js) .showcase:global(.in) {
    opacity: 1;
    transform: none;
  }
  @media (prefers-reduced-motion: reduce) {
    :global(html.js) .showcase {
      opacity: 1;
      transform: none;
    }
  }
</style>
