<script lang=ts>
	import type { Snippet } from "svelte";

  let {
    children,
    class: clazz,
  }: {
    children: Snippet<[]>,
    class?: string,
  } = $props();
</script>

<h3 class="scroll-m-20 text-2xl font-semibold tracking-tight {clazz}">
  {@render children()}
</h3>