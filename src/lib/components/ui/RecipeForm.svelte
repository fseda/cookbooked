<script lang=ts>
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import { Switch } from '$lib/components/ui/switch';
  import { Textarea } from '$lib/components/ui/textarea';
  import { Trash2 } from 'lucide-svelte';
  import { toast } from 'svelte-sonner';
  import { superForm } from 'sveltekit-superforms';
  import DeleteRecipeDialog from './DeleteRecipeDialog.svelte';
  
  type Props = {
    data: any,
    oncancel: Function,
    onsuccess: Function,
    onerror: Function,
    actionUrl: string,
  }
  let {
    data,
    oncancel: cancel,
    onsuccess: success,
    onerror: error,
    actionUrl,
  }: Props = $props();

  let form = superForm(data.form, {
    autoFocusOnError: true,
    invalidateAll: true,
    resetForm: true,
    onUpdated: ({ form }) => form.valid ? success() : error(),
  });
  let { form: formData, enhance: formEnhance, delayed, submitting } = $derived(form);

  const failure = (form: any) => {
    let errors: string = '';
    Object.entries(form.errors).forEach(([k, v]: [string, unknown]) => {
      errors += `${k}: ${(v as string[])[0]}; `;
    });
    error();
  }

  let dltFormBtn: HTMLButtonElement | undefined = $state();
  const deleteRecipe = () => {
    dltFormBtn?.click();
  }

  let isNew = $derived(!$page.params.id || !$formData.id);
</script>

<form 
  action={actionUrl}
  method="post"
  use:formEnhance
>
  <Form.Field {form} name="id">
    <Form.Control let:attrs>
      <Input {...attrs} type=hidden required={!isNew} value={$formData.id} />
    </Form.Control>
  </Form.Field>

  <Form.Field {form} name="title">
    <Form.Control let:attrs>
      <Form.Label>Title</Form.Label>
      <Input {...attrs} bind:value={$formData.title} class="text-md" />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Field {form} name="description">
    <Form.Control let:attrs>
      <Form.Label>Description</Form.Label>
      <Input {...attrs} bind:value={$formData.description} class="h-[3em] text-md" />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Field {form} name="body">
    <Form.Control let:attrs>
      <Form.Label>Body</Form.Label>
      <Textarea {...attrs} class="text-md" bind:value={$formData.body as string} />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Field {form} name="private">
    <Form.Control let:attrs>
      <div class="flex items-center space-x-2">
        <Switch includeInput={true} {...attrs} value={String($formData.private)} bind:checked={$formData.private} />
        <Form.Label>Private</Form.Label>
      </div>
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <div class="flex justify-between mt-4">
    <div class="flex space-x-1">
      <Form.Button loading={$delayed} disabled={$delayed}>
        Save 
      </Form.Button>
      <Form.Button type=button onclick={() => cancel()} 
        variant=outline disabled={$submitting}>Cancel</Form.Button>
    </div>
    {#if !isNew}
      <DeleteRecipeDialog deleteFunc={deleteRecipe}>
        {#snippet trigger()}
          <Form.Button type=button size=icon variant=destructive disabled={$submitting}>
            <Trash2 />
          </Form.Button>
        {/snippet}
      </DeleteRecipeDialog>
    {/if}
  </div>
</form>

{#if !isNew}
  <form action="?/delete" method=post
    use:enhance={() => {
      return async ({ update, result }) => {
        await update({ invalidateAll: false }).finally(async () => {
          switch (result.type) {
            case 'success':
              toast.success('Recipe deleted successfully!'); 
              await goto('/me/recipes');
              break;
            case 'failure':
              toast.error('An unexpected error ocurred!');
            default:
              break;
          }
        })
      }
    }}
  >
    <button type="submit" bind:this={dltFormBtn}></button>
  </form>
{/if}
