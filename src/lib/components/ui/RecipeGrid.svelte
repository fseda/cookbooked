<script lang=ts>
	import * as Card from '$lib/components/ui/card';
	import * as ContextMenu from "$lib/components/ui/context-menu";
	import * as Dialog from '$lib/components/ui/dialog';
	import { getScreen, type MediaScreen } from '$lib/mediaScreen';
	import type { RecipeComplete as Recipe } from "$lib/server/data/recipes";
	import type { User } from 'lucia';
	import { Trash } from 'lucide-svelte';
	import { getContext } from 'svelte';
	import RecipeBookmark from './RecipeBookmark.svelte';

  let {
    recipes
  }: {
    recipes: Recipe[],
  } = $props();

  const user = getContext('user') as User;

  const gridBasedOnWidth: Record<MediaScreen, number> = {
    'sm': 1,
    'md': 2,
    'lg': 2,
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
    <!-- {@render RecipeDetails(recipe)} -->

    <Card.Root class="w-full">
      <a href="/recipes/{recipe.id}" class="h-fit">
        <Card.Header class="p-4">
          <Card.Title>
            {recipe.title}
          </Card.Title>
          <Card.Description>{recipe.description ?? recipe.title}</Card.Description>
        </Card.Header>
        <!-- <Card.Content>
          
        </Card.Content> -->
      </a>
      <Card.Footer class="p-2">
        <div class="flex flex-row">
          <RecipeBookmark actionUrl='/recipes/{recipe.id}?/bookmark' 
            recipeTitle={recipe.title} bookmarked={!!recipe.bookmarked} amount={recipe.bookmarkAmount!} />
        </div> 
      </Card.Footer>
    </Card.Root>
  </div>
{/snippet}

{#snippet RecipeCardWithContext(recipe: Recipe)}
  <ContextMenu.Root>
    <ContextMenu.Trigger>
      {@render RecipeCard(recipe)}
    </ContextMenu.Trigger>
    <ContextMenu.Content>
      <ContextMenu.Item class="flex justify-between">Delete <Trash size=15 /></ContextMenu.Item>
    </ContextMenu.Content>
  </ContextMenu.Root>
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

<div class="gap-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
  {#each columns() as column, i (i)}
    <div class="grid gap-2 h-fit">
      {#each column as recipe (recipe.id)}
        {#if recipe.authorId === user?.id}
          {@render RecipeCardWithContext(recipe)}
        {:else}
          {@render RecipeCard(recipe)}
        {/if}
      {/each}
    </div>
  {/each}
</div>
