<script lang=ts>
	import Header from '$lib/components/ui/Header.svelte';
	import Main from '$lib/components/ui/Main.svelte';
	import { setContext } from 'svelte';

  let { 
    children,
    data
  } = $props();

  setContext('user', data.user);
</script>

<Header></Header>

<Main>
  {@render children()}
</Main>
