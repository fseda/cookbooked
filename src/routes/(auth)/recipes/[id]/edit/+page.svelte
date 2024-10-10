<script lang=ts>

	import RecipeForm from "$lib/components/ui/RecipeForm.svelte";
	import { toast } from "svelte-sonner";
	import type { PageData } from "./$types";
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
  import * as Form from '$lib/components/ui/form';
	import H3 from "$lib/components/typography/H3.svelte";
	import { getContext, onMount } from "svelte";
 
  let {
    data
  }: {
    data: PageData,
  } = $props();

  async function handleFormSuccess() {
    toast.success('Saved!', {
      position: "top-right",
      dismissable: true
    });

    goto(`/recipes/${$page.params.id}`);
  }
  function handleFormError() {
    toast.error('An error ocurred :(', {
      position: "top-right",
      dismissable: true
    });
  }

  const gotoView = () => goto($page.url.pathname.split('/edit')[0]);

  let isNew = $derived(!$page.params.id);
  const pageTitle = getContext('page-title') as { value: string };
  onMount(() => {
    pageTitle.value = 'Edit recipe';
  });
</script>

<div class="p-2 max-w-[40em] w-full h-full space-y-2">
  <RecipeForm {data} 
    onsuccess={handleFormSuccess} 
    onerror={handleFormError} 
    oncancel={() => gotoView()}
    actionUrl="?/edit"
  />
</div>


