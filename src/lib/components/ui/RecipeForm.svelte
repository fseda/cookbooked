<script lang=ts>
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import { Switch } from '$lib/components/ui/switch';
  import { Textarea } from '$lib/components/ui/textarea';
  import { createEventDispatcher } from 'svelte';
  import { superForm } from 'sveltekit-superforms';
  import type { PageData } from '../../../routes/(auth)/recipes/[[id]]/$types';
  
  type Props = {
    data: PageData,
    oncancel: Function,
    onsuccess: Function,
    onerror: Function,
  }
  let {
    data,
    oncancel: cancel,
    onsuccess: success,
    onerror: error,
  }: Props = $props();

  let form = superForm(data.form, {
    autoFocusOnError: true,
    invalidateAll: true,
    resetForm: true,
    onUpdated: ({ form }) => form.valid ? success() : error(),
  });
  let { form: formData, enhance, delayed, submitting } = $derived(form);

  const failure = (form: any) => {
    let errors: string = '';
    Object.entries(form.errors).forEach(([k, v]: [string, unknown]) => {
      errors += `${k}: ${(v as string[])[0]}; `;
    });
    error();
  }
</script>

<form 
  action="?/create"
  method="post"
  use:enhance
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
      <Input {...attrs} bind:value={$formData.description} class="h-[4em] text-md" />
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

  <div class="flex space-x-1">
    <Form.Button loading={$delayed} disabled={$delayed}>
      Save 
    </Form.Button>
    <Form.Button type=button onclick={() => cancel()} 
      variant=destructive disabled={$submitting}>Cancel</Form.Button>
  </div>
</form>