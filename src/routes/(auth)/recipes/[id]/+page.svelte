<script lang=ts>
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import RecipeView from '$lib/components/ui/RecipeView.svelte';
  import { Button } from '$lib/components/ui/button';
	import { Pencil } from 'lucide-svelte';

  let {
    data
  } = $props();

  let canEdit = $derived(!data.ownerId || data.ownerId === data.user?.id);

</script>

<div class="w-[40em] h-full space-y-2">
  <RecipeView {data} />

  {#if canEdit}
    <Button variant=outline onclick={() => goto($page.url.pathname+'/edit')}><Pencil size="18px" class="mr-1" /> Edit</Button>
  {/if}
</div>