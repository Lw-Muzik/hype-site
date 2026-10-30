<script lang="ts">
  /**
   * A real product screenshot from /static (AVIF with a WebP fallback), laid
   * out for the feature pages: a wide desktop window, or a phone screen.
   */
  let {
    kind,
    base,
    alt,
    caption = ''
  }: {
    kind: 'desktop' | 'phone';
    /** File stem, e.g. 'shots/desktop-enhancer' or 'hero/app-desktop'. */
    base: string;
    alt: string;
    caption?: string;
  } = $props();

  const desktop = $derived(kind === 'desktop');
</script>

<figure class="shot {desktop ? 'w-full max-w-[960px]' : 'w-[min(100%,260px)]'}">
  <picture>
    {#if desktop}
      <source
        type="image/avif"
        srcset="/{base}-960.avif 960w, /{base}-1440.avif 1440w"
        sizes="(min-width: 1040px) 960px, 92vw"
      />
      <img
        src="/{base}-1440.webp"
        srcset="/{base}-960.webp 960w, /{base}-1440.webp 1440w"
        sizes="(min-width: 1040px) 960px, 92vw"
        width="1440"
        height="870"
        loading="lazy"
        decoding="async"
        {alt}
        class="block h-auto w-full rounded-[14px] border border-line-2"
      />
    {:else}
      <source type="image/avif" srcset="/{base}-540.avif 540w, /{base}-1080.avif 1080w" sizes="260px" />
      <img
        src="/{base}-540.webp"
        srcset="/{base}-540.webp 540w, /{base}-1080.webp 1080w"
        sizes="260px"
        width="1080"
        height="2340"
        loading="lazy"
        decoding="async"
        {alt}
        class="block h-auto w-full rounded-[22px] border border-line-2"
      />
    {/if}
  </picture>
  {#if caption}
    <figcaption class="mt-3 text-[13.5px] leading-relaxed text-faint">{caption}</figcaption>
  {/if}
</figure>
