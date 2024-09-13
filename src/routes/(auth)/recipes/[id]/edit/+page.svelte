<script lang=ts>

	import RecipeForm from "$lib/components/ui/RecipeForm.svelte";
	import { toast } from "svelte-sonner";
	import type { PageData } from "./$types";
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
 
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
</script>

<div class="w-[40em] h-full">
  <RecipeForm {data} 
    onsuccess={handleFormSuccess} 
    onerror={handleFormError} 
    oncancel={() => gotoView()}
    actionUrl="?/edit"
  />
</div>