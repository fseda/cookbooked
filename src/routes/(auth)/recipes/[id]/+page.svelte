<script lang=ts>
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import RecipeView from '$lib/components/ui/RecipeView.svelte';
  import { Button } from '$lib/components/ui/button';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { Pencil } from 'lucide-svelte';

  let {
    data
  } = $props();

  let canEdit = $derived(data.authorId === data.user?.id);

</script>

<div class="max-w-[40em] w-full h-full space-y-4">
  <RecipeView {data} />

  <Separator />

  {#if canEdit}
    <Button variant=outline onclick={() => goto($page.url.pathname+'/edit')}><Pencil size="18px" class="mr-1" /> Edit</Button>
  {/if}
</div>