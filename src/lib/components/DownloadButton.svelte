<script lang="ts">
  import { formatSize, type PlatformDownload } from '$lib/releases';

  type Props = {
    /** Platform name on the pill. */
    label: string;
    /** Where the button points until the release resolves (or if it never does). */
    fallbackUrl: string;
    /** Resolved release data; `null` while loading or when the lookup failed. */
    platform?: PlatformDownload | null;
    children: import('svelte').Snippet;
  };

  let { label, fallbackUrl, platform = null, children }: Props = $props();

  const href = $derived(platform?.primary.url ?? fallbackUrl);
  // A menu only earns its place when there is a real choice to make: Linux
  // (AppImage/deb/rpm), Windows (.exe/.msi), and macOS only if the dmg is ever
  // split per-architecture.
  const options = $derived(platform?.options ?? []);
  const hasMenu = $derived(options.length > 1);

  let open = $state(false);
  let root: HTMLDivElement;

  function close() {
    open = false;
  }

  // Escape closes from anywhere; a click outside closes without swallowing the
  // click, so the menu never traps the page.
  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && open) {
      close();
      (root.querySelector('[aria-haspopup]') as HTMLElement | null)?.focus();
    }
  }

  function onPointerdown(e: PointerEvent) {
    if (open && !root.contains(e.target as Node)) close();
  }
</script>

<svelte:window on:keydown={onKeydown} on:pointerdown={onPointerdown} />

<div class="relative" bind:this={root}>
  <div
    class="group inline-flex items-stretch overflow-hidden rounded-full text-bg transition
           hover:-translate-y-0.5"
    style="background-image: linear-gradient(110deg, var(--color-gold), #b9c93a 46%, var(--color-green));
           box-shadow: 0 6px 24px -8px rgba(255, 202, 66, 0.5);"
  >
    <a
      {href}
      rel="noopener"
      class="inline-flex items-center gap-2 whitespace-nowrap py-[13px] text-[15px] font-bold
             {hasMenu ? 'pl-[22px] pr-4' : 'px-[22px]'}"
    >
      {@render children()}
      {label}
    </a>

    {#if hasMenu}
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Choose a {label} package"
        class="flex items-center border-l border-black/20 px-3 transition hover:bg-black/10"
        onclick={() => (open = !open)}
      >
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          aria-hidden="true"
          class="transition-transform duration-200 {open ? 'rotate-180' : ''}"
        >
          <path fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" d="M6 9l6 6 6-6" />
        </svg>
      </button>
    {/if}
  </div>

  {#if hasMenu && open}
    <div
      role="menu"
      aria-label="{label} packages"
      class="absolute left-1/2 top-[calc(100%+10px)] z-20 w-[268px] -translate-x-1/2 overflow-hidden
             rounded-2xl border border-line-2 bg-surface-1 p-1.5 text-left shadow-2xl shadow-black/60"
    >
      {#each options as option (option.url)}
        <a
          role="menuitem"
          href={option.url}
          rel="noopener"
          onclick={close}
          class="flex items-center justify-between gap-4 rounded-xl px-3.5 py-2.5 transition
                 hover:bg-white/[0.06] focus-visible:bg-white/[0.06]"
        >
          <span class="text-[14.5px] font-semibold text-text">{option.label}</span>
          <span class="font-mono text-[12px] text-faint">{formatSize(option.size)}</span>
        </a>
      {/each}
    </div>
  {/if}
</div>
