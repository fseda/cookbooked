<script lang=ts>
	import { Bookmark, Check } from "lucide-svelte";
	import { mode } from 'mode-watcher';
	import H2 from "./typography/H2.svelte";
	import Button from "./ui/button/button.svelte";
	import Rating from "./ui/Rating.svelte";
  import * as Popover from '$lib/components/ui/popover';

  let {
    title,
    bookmarksAmount,
    bookmarked,
    bookmarkAction,
    rating,
    ratingsAmount,
    userRating,
  }: {
    title: string,
    bookmarksAmount: number,
    bookmarked: boolean,
    bookmarkAction: Function,
    rating: number,
    ratingsAmount: number,
    userRating?: number,
  } = $props();

  let bookmarkFill = $derived(() => {
    if (bookmarked) 
      return $mode === 'light' ? 'black' : 'white';

    return $mode === 'light' ? 'white' : 'black' ;
  });

  let displayRating = $derived(() => {
    return userRating ?? rating;
  })
</script>

<div class="flex flex-row justify-between border-b">
  <H2>
    {title}
  </H2>
  
  <div class="flex flex-row items-center">
    <Popover.Root>
      <Popover.Trigger>
        <Rating amount={ratingsAmount} rating={displayRating()}></Rating>
      </Popover.Trigger>
      <Popover.Content>
        <Rating amount={ratingsAmount} rating={displayRating()}></Rating>

      </Popover.Content>
    </Popover.Root>

    <button class="flex flex-row p-2" onclick={() => bookmarkAction()}>
      <div class="relative">
        <Bookmark fill={bookmarkFill()} />
        {#if bookmarked}
          <Check class="absolute top-1.5 left-1.5" strokeWidth=5 size=10 color={$mode === 'light' ? 'white' : 'black'} />
        {/if}
      </div>
      {bookmarksAmount}
    </button>
  </div>
</div>