<script lang=ts>
  import * as Avatar from '$lib/components/ui/avatar';
  import { Button } from '$lib/components/ui/button';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import type { User } from 'lucia';
  import { getContext } from 'svelte';

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

<!-- <Avatar.Root>
  {#if user.avatar_url}
    <Avatar.Image src={user.avatar_url} alt="User Avatar" />
  {/if}
  <Avatar.Fallback>{initials}</Avatar.Fallback>
</Avatar.Root> -->

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
  <DropdownMenu.Content>
    <DropdownMenu.Label>Profile</DropdownMenu.Label>
    <DropdownMenu.Separator />
    <DropdownMenu.Group>
      <DropdownMenu.Item>
        asdf
      </DropdownMenu.Item>
    </DropdownMenu.Group>
  </DropdownMenu.Content>
</DropdownMenu.Root>

