<script lang=ts>
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { superForm } from 'sveltekit-superforms';
  import * as Card from '$lib/components/ui/card';
  import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import Main from '$lib/components/ui/Main.svelte';
	import { LoaderCircle } from 'lucide-svelte';

  let {
    data
  } = $props();

  const form = superForm(data.form);
  const { form: formData, errors: formErrors } = form;

  let loading = $state(false);
</script>

<Main>
  <Card.Root class="w-[400px]">
    <Card.Header>
      <Card.Title>Confirm your email</Card.Title>
      <Card.Description>Confirm your email to sign in.</Card.Description>
    </Card.Header>
    <Card.Content>
      <form 
        action="?/set" 
        method="post"
        use:enhance={async () => {
          loading = true;
          return async ({ update, result }) => {
            await update({ reset: true, invalidateAll: false }).finally(async () => {
              if (result.type === 'success') {
                await invalidateAll();
              }

              loading = false;
            });
          }
        }}
      >
        <Form.Field {form} name=email>
          <Form.Control let:attrs>
            <Form.Label>Email</Form.Label>
            <Input {...attrs} bind:value={$formData.email} disabled={loading} />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
        <Form.Button type=submit disabled={loading}>
          {#if loading}
            <LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
          {/if}
          Confirm Email
        </Form.Button>
      </form>
    </Card.Content>
  </Card.Root>
</Main>