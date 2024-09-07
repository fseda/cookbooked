<script lang=ts>
  import * as Avatar from '$lib/components/ui/avatar';
  import { Button } from '$lib/components/ui/button';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import type { User } from 'lucia';
  import { getContext } from 'svelte';
  import { List, Plus } from 'lucide-svelte';

  const user = getContext('user') as User;

  const initials = getInitials();
  function getInitials(): string {
    let initials: string;
    if (user.name) {
      initials = user.name.split(' ').length >= 2 
        ? user.name.split(' ')[0][0] + user.name.split(' ')[1][0]
        : user.name.slice(0, 2);
    } else initials = user.username.slice(0, 2);

    return initials.toUpperCase();
  }
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild let:builder>
    <Button builders={[builder]} variant=ghost size=icon>
      <Avatar.Root>
        {#if user.avatar_url}
          <Avatar.Image src={user.avatar_url} alt="User Avatar" />
        {/if}
        <Avatar.Fallback>{initials}</Avatar.Fallback>
      </Avatar.Root>
    </Button>
  </DropdownMenu.Trigger>
  
  <DropdownMenu.Content class="w-[12em]">
    <DropdownMenu.Label>My Things</DropdownMenu.Label>

    <DropdownMenu.Separator />

    <DropdownMenu.Group>
      <DropdownMenu.Item href="/profile">
        Profile
      </DropdownMenu.Item>
    </DropdownMenu.Group>

    <DropdownMenu.Separator />

    <DropdownMenu.Group>
      <DropdownMenu.Item>
        My Recipes
        <DropdownMenu.Shortcut><List class="h-[1rem] w-[1rem]" /></DropdownMenu.Shortcut>
      </DropdownMenu.Item>
      <DropdownMenu.Item>
        New Recipe
        <DropdownMenu.Shortcut><Plus class="h-[1rem] w-[1rem]" /></DropdownMenu.Shortcut>
      </DropdownMenu.Item>
    </DropdownMenu.Group>

    <DropdownMenu.Separator />

    <DropdownMenu.Item class="flex justify-center">
      <Button href="/auth/logout" class="w-full h-[1.8em]" variant=destructive size="sm">Log Out</Button>
    </DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
