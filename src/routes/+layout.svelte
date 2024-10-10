<script>
	import { ModeWatcher } from 'mode-watcher';

  import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner';

	let {
		children
	} = $props();
</script>

<ModeWatcher />
<Toaster richColors closeButton position="top-right" />

{@render children()}
