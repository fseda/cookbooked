<script>

	import { enhance } from "$app/forms";

</script>

<form 
  action="/auth/email?/send" 
  method="post"
  use:enhance={async () => {
    return async ({ update, result, action }) => {
      await update({ reset: true, invalidateAll: false }).finally(() => {
        if (result.type === 'success') {
          alert(`Link sent to ${result.data.email}`);
        }
      });
    }
  }}
>
  <input type="email" name="email" placeholder="Email" required>
  <button type="submit">Get link</button>
</form>
