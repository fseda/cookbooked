<script lang=ts>
  import RecipeForm from '$lib/components/RecipeForm.svelte';
	import { Button } from '$lib/components/ui/button';
  import { marked } from 'marked';
  import DOMPurify from 'dompurify';

  let {
    data,
  } = $props();

  let edit = $state(false);
  const canEdit = (): boolean => data.ownerId === data.user?.id;

  const postprocess = (html: string) => DOMPurify.sanitize(html);
  
</script>

<div class="w-[40em] h-full">
  {#if edit && canEdit()}
    <RecipeForm {data} />
  {:else}
    <div>
      {@html marked(data.form.data.body || '', { hooks: { preprocess: (markdown) => markdown, postprocess: (html) => html }})}
    </div>
  {/if}

</div>