<script lang=ts>
	import type { Snippet } from "svelte";

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