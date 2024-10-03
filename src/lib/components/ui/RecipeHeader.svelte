<script lang=ts>
	import { Bookmark, BookmarkCheck } from "lucide-svelte";
	import { mode } from 'mode-watcher';
	import H2 from "../typography/H2.svelte";
	import Button from "./button/button.svelte";
	import Rating from "./Rating.svelte";
  import * as Popover from '$lib/components/ui/popover';
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