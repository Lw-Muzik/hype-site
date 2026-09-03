<script lang="ts">
  import '../app.css';
  import { afterNavigate } from '$app/navigation';
  import { recordVisit } from '$lib/beacon';

  let { children } = $props();

  // Fires on the initial load and after every client-side navigation.
  afterNavigate((nav) => recordVisit(nav.to?.url.pathname ?? '/'));
</script>

{@render children()}
