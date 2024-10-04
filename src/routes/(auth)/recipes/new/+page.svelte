<script lang=ts>

	import RecipeForm from "$lib/components/ui/RecipeForm.svelte";
	import { toast } from "svelte-sonner";
	import type { PageData } from "./$types";
	import { afterNavigate, goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { base } from "$app/paths";
	import { getContext, onMount } from "svelte";
	import H3 from "$lib/components/typography/H3.svelte";
 
  let {
    data
  }: {
    data: PageData,
  } = $props();

  const handleFormSuccess = async () => {
    toast.success('Saved!', {
      position: "top-right",
      dismissable: true
    });
    
    goto(`/recipes/${$page.form.recipe.id}`);
  }
  const handleFormError = () => {
    toast.error($page.form.error || 'Error', {
      position: "top-right",
      dismissable: true
    });
  }
  const handleCancel = () => goto(previousPage);

  let previousPage: string = '/';
  afterNavigate(({ from, to }) => {
    previousPage = from?.url.pathname || previousPage;   
  });

  const pageTitle = getContext('page-title') as { value: string };
  onMount(() => {
    pageTitle.value = 'Create a new recipe';
  });

</script>

<div class="p-2 max-w-[40em] w-full h-full space-y-2">
  <RecipeForm {data} 
    onsuccess={handleFormSuccess} 
    onerror={handleFormError} 
    oncancel={handleCancel}
    actionUrl="?/create"
  />
</div>