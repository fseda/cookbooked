<script lang=ts>
	import { enhance } from "$app/forms";

	import { BookmarkCheck, Bookmark } from "lucide-svelte";
	import { toast } from "svelte-sonner";

  let {
    actionUrl = '?/bookmark',
    bookmarked,
    amount,
    recipeId,
    recipeTitle,
  }: {
    actionUrl?: string,
    bookmarked: boolean,
    amount: number,
    recipeId?: string,
    recipeTitle?: string,
  } = $props();

  const updateDisplay = (isBookmarked: boolean) => {
    bookmarked = isBookmarked;
    amount = bookmarked ? amount + 1 : amount - 1;
    if (amount < 0) amount = 0;
  }

</script>

<form action={actionUrl} method=post use:enhance={() => {
  return async ({ update, result }) => {
    await update({ invalidateAll: false }).finally(async () => {   
      switch (result.type) {
        case 'success':          
          updateDisplay(result.data!.bookmarked as boolean);

          toast.info(result.data?.bookmarked ? `Bookmarked: ${recipeTitle}` : 'Bookmark removed!'); 
          break;
        case 'failure':
          const message = (result.data?.message as string) || 'An unexpected error ocurred!';
          toast.error(message);
        default:
          break;
      }
    })
  }
}}>
  <input hidden value={recipeId} name="id" />
  <button class="flex flex-row" type=submit>
    {#if bookmarked}
      <BookmarkCheck />
    {:else}
      <Bookmark />
    {/if}
    {amount}
  </button>
</form>