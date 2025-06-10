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

<main
	class="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[var(--color-background)] to-[var(--color-background2)] px-4 text-[var(--color-white)]"
>
	<section class="max-w-2xl space-y-6 text-center">
		<h1 class="text-4xl font-extrabold md:text-5xl">NutritionApp</h1>
		<p class="text-lg text-[var(--color-contrast)] md:text-xl">
			Manage your daily nutrition. Track your meals, your nutrient intake, and reach your personal
			goals.
		</p>
		<div class="mt-4 flex flex-col justify-center gap-4 sm:flex-row">
			<a
				href="/register"
				class="signupButton rounded-md bg-[var(--color-orange)] px-6 py-3 text-[var(--color-white)] shadow transition"
			>
				Create Account
			</a>
			<a
				href="/login"
				class="signupButton login rounded-md px-6 py-3 text-[var(--color-contrast)] transition hover:bg-blue-500"
			>
				Log In
			</a>
		</div>
	</section>

	<section class="mt-16 max-w-3xl space-y-8 text-center">
		<div class="space-y-2">
			<h2 class="text-2xl font-semibold">Key Functionalities</h2>
			<p class="text-[var(--color-contrast)]">Everything you need to track your diet with ease:</p>
		</div>
		<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
			<div class="flex items-start space-x-3">
				<div class="mt-1 text-blue-600">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="var(--color-orange)"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M5 13l4 4L19 7"
						/>
					</svg>
				</div>
				<div class="text-left">
					<h3 class="font-medium">Meal Tracking</h3>
					<p class="text-sm text-[var(--color-contrast)]">
						Quickly log your breakfasts, lunches, dinners, and snacks.
					</p>
				</div>
			</div>
			<div class="flex items-start space-x-3">
				<div class="mt-1 text-blue-600">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="var(--color-orange)"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 17v-6a4 4 0 118 0v6M5 21h14"
						/>
					</svg>
				</div>
				<div class="text-left">
					<h3 class="font-medium">Personalized Goals</h3>
					<p class="text-sm text-[var(--color-contrast)]">
						Set your calorie and nutrient targets (protein, fat, etc.) and monitor your progress.
					</p>
				</div>
			</div>
			<div class="flex items-start space-x-3">
				<div class="mt-1 text-blue-600">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="var(--color-orange)"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 8c-1.657 0-3 1.343-3 3v4h6v-4c0-1.657-1.343-3-3-3z"
						/>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 2a6 6 0 00-6 6v3h12V8a6 6 0 00-6-6z"
						/>
					</svg>
				</div>
				<div class="text-left">
					<h3 class="font-medium">History & Statistics</h3>
					<p class="text-sm text-[var(--color-contrast)]">
						Review past meals and visualize your progress with clear charts.
					</p>
				</div>
			</div>
			<div class="flex items-start space-x-3">
				<div class="mt-1 text-blue-600">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="var(--color-orange)"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M3 3h18v18H3V3z"
						/>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M7 9h10M7 13h10M7 17h6"
						/>
					</svg>
				</div>
				<div class="text-left">
					<h3 class="font-medium">Food Database</h3>
					<p class="text-sm text-[var(--color-contrast)]">
						Access a wide selection of pre-loaded foods or add your own.
					</p>
				</div>
			</div>
		</div>
	</section>

	<section class="mt-16 max-w-xl space-y-4 text-center">
		<h2 class="text-2xl font-semibold">Ready to get started?</h2>
		<p class="text-[var(--color-contrast)]">
			Create your account now and take control of your nutrition.
		</p>
		<a
			href="/register"
			class="signupButton inline-block rounded-md bg-[var(--color-orange)] px-8 py-3 text-[var(--color-white)] shadow transition"
		>
			Sign Up
		</a>
	</section>
</main>

<style>
	.login {
		border: 1px solid transparent;
		background-origin: border-box;
		background-clip: padding-box, border-box;
		background-image:
			linear-gradient(var(--color-background), var(--color-background)), var(--gradient);
	}
	.login:hover {
		background-image: var(--gradient);
		color: var(--color-background);
	}
	.signupButton:hover {
		transform: scale(1.05) rotate(-2deg);
		box-shadow: 0 6px 24px 0 rgba(255, 140, 0, 0.25);
		transition:
			transform 0.2s cubic-bezier(0.4, 0, 0.2, 1),
			box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1);
	}
</style>
