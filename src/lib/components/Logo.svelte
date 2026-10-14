<script lang="ts">
  // HypeMuzik brand mark — gold disc + green note. Floats on the dark UI.
  let { size = 30 }: { size?: number } = $props();

  // Artwork aspect is 304:325. Explicit width/height keep layout from shifting
  // while the image loads. Right-sized files: 64 px covers ≤32 px at 2x, 128 px
  // covers ≤64 px at 2x — the full 304×325 logo.png is never fetched here.
  const width = $derived(Math.round((size * 304) / 325));
  const webp = $derived(
    size <= 32 ? '/brand/logo-64.webp' : '/brand/logo-64.webp 1x, /brand/logo-128.webp 2x'
  );
</script>

<picture>
  <source type="image/webp" srcset={webp} />
  <img
    src="/brand/logo-128.png"
    alt=""
    aria-hidden="true"
    draggable="false"
    decoding="async"
    {width}
    height={size}
    class="block select-none"
    style="height:{size}px;width:auto"
  />
</picture>
