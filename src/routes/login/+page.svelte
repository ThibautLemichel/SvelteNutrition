<script>
	import Header from '$lib/components/Header.svelte';
</script>

<Header />
<div
	class="relative min-h-screen overflow-hidden bg-gradient-to-b from-[var(--color-orange)] to-[var(--color-beige)]"
>
	<div class="mx-auto h-90 w-150 bg-[url('/family.png')] bg-cover bg-center"></div>
	<form
		method="POST"
		class="colorWhite relative mx-auto -mt-5 flex max-w-sm flex-col gap-4 rounded-lg bg-[var(--color-background)] p-6 shadow-lg"
	>
		<h2 class="text-2xl font-semibold">Login</h2>
		<input name="email" type="email" placeholder="Email" required class="rounded border p-2" />
		<input
			name="password"
			type="password"
			placeholder="Password"
			required
			class="rounded border p-2"
		/>
		<button
			type="submit"
			class="colorWhite cursor-pointer rounded border-2 border-[var(--color-orange)] bg-[var(--color-background)] px-4 py-2 text-xl duration-300 hover:bg-[var(--color-orange)] hover:transition"
		>
			Login</button
		>
	</form>
</div>

<style>
	.colorWhite {
		color: var(--color-white);
	}
</style>
