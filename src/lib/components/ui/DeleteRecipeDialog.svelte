<script lang=ts>
	import type { Snippet } from "svelte";
  import * as AlertDialog from '$lib/components/ui/alert-dialog';
  import { Button } from '$lib/components/ui/button';

  let {
    deleteFunc,
    trigger,
  }: {
    deleteFunc: Function,
    trigger: Snippet,
  } = $props();
</script>

<AlertDialog.Root closeOnOutsideClick>
  <AlertDialog.Trigger>
    {@render trigger()}
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
          <Button variant=destructive builders={[builder]} onclick={() => deleteFunc()}>Delete</Button>
        </AlertDialog.Action>
      </AlertDialog.Footer>
    </AlertDialog.Content>
  </AlertDialog.Portal>
</AlertDialog.Root>