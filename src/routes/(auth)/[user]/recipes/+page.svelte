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
    pageTitle.value = data.isAuthor ? 'My recipes' : `${data.recipesAuthor.username}'s recipes`;
  })
</script>

<div class="p-2 w-full max-w-[40em] space-y-4">
  {#if recipes.length}
    <RecipeGrid {recipes} />
  {:else if !data.isAuthor}
    This user does not have public recipes.
  {/if}

  {#if data.isAuthor}
    <Button href='/recipes/new'>Create a recipe</Button>
  {/if}
</div>
