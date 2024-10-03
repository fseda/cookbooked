<script lang=ts>
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import { getScreen, type MediaScreen } from '$lib/mediaScreen';
	import type { Recipe } from "$lib/server/data/recipes";
	import { onMount } from 'svelte';

  let {
    recipes
  }: {
    recipes: Recipe[],
  } = $props();

  const gridBasedOnWidth: Record<MediaScreen, number> = {
    'sm': 1,
    'md': 2,
    'lg': 3,
    'xl': 3,
    '2xl': 3,
  };
  const maxRows = gridBasedOnWidth[getScreen()];
  const getColumnsLength = (maxRows: number) => {
    return recipes.length < maxRows ? recipes.length : maxRows;
  }
  let columns: () => Recipe[][] = $derived(() => {
    const c = new Array<Array<Recipe>>(getColumnsLength(maxRows));

    recipes.forEach((r, i) => {
      if (!c[i % maxRows]) {
        c[i % maxRows] = [];
      }
      c[i % maxRows].push(r);
    });

    return c;
  });
</script>

{#snippet RecipeCard(recipe: Recipe)}
  <div class="relative">
    {@render RecipeDetails(recipe)}

    <a href="/recipes/{recipe.id}" class="h-fit">
      <Card.Root class="w-full">
        <Card.Header>
          <Card.Title>
            {recipe.title}
          </Card.Title>
          <Card.Description>{recipe.description ?? recipe.title}</Card.Description>
        </Card.Header>
        <!-- <Card.Content>
          
        </Card.Content> -->
      </Card.Root>
    </a>
  </div>
{/snippet}

{#snippet RecipeDetails(recipe: Recipe)}
  <Dialog.Root>
    <Dialog.Trigger class="absolute right-3 top-1">
      <!-- <Button variant=ghost size=sm><Circle size=15/></Button> -->
      <span class="hover:underline text-muted-foreground text-sm">details</span>
    </Dialog.Trigger>
    <Dialog.Content>
      <!-- <RecipeView /> -->
    </Dialog.Content>
  </Dialog.Root>
{/snippet}

<div class="gap-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
  {#each columns() as column, i (i)}
    <div class="grid gap-2 h-fit">
      {#if column}
        {#each column as recipe (recipe.id)}
          {@render RecipeCard(recipe)}
        {/each}
      {/if}
    </div>
  {/each}
</div>


