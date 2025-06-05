<script lang="ts">
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';
	import { goto } from '$app/navigation';

	const user = derived(page, ($page) => $page.data.user);

	// Logout function to clear session and redirect
	async function logout() {
		await fetch('/api/logout', { method: 'POST' });
		goto('/', { invalidateAll: true });
	}

	let showMobile = false;
</script>

<nav class="background sticky top-0 shadow-md">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center justify-between">
			<a href="/" class="flex items-center space-x-2">
				<img src="/logo.png" alt="Logo" class="h-12 w-12" />
				<span class="colorWhite text-2xl font-bold">NutritionApp</span>
			</a>

			<!-- Desktop Links -->
			<div class="colorContrast hidden space-x-8 md:flex">
				{#if $user}
					<!-- Logged‐in links -->
					<a
						href="/dashboard"
						class="colorOrange relative px-3 py-2 font-medium"
						class:font-semibold={$page.url.pathname === '/dashboard'}
					>
						Dashboard
						{#if $page.url.pathname === '/dashboard'}
							<span class="bgOrange absolute inset-x-0 bottom-0 h-0.5 rounded-t"></span>
						{/if}
					</a>
					<a
						href="/diary"
						class="colorOrange relative px-3 py-2 font-medium"
						class:font-semibold={$page.url.pathname === '/diary'}
					>
						Diary
						{#if $page.url.pathname === '/diary'}
							<span class="bgOrange absolute inset-x-0 bottom-0 h-0.5 rounded-t"></span>
						{/if}
					</a>
					<a
						href="/profile"
						class="colorOrange relative px-3 py-2 font-medium"
						class:font-semibold={$page.url.pathname === '/profile'}
					>
						Profile
						{#if $page.url.pathname === '/profile'}
							<span class="bgOrange absolute inset-x-0 bottom-0 h-0.5 rounded-t"></span>
						{/if}
					</a>
					<button on:click={logout} class="btn-anim relative px-3 py-2 font-medium"
						><span>Logout</span>
					</button>
				{:else}
					<!-- Not logged in -->
					<a
						href="/"
						class="colorOrange colorContrast relative px-3 py-2 font-medium"
						class:font-semibold={$page.url.pathname === '/'}
					>
						Home
						{#if $page.url.pathname === '/'}
							<span class="bgOrange absolute inset-x-0 bottom-0 h-0.5 rounded-t"></span>
						{/if}
					</a>
					<a
						href="/login"
						class="colorOrange relative px-3 py-2 font-medium"
						class:font-semibold={$page.url.pathname === '/login'}
					>
						Login
						{#if $page.url.pathname === '/login'}
							<span class="bgOrange absolute inset-x-0 bottom-0 h-0.5 rounded-t"></span>
						{/if}
					</a>
					<a
						href="/register"
						class="colorOrange relative px-3 py-2 font-medium"
						class:font-semibold={$page.url.pathname === '/register'}
					>
						Register
						{#if $page.url.pathname === '/register'}
							<span class="bgOrange absolute inset-x-0 bottom-0 h-0.5 rounded-t"></span>
						{/if}
					</a>
				{/if}
			</div>

			<!-- Mobile button -->
			<button
				class="colorWhite focus:ring-2 focus:ring-blue-500 focus:outline-none md:hidden"
				on:click={() => (showMobile = !showMobile)}
			>
				<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h16M4 18h16"
					/>
				</svg>
			</button>
		</div>
	</div>

	<!-- Mobile menu -->
	{#if showMobile}
		<div class="background border-t border-gray-200 md:hidden">
			<div class="colorContrast space-y-1 px-2 pt-2 pb-3">
				{#if $user}
					<a
						href="/dashboard"
						class="mobile-link-hover block rounded-md px-3 py-2 text-base font-medium"
					>
						Dashboard
					</a>
					<a
						href="/diary"
						class="mobile-link-hover block rounded-md px-3 py-2 text-base font-medium"
					>
						Diary
					</a>
					<a
						href="/profile"
						class=" mobile-link-hover block rounded-md px-3 py-2 text-base font-medium"
					>
						Profile
					</a>
					<button
						on:click={logout}
						class="mobile-link-hover w-full rounded-md px-3 py-2 text-left text-base font-medium"
					>
						Logout
					</button>
				{:else}
					<a href="/" class="mobile-link-hover block rounded-md px-3 py-2 text-base font-medium">
						Home
					</a>
					<a
						href="/login"
						class=" mobile-link-hover block rounded-md px-3 py-2 text-base font-medium"
					>
						Login
					</a>
					<a
						href="/register"
						class="mobile-link-hover block rounded-md px-3 py-2 text-base font-medium"
					>
						Register
					</a>
				{/if}
			</div>
		</div>
	{/if}
</nav>

<style>
	nav {
		z-index: 10;
	}
	.background {
		background: var(--color-background);
	}
	.bgOrange {
		background: var(--color-orange);
	}
	.colorOrange:hover {
		color: var(--color-orange);
	}
	.colorContrast {
		color: var(--color-contrast);
	}
	.colorWhite {
		color: var(--color-white);
	}
	.colorBackground {
		color: var(--color-background);
	}

	.btn-anim {
		border: 2px solid transparent;
		cursor: pointer;
		overflow: hidden;
		transition: color 0.3s ease;
	}

	.btn-anim span {
		position: relative;
		z-index: 1;
	}

	.btn-anim::before {
		content: '';
		position: absolute;
		inset: 0;
		border: 2px solid var(--color-orange);
		clip-path: polygon(0% 100%, 0% 100%, 0% 100%, 0% 100%);
		transition: clip-path 0.5s ease;
		z-index: 0;
	}

	.btn-anim:hover::before {
		clip-path: polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%);
	}

	.btn-anim:hover {
		color: var(--color-orange);
	}

	.mobile-link-hover:hover {
		background: var(--color-orange);
		color: var(--color-white);
		transition:
			background 0.3s ease,
			color 0.3s ease,
			transform 0.3s ease;
	}
</style>
