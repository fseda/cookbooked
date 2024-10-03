<script lang=ts>
  import { Button } from '$lib/components/ui/button';
  import RecipeGrid from '$lib/components/ui/RecipeGrid.svelte';
	import { getContext } from 'svelte';

  let {
    data
  } = $props();
  let recipes = $derived(data.recipes || []);

  let pageTitle = getContext('page-title') as { value: string };
  pageTitle.value = 'My Recipes';
</script>

<div class="p-4 w-full space-y-4">
  {#if recipes.length}
    <RecipeGrid {recipes} />
  {:else if !data.isOwner}
    This user does not have public recipes.
  {/if}

  {#if data.isOwner}
    <Button href='/recipes/new'>Create a recipe</Button>
  {/if}
</div>
