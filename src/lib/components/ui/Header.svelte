<script lang=ts>

	import { Button } from '$lib/components/ui/button';
	import { Home } from 'lucide-svelte';
	import Theme from './Theme.svelte';
	import type { User } from 'lucia';
	import { getContext } from 'svelte';
	import UserMenu from './UserMenu.svelte';

  let user = getContext('user') as User | null;

</script>

<header class="flex justify-between p-4">
  <div>
    <Button href=/ variant=ghost size=icon>
      <Home class="absolute h-[1.2rem] w-[1.2rem]"></Home>
    </Button>
  </div>

  <div class="flex justify-end space-x-4">
    <Theme />
    
    {#if user}
      <UserMenu />
    {:else}
      <Button href="/auth" variant=outline>Sign in</Button>
    {/if}
  </div>
</header>

<!-- <Separator orientation=vertical class="my-4" /> -->