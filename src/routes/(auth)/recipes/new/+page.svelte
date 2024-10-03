<script lang=ts>

	import RecipeForm from "$lib/components/ui/RecipeForm.svelte";
	import { toast } from "svelte-sonner";
	import type { PageData } from "./$types";
	import { afterNavigate, goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { base } from "$app/paths";
 
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

  let previousPage: string = base;
  afterNavigate(({ from }) => {
    previousPage = from?.url.pathname || previousPage;
  });

</script>

<div class="w-[40em] h-full">
  <RecipeForm {data} 
    onsuccess={handleFormSuccess} 
    onerror={handleFormError} 
    oncancel={handleCancel}
    actionUrl="?/create"
  />
</div>