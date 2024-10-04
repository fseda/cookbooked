<script lang=ts>
  import { page } from '$app/stores';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import { Switch } from '$lib/components/ui/switch';
  import { Textarea } from '$lib/components/ui/textarea';
  import { Trash2 } from 'lucide-svelte';
  import { superForm } from 'sveltekit-superforms';
  import * as AlertDialog from '$lib/components/ui/alert-dialog';
  import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
  import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';
  
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

  let dltDialogOpen: boolean = $state(false);
  let dltFormBtn: HTMLButtonElement | undefined = $state();
  const deleteRecipe = () => {
    dltFormBtn?.click();
  }

  let isNew = $derived(!$page.params.id);
</script>

<form 
  action={actionUrl}
  method="post"
  use:formEnhance
>
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
      <div>
        <AlertDialog.Root closeOnOutsideClick bind:open={dltDialogOpen}>
          <AlertDialog.Trigger>
            <Form.Button type=button size=icon 
            variant=destructive disabled={$submitting}><Trash2 /></Form.Button>
          </AlertDialog.Trigger>
          <AlertDialog.Portal>
            <AlertDialog.Content>
              <AlertDialog.Header>
                <AlertDialog.Title>Are you sure you want to delete?</AlertDialog.Title>
                <AlertDialog.Description>
                  This action cannot be undone. This will permanently delete this recipe.
                </AlertDialog.Description>
              </AlertDialog.Header>
              <AlertDialog.Footer>
                <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
                <AlertDialog.Action asChild let:builder class=outline>
                  <Button variant=destructive builders={[builder]} onclick={deleteRecipe}>Delete</Button>
                </AlertDialog.Action>
              </AlertDialog.Footer>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>
      </div>
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
              toast.success('Recipe deleted successfully!', { position: 'top-right' }); 
              await goto('/me/recipes');
              break;
            case 'failure':
              toast.error('An unexpected error ocurred!', { position: 'top-right' });
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


