<script lang=ts>
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import RecipeForm from '$lib/components/ui/RecipeForm.svelte';
  import RecipeView from '$lib/components/ui/RecipeView.svelte';
  import { Button } from '$lib/components/ui/button';
	import { onMount } from 'svelte';
  import { toast, } from 'svelte-sonner';

  let {
    data
  } = $props();

  let edit = $state($page.url.searchParams.get('edit') === 'true');
  const canEdit = (): boolean => !data.ownerId || data.ownerId === data.user?.id;
  async function setEdit(is: boolean) {
    edit = is;
    $page.url.searchParams.delete('edit');
    if (!edit) { 
      await goto('?');
    } else {
      await goto(`?edit=true`);
    };
  }
  onMount(() => {
    if (!$page.params.id) {
      setEdit(true);
    }
  })
  
  async function handleFormSuccess(e: CustomEvent) {
    await setEdit(false);
    toast.success('Saved!', {
      position: "top-right",
      dismissable: true
    });
  }
  function handleFormError(e: CustomEvent) {
    toast.error(e.detail, {
      position: "top-right",
      dismissable: true
    });
  }
</script>

<div class="w-[40em] h-full">
  {#if edit && canEdit()}
    <RecipeForm {data} 
      onsuccess={handleFormSuccess} 
      onerror={handleFormError} 
      oncancel={() => setEdit(false)}
    />
  {:else}
    <RecipeView {data}  />
  {/if}

  {#if !edit && canEdit()}
    <Button variant=outline onclick={() => setEdit(true)}>Edit</Button>
  {/if}
</div>