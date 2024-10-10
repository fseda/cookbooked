<script lang=ts>
  import RecipeGrid from '$lib/components/ui/RecipeGrid.svelte';
  import { getContext, onMount } from 'svelte';

  let {
    data
  } = $props();
  let recipes = $derived(data.recipes || []);

  const pageTitle = getContext('page-title') as { value: string };
  onMount(() => {
    pageTitle.value = 'Bookmarks';
  });
  
</script>

<div class="p-2 w-full md:max-w-[40rem] space-y-2">
  {#if recipes.length}
    <RecipeGrid {recipes} />
  {:else}
    You have no bookmarks
  {/if}
</div>
