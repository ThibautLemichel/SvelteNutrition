<script>
	import { onMount } from 'svelte';
	export let title = 'Mon Application';
	let scrolled = false;

	function handleScroll() {
		scrolled = window.scrollY > 0;
	}

	onMount(() => {
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<header
	class="sticky top-5 z-50 mx-8 flex items-center justify-between rounded-[10px] bg-[var(--color-header-bg)] px-0 py-4 text-[var(--color-text)] transition-[backdrop-filter] duration-300"
	class:backdrop-blur-none={!scrolled}
	class:backdrop-blur-lg={scrolled}
>
	<h1 class="text-xl font-semibold" style="color: var(--color-accent)">{title}</h1>
	<nav class="flex">
		<a href="/dashboard" class="ml-4 font-medium hover:underline" style="color: var(--color-text)"
			>Dashboard</a
		>
		<a href="/settings" class="ml-4 font-medium hover:underline" style="color: var(--color-text)"
			>Settings</a
		>
		<a href="/profile" class="ml-4 font-medium hover:underline" style="color: var(--color-text)"
			>Profile</a
		>
	</nav>
</header>

<style global>
	@import '../styles/colors.css';
</style>
