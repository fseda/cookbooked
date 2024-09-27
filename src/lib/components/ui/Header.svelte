<script lang=ts>

	import { Button } from '$lib/components/ui/button';
	import { Home } from 'lucide-svelte';
	import Theme from './Theme.svelte';
	import type { User } from 'lucia';
	import { getContext } from 'svelte';
	import UserMenu from './UserMenu.svelte';
	import H1 from '$lib/components/typography/H1.svelte';


  let user = getContext('user') as User | null;

</script>

<header class="flex justify-between p-4">
  <div>
    <Button href=/ variant=ghost size=icon>
      <Home class="absolute h-[1.2rem] w-[1.2rem]"></Home>
    </Button>
  </div>

  <Button href=/ variant=ghost>
    <span class="title">
      <H1>Cookbooked</H1>
    </span>
    <span class="little-title">
      <H1>CB</H1>
    </span>
  </Button>
  
  <div class="flex justify-end space-x-4">
    <Theme />
    
    {#if user}
      <UserMenu />
    {:else}
      <Button href="/auth" variant=outline>Sign in</Button>
    {/if}
  </div>
</header>

<style>
  .little-title { display: none; }
  .title { display: contents; }

  @media (max-width: 500px) {
    .little-title { display: contents; }
    .title { display: none; }
  }
</style>