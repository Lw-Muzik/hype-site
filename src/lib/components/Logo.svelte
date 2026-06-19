<script lang="ts">
  // HypeMuzik brand mark — gold disc + green note. Floats on the dark UI.
  let { size = 30 }: { size?: number } = $props();
</script>

<img
  src="/logo.png"
  alt=""
  aria-hidden="true"
  draggable="false"
  class="block select-none"
  style="height:{size}px;width:auto"
/>
