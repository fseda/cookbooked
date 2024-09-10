<script lang=ts>
  import * as Form from '$lib/components/ui/form';
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from '../../routes/(auth)/recipes/[[id]]/$types';
  import { Input } from '$lib/components/ui/input';
  import { Textarea } from '$lib/components/ui/textarea';
  import { Switch } from '$lib/components/ui/switch';
  
  type Props = {
    data: PageData
  }
  let {
    data,
  }: Props = $props();

  const form = superForm(data.form, {
    autoFocusOnError: true,
    applyAction: true,
    invalidateAll: true,
    onError: 'apply',
  });
  const { form: formData, enhance } = form;


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

      <Form.Button>Save</Form.Button>
    </form>