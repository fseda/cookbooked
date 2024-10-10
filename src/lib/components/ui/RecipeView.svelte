<script lang=ts>
	import { enhance } from '$app/forms';
	import * as Popover from '$lib/components/ui/popover';
	import dayjs from 'dayjs';
	import DOMPurify from "dompurify";
	import { Bookmark, BookmarkCheck, Copy, CopyCheck } from 'lucide-svelte';
	import { marked } from "marked";
	import type { PageData } from "../../../routes/(auth)/recipes/[id]/$types";
	import RecipeHeader from './RecipeHeader.svelte';
	import H3 from '../typography/H3.svelte';
	import Rating from './Rating.svelte';
	import { toast } from 'svelte-sonner';
  import { Button } from '$lib/components/ui/button';
	import RecipeBookmark from './RecipeBookmark.svelte';

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

  let displayRating = $derived(() => {
    return data.yourRating ?? recipe.ratings.reduce((p, c) => p + c.rating, 0);
  });

  const authorUsername = data.recipe.user?.username || 'NO USERNAME';

  let copied = $state(false);
  const handleCopy = () => {
    const timeout = 5000;
    if (!copied) {
      copied = true;
      setTimeout(() => {
        copied = false;
      }, timeout);
      toast.info('Link copied to clipboard!', { duration: timeout });
    }
  }

</script>

<article class="space-y-2 w-100 col-span-8 col-span-12 md:col-span-8">
  <RecipeHeader>
    {#snippet title()}
      <Popover.Root>
        <Popover.Trigger>
          <H3>
            {recipe.title}
          </H3>
        </Popover.Trigger>
        <Popover.Content class="space-y-2">
          <span class="font-bold">Additional Info</span>
          <section class="flex flex-col space-y-1">
            <span class="text-md text-gray-600 dark:text-gray-400">Author: 
              {#if recipe.user}
                <a class="font-semibold hover:underline" href="/{recipe.user.username}/recipes">{authorUsername}</a>
              {:else if recipe.authorId}
                <a class="font-semibold hover:underline" href="/{recipe.authorId}/recipes">{authorUsername}</a>
              {:else}
                <span class="font-semibold">NO USER</span>
              {/if}
            </span>
            <span class="text-md text-gray-600 dark:text-gray-400">Last edited on: 
              <span class="font-semibold">{dayjs(recipe.updatedAt).format('DD/MM/YYYY')}</span>
            </span>
            {#if recipe.description}
              <span class="text-md text-gray-600 dark:text-gray-400">Description:
                <span class="font-semibold">{recipe.description}</span>
              </span>
            {/if}
          </section>
          <!-- <section class="flex flex-row space-y-1"> -->
            <Button size='icon' variant=ghost on:click={handleCopy}>
              {#if copied}
                <CopyCheck />
              {:else}
                <Copy />
              {/if}
            </Button>
          <!-- </section> -->
        </Popover.Content>
      </Popover.Root>
    {/snippet}

    {#snippet rating()}
      <Popover.Root>
        <Popover.Trigger>
          <Rating adapt={true} amount={recipe.ratings.length} rating={displayRating()}></Rating>
        </Popover.Trigger>
        <Popover.Content>
          <Rating adapt={false} amount={recipe.ratings.length} rating={displayRating()}></Rating>
        </Popover.Content>
      </Popover.Root>
    {/snippet}

    {#snippet bookmark()}
      <RecipeBookmark bookmarked={data.bookmarked} recipeTitle={recipe.title} amount={recipe.bookmarks.length} />
    {/snippet}
  </RecipeHeader>

  {#if !body && recipe.description}
    <p>{recipe.description}</p>
  {/if}

  <div class="prose dark:prose-invert lg:prose-xl text-wrap">
    {@html body}
  </div>
</article>
