<script>
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { superForm } from 'sveltekit-superforms';

  export let data;

  const { form } = superForm(data.form);
</script>

<form action=?/set method='post' 
  use:enhance={async () => {
    return async ({ update, result }) => {
      await update({ invalidateAll: false }).finally(async () => {
        if (result.type === 'success') {
          await invalidateAll();
        }
      });
    }
  }}
>
  <input type=email name=email placeholder=Email bind:value={$form.email}>
  <button type=submit>Confirm email</button>
</form>
