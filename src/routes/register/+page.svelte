<script>
	import Header from '$lib/components/Header.svelte';
</script>

<Header />
<form method="POST" class="mx-auto mt-10 flex max-w-sm flex-col gap-4">
	<h2 class="text-2xl font-semibold">Create an Account</h2>
	<input name="name" type="text" placeholder="Name" required class="rounded border p-2" />
	<input name="email" type="email" placeholder="Email" required class="rounded border p-2" />
	<input
		name="password"
		type="password"
		placeholder="Password"
		required
		class="rounded border p-2"
	/>
	<button type="submit" class="rounded bg-green-600 px-4 py-2 text-white">Register</button>
</form>
