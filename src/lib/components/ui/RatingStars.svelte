<script lang=ts>
	import { Star, StarHalf } from "lucide-svelte";

  let {
    rating,
    maxRating,
  }: {
    rating: number,
    maxRating: number,
  } = $props();

  let fulls: number = $state(0);
  let half: number = $state(0);
  $effect(() => {
    if (rating > maxRating) {
      rating = maxRating;
    }

    fulls = Math.trunc(rating);
    half = Number((rating - fulls).toFixed(1));
  });
</script>

<div class="relative">
  <div class="flex gap-0">
    {#each { length: maxRating } as _, s}
      <Star size=20 strokeWidth=1.5 />
    {/each}
  </div>
  <div class="absolute flex gap-0 top-0">
    {#each { length: fulls } as _, f}
      <Star size=20 strokeWidth=1.5 fill=gold />
    {/each}
    {#if half && half > 0}
      <StarHalf size=20 strokeWidth=1.5 fill=gold />
    {/if}
  </div>
</div>