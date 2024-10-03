<script lang=ts>
	import { beforeNavigate } from '$app/navigation';
	import H3 from '$lib/components/typography/H3.svelte';
import Header from '$lib/components/ui/Header.svelte';
	import Main from '$lib/components/ui/Main.svelte';
	import { createPageTitle } from '$lib/stores/title.svelte.js';
	import { setContext } from 'svelte';

  let { 
    children,
    data
  } = $props();

  let pageTitle = createPageTitle();

  beforeNavigate(() => {
    pageTitle.value = '';
  });
  
  setContext('user', data.user);
  setContext('page-title', pageTitle);
</script>

<Header/>

<Main class="flex-col">
  {#if pageTitle}
    <H3 class="text-left w-full px-4">{pageTitle.value}</H3>
  {/if}

  {@render children()}
</Main>
