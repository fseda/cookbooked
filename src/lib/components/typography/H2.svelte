<script lang=ts>
	import type { Snippet } from "svelte";

  let {
    children,
    hasDividor = true,
    class: clazz,
  }: {
    children: Snippet<[]>,
    hasDividor?: boolean,
    class?: string,
  } = $props();
</script>

<h2
  class="mt-10 scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 {clazz}"
>
  {@render children()}
</h2>