<script lang=ts>

	import { applyAction, enhance } from "$app/forms";
	import SuperDebug, { superForm } from "sveltekit-superforms";
	import type { PageData } from "./$types";

  export let data: PageData;

  const { form } = superForm(data.form);
</script>

<SuperDebug data={$form} collapsible />

<div>
  <p class="">A;SDFAHFJKHAFHJOIWUHFGJAF</p>
</div>

<form 
  action="/auth/email?/send" 
  method="post"
  use:enhance={async () => {
    return async ({ update, result }) => {
      applyAction(result);

      await update({ reset: true, invalidateAll: false }).finally(() => {
        if (result.type === 'success') {
          alert(`Link sent to ${result.data?.form?.data.email}`);
        }
      });
    }
  }}
>
  <input type="email" name="email" placeholder="Email" bind:value={$form.email}>
  <button type="submit">Get link</button>
</form>
