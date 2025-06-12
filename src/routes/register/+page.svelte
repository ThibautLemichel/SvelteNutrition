<script>
	import Header from '$lib/components/Header.svelte';
</script>

<Header />
<div class="flex min-h-screen items-center justify-center bg-[var(--color-background2)] px-4">
	<form
		method="POST"
		class="colorWhite relative mx-auto -mt-5 flex w-full max-w-sm flex-col gap-4 rounded-lg bg-[var(--color-background)] p-6 shadow-lg"
	>
		<h2 class="text-2xl font-semibold">Create an Account</h2>
		<input name="name" type="text" placeholder="Name" required class="rounded border p-2" />
		<input name="email" type="email" placeholder="Email" required class="rounded border p-2" />
		<input
			name="password"
			type="password"
			placeholder="••••••••"
			required
			class="rounded border p-2"
		/>
		<button
			type="submit"
			class="colorWhite cursor-pointer rounded border-2 border-[var(--color-orange)] bg-[var(--color-background)] px-4 py-2 text-xl duration-300 hover:bg-[var(--color-orange)] hover:transition"
		>
			Register</button
		>
	</form>
</div>

<style>
	.colorWhite {
		color: var(--color-white);
	}
</style>
