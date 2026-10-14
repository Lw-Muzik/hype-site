<script lang="ts">
  import { reveal } from '$lib/actions';

  // Defaults render the #desktop Enhancer window. Pass `url` for a browser
  // frame (centred URL pill instead of a mono app title).
  let {
    base = 'desktop-enhancer',
    title = 'HypeMuzik — Enhancer',
    url = '',
    height = 870,
    alt = 'HypeMuzik desktop — Enhancer: the effects chain with live toggles, beside synced lyrics'
  }: { base?: string; title?: string; url?: string; height?: number; alt?: string } = $props();
</script>

<!-- Section-hero window: scales 0.92 -> 1 and fades in as it enters the viewport. -->
<div class="showcase mx-auto mt-12 w-full max-w-[1040px]" use:reveal>
  <div class="win">
    <div class="frame" aria-hidden="true">
      <div class="titlebar">
        <span class="dot" style="background:#e5564b"></span>
        <span class="dot" style="background:#efab3c"></span>
        <span class="dot" style="background:#34c13a"></span>
        {#if url}
          <span class="urlpill">
            <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
            {url}
          </span>
        {:else}
          <b class="title">{title}</b>
        {/if}
      </div>
    </div>
    <div class="spacer"></div>
    <picture>
      <source
        type="image/avif"
        srcset="/shots/{base}-960.avif 960w, /shots/{base}-1440.avif 1440w, /shots/{base}-2160.avif 2160w"
        sizes="(min-width: 1104px) 1040px, 92vw"
      />
      <img
        src="/shots/{base}-1440.webp"
        srcset="/shots/{base}-960.webp 960w, /shots/{base}-1440.webp 1440w, /shots/{base}-2160.webp 2160w"
        sizes="(min-width: 1104px) 1040px, 92vw"
        width="1440"
        {height}
        loading="lazy"
        decoding="async"
        {alt}
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
  .urlpill {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 3px 14px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.05);
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--color-muted);
  }
  .titlebar { position: relative; }
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
    .urlpill { font-size: 10px; padding: 2px 10px; }
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
