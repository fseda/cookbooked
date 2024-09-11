<script lang=ts>
	import type { Snippet } from "svelte";

  let {
    children,
    hasDividor = true,
  }: {
    children: Snippet<[]>,
    hasDividor?: boolean
  } = $props();
</script>

<h2
  class="mt-10 scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0" class:border-b={hasDividor}
>
  {@render children()}
</h2>