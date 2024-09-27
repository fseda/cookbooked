<script lang=ts>
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
	import { getContext, onMount } from 'svelte';

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
<!-- <div class="h-full w-full"> -->

<!-- <button onclick={() => mainWrapper.toggle()}>wrapper {mainWrapper.value}</button> -->
<div class="p-4">
  {#if recipes.length}
    <div class="gap-2 grid xl:grid-cols-4 grid-cols-1 lg:grid-cols-3 md:grid-cols-2">
      {#each recipes as recipe (recipe.id)}
        <a href="/recipes/{recipe.id}">
          <Card.Root>
            <Card.Header>
              <Card.Title>
                {recipe.title}
              </Card.Title>
              <Card.Description class="truncate">{recipe.description}</Card.Description>
            </Card.Header>
          </Card.Root>
        </a>
      {/each}
    </div>
  {:else}
    {#if data.isOwner}
      <Button href='/recipes/new'>Create a recipe</Button>
    {:else}
      This user does not have public recipes.
    {/if}
  {/if}
</div>
<!-- </div> -->