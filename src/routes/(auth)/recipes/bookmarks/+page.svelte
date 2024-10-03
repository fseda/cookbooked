<script lang=ts>
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
	import RecipeGrid from '$lib/components/ui/RecipeGrid.svelte';

  let {
    data
  } = $props();
  let recipes = $derived(data.recipes || []);

  const getRecipeGridClass = (): string => {
    // `grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-2`
    const size = recipes.length;
    
    let classText = `gap-2 grid xl:grid-cols-${size} grid-cols-1`;
    if (size > 1) {
      classText += ` lg:grid-cols-${size-1}`;
    }
    if (size > 2) {
      classText += ` md:grid-cols-${size-2}`;
    }

    return classText;
  }

  
</script>

<div class="p-4 w-full space-y-2">
  {#if recipes.length}
    <RecipeGrid {recipes} />
  {:else}
    You have no bookmarks
  {/if}
</div>
