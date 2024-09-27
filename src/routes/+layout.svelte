<script>
	import { ModeWatcher } from 'mode-watcher';

	// import Sun from "lucide-svelte/icons/sun";
  // import Moon from "lucide-svelte/icons/moon";
 
  import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner';

	let {
		children
	} = $props();
</script>

<ModeWatcher />
<Toaster richColors closeButton />

{@render children()}
