<script lang=ts>
  import { Star } from 'lucide-svelte';
  import RatingStars from './RatingStars.svelte';
	
  let {
    rating = 0,
    maxRating = 5,
    amount = 0,
    adapt = false
  }: {
    rating: number,
    maxRating?: number,
    amount: number,
    adapt?: boolean,
  } = $props();
</script>

{#snippet FullRatings()}
  <RatingStars {rating} {maxRating} />
  <p class='text-center text-sm font-semibold ml-1'>
    {#if amount > 0}
      {amount} {amount === 1 ? 'rating' : 'ratings'}
    {:else}
      No ratings
    {/if}
  </p>
{/snippet}

{#if adapt}
  <div class="hidden sm:flex flex-row items-center">
    {@render FullRatings()}
  </div>

  <div class="flex sm:hidden items-center">
    <Star size=20 strokeWidth=1.5 fill={amount > 0 ? 'gold' : ''} />
    <p class='text-center text-sm font-semibold ml-1'>
      {#if amount > 0}
        {rating.toFixed(1)}
      {/if}
    </p>
  </div>
{:else}
  <div class="flex flex-row items-center">
    {@render FullRatings()}
  </div>
{/if}
