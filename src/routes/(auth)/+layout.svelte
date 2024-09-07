<script lang=ts>
	import Header from '$lib/components/ui/Header.svelte';
	import Main from '$lib/components/ui/Main.svelte';
	import Theme from '$lib/components/ui/Theme.svelte';
  import * as Avatar from '$lib/components/ui/avatar';
	import { Separator } from '$lib/components/ui/separator';
	import { Home, HomeIcon } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button';
	import { setContext } from 'svelte';
	import type { User } from 'lucia';

  let { 
    children,
    data
  } = $props();

  const user = data.user || {} as User;

  setContext('user', user);
</script>

<Header></Header>

<Main>
  {@render children()}
</Main>
