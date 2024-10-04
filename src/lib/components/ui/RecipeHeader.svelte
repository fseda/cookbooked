<script lang=ts>
	import type { Snippet } from "svelte";

  let {
    title,
    rating,
    bookmark,
  }: {
    title: Snippet,
    rating: Snippet,
    bookmark: Snippet,
  } = $props();
</script>

<div class="flex flex-row justify-between border-b">
  {@render title()}
  
  <div class="flex flex-row gap-1 items-center">
    {@render rating()}
    {@render bookmark()}
  </div>
</div>