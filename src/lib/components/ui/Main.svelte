<script lang=ts>
	import { page } from "$app/stores";
	import { setContext, type Snippet } from "svelte";
	import { writable } from "svelte/store";

  interface Props {
    class?: string;
    children: Snippet<[]>;
  };

  let {
    class: clazz,
    children,
  }: Props = $props();

</script>

<main class="relative h-full w-full overflow-y-auto flex justify-center items-center p-4 {clazz}">
  {@render children()}
</main>