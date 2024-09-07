<script lang=ts>

	import { superForm } from "sveltekit-superforms";
	import type { PageData } from "./$types";
	import Main from "$lib/components/ui/Main.svelte";
	import * as Card from "$lib/components/ui/card";
	import { applyAction, enhance } from "$app/forms";
  import * as Form from '$lib/components/ui/form/';
	import { Input } from "$lib/components/ui/input";
	import Theme from "$lib/components/ui/Theme.svelte";
	import { LoaderCircle } from "lucide-svelte";

  export let data: PageData;

  const form = superForm(data.form);
  const { form: formData, errors: formErrors } = form;

  let sent = false;
  let email = '';
  let loading = false;

</script>

<Main>
  {#if !sent}
    <Card.Root class="w-[400px]">
      <Card.Header>
        <Card.Title>Sign In</Card.Title>
        <Card.Description>Sign in to the app with your email</Card.Description>
      </Card.Header>
      <Card.Content>
        <form 
          action="/auth/email?/send" 
          method="post"
          use:enhance={async () => {
            loading = true;
            return async ({ update, result }) => {
              applyAction(result);
              $formErrors = result.data?.form?.errors;

              await update({ reset: true, invalidateAll: false }).finally(() => {
                if (result.type === 'success') {
                  sent = true;
                  email = result.data?.form?.data?.email;
                }

                loading = false;
              });
            }
          }}
        >
          <Form.Field {form} name=email>
            <Form.Control let:attrs>
              <Form.Label>Email</Form.Label>
              <Input {...attrs} bind:value={$formData.email} placeholder="Your email" disabled={loading} />
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>
          <Form.Button type=submit disabled={loading} class="mt-2">
            {#if loading}
              <LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
            {/if}
            Get link
          </Form.Button>
        </form>
      </Card.Content>
    </Card.Root>
  {:else}
    <Card.Root class="w-[400px]">
      <Card.Header>
        <Card.Title>Success!</Card.Title>
        <Card.Description>
          <span class="text-sm dark:text-gray-300 text-gray-500">An email was successfully sent to <p class="font-bold">{email}</p></span>
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <p class="text-gray-500 dark:text-gray-300">Check your email to sign in.</p>
      </Card.Content>
    </Card.Root>
  {/if}
</Main>
