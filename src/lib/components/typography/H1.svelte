<script lang=ts>
	import type { Snippet } from "svelte";

  let {
    children,
    class: clazz
  }: {
    children: Snippet<[]>,
    class?: string,
  } = $props();
</script>

<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl {clazz}">
  {@render children()}
</h1>