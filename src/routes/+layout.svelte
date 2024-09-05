<script>
	import { ModeWatcher } from 'mode-watcher';

	// import Sun from "lucide-svelte/icons/sun";
  // import Moon from "lucide-svelte/icons/moon";
 
  import { resetMode, setMode } from "mode-watcher";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import { Button } from "$lib/components/ui/button";
	import '../app.css';
	import Theme from '$lib/components/ui/Theme.svelte';
</script>

<ModeWatcher />

<Theme />

<slot></slot>
