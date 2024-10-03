<script lang=ts>
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
	import RecipeGrid from '$lib/components/ui/RecipeGrid.svelte';
	import type { isOwner, Recipe } from '$lib/server/data/recipes';

  let {
    data
  } = $props();
  let recipes = $derived(data.recipes || []);

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
