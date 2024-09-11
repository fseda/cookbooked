<script lang="ts">
	import * as Button from "$lib/components/ui/button/index.js";
	import { LoaderCircle } from "lucide-svelte";

	type $$Props = Partial<Button.Props> & { loading?: boolean };
	type $$Events = Button.Events;

</script>

<Button.Root type="submit" on:click on:keydown {...$$restProps}>
	{#if $$props.loading}
		<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
	{/if}
	<slot />
</Button.Root>
