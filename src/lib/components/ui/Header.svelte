<script lang=ts>

	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import { Home } from 'lucide-svelte';
	import Theme from './Theme.svelte';
	import type { User } from 'lucia';
	import Separator from './separator/separator.svelte';
	import AvatarMenu from './AvatarMenu.svelte';

</script>

<header class="flex justify-between p-4">
  <div>
    <Button href=/ variant=ghost size=icon>
      <Home class="absolute h-[1.2rem] w-[1.2rem]"></Home>
    </Button>
  </div>
  
  <div class="flex justify-end space-x-4">
    <Theme />
    <AvatarMenu />
  </div>
</header>

<!-- <Separator orientation=vertical class="my-4" /> -->