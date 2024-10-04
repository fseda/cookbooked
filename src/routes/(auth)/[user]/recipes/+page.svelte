<script lang=ts>
  import { Button } from '$lib/components/ui/button';
  import RecipeGrid from '$lib/components/ui/RecipeGrid.svelte';
	import { getContext, onMount } from 'svelte';

  let {
    data
  } = $props();
  let recipes = $derived(data.recipes || []);

  let pageTitle = getContext('page-title') as { value: string };
  $effect(() => {
    pageTitle.value = data.isOwner ? 'My recipes' : `${data.recipesOwner.username}'s recipes`;
  })
</script>

<div class="p-4 max-w-[40em] space-y-4">
  {#if recipes.length}
    <RecipeGrid {recipes} />
  {:else if !data.isOwner}
    This user does not have public recipes.
  {/if}

  {#if data.isOwner}
    <Button href='/recipes/new'>Create a recipe</Button>
  {/if}
</div>
