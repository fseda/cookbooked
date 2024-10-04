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
  {#if pageTitle.value}
    <H3 class="p-2 text-left w-full max-w-[40rem]">{pageTitle.value}</H3>
  {/if}

  {@render children()}
</Main>
