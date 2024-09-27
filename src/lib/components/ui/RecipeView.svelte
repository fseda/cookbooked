<script lang=ts>
	import { enhance } from '$app/forms';
	import DOMPurify from "dompurify";
	import { marked } from "marked";
	import type { PageData } from "../../../routes/(auth)/recipes/[id]/$types";
	import RecipeHeader from '../RecipeHeader.svelte';

  let {
    data
  }: {
    data: PageData
  } = $props();

  const postprocess = (html: string) => DOMPurify.sanitize(html);
  let body: string | undefined = $state();
  $effect(() => {
    // (marked(data.form.data.body || '') as Promise<string>).then(s => body = s)
    body = marked(recipe.body || '', { async: false });
  });

  let recipe = $derived(data.recipe);

  let bookmarkBtn: HTMLButtonElement | undefined = $state();
  const toggleBookmark = async () => {
    bookmarkBtn?.click();
  }

  let rating = $derived(() => recipe.ratings.reduce((p, c) => p + c.rating, 0));

  const ownerUsername = data.recipe.user?.username || 'NO USERNAME';

</script>

<!-- <div class="grid grid-cols-12 md:space-x-3 max-md:space-y-3"> -->
  <article class="space-y-2 w-100 col-span-8 col-span-12 md:col-span-8">
    <RecipeHeader title={recipe.title} 
      ratingsAmount={recipe.ratings.length} rating={rating()} userRating={data.yourRating}
      bookmarksAmount={recipe.bookmarks.length} 
      bookmarked={data.bookmarked} bookmarkAction={toggleBookmark} />

    {#if recipe.description}
      <p>{recipe.description}</p>
    {/if}
    {@html body}
  </article>
  
<!-- </div> -->

<div hidden>
  <form action="?/bookmark" method=post use:enhance>
    <button type=submit bind:this={bookmarkBtn}></button>
  </form>
</div>



