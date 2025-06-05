<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import Header from '$lib/components/Header.svelte';

	onMount(() => {
		if (browser) {
			const cookies = Object.fromEntries(document.cookie.split('; ').map((c) => c.split('=')));
			console.log('Cookies:', cookies);
			if (cookies.session) {
				goto('/dashboard');
			}
		}
	});
</script>

<Header />

<main class="flex min-h-screen flex-col items-center justify-center gap-4">
	<h1 class="text-3xl font-bold">Welcome to Nutrition Project</h1>
	<div class="flex gap-2">
		<button class="rounded bg-blue-600 px-4 py-2 text-white" on:click={() => goto('/login')}
			>Login</button
		>
		<button class="rounded bg-green-600 px-4 py-2 text-white" on:click={() => goto('/register')}
			>Register</button
		>
	</div>
</main>
