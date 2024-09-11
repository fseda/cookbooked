<script lang=ts>
	import H2 from '$lib/components/typography/H2.svelte';
	import DOMPurify from "dompurify";
	import { marked } from "marked";
	import type { PageData } from "../../../routes/(auth)/recipes/[[id]]/$types";

  let {
    data
  }: {
    data: PageData
  } = $props();

  const postprocess = (html: string) => DOMPurify.sanitize(html);
  let body: string | undefined = $state();
  $effect(() => {
    // (marked(data.form.data.body || '') as Promise<string>).then(s => body = s)
    body = marked(data.form.data.body || '', { async: false });
  });
</script>

<article>
  <H2>asdf</H2>
  {@html body}
</article>


