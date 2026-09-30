<script>
	import { page } from '$app/state';
</script>

<h1 class="text-center">{page.status} {page.error?.message}</h1>
<p class="text-center"><span class="fw-bold">{page.url.pathname}</span> does not exsist :/</p>