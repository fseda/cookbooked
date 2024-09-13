<script lang=ts>
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import RecipeView from '$lib/components/ui/RecipeView.svelte';
  import { Button } from '$lib/components/ui/button';

  let {
    data
  } = $props();

  const canEdit = (): boolean => !data.ownerId || data.ownerId === data.user?.id;
  const gotoEdit = () => goto($page.url.pathname+'/edit')
</script>

<div class="w-[40em] h-full">
  <RecipeView {data} />

  {#if canEdit()}
    <Button variant=outline onclick={() => gotoEdit()}>Edit</Button>
  {/if}
</div>