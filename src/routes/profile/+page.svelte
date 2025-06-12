<script lang="ts">
	import { page } from '$app/stores';
	import Header from '$lib/components/Header.svelte';
	import { onMount } from 'svelte';

	export let data: {
		userId: number;
		name: string;
		email: string;
		caloriesGoal: number;
		proteinGoal: number;
		fatGoal: number;
		carbGoal: number;
		sugarGoal: number;
		cholesterolGoal: number;
		sodiumGoal: number;
		potassiumGoal: number;
		calciumGoal: number;
		magnesiumGoal: number;
		zincGoal: number;
	};

	// data fetched from the server
	let name = data.name;
	let email = data.email;
	let password = '';
	let caloriesGoal = data.caloriesGoal;
	let proteinGoal = data.proteinGoal;
	let fatGoal = data.fatGoal;
	let carbGoal = data.carbGoal;
	let sugarGoal = data.sugarGoal;
	let cholesterolGoal = data.cholesterolGoal;
	let sodiumGoal = data.sodiumGoal;
	let potassiumGoal = data.potassiumGoal;
	let calciumGoal = data.calciumGoal;
	let magnesiumGoal = data.magnesiumGoal;
	let zincGoal = data.zincGoal;

	let updated = false;
	onMount(() => {
		const search = $page.url.searchParams;
		if (search.get('updated') === 'true') {
			updated = true;
			history.replaceState({}, '', '/profile');
		}
	});
</script>

<Header />

<main class="mx-auto max-w-lg space-y-6 p-8">
	<h1 class="text-3xl font-bold">Edit Profile</h1>

	{#if updated}
		<div class="rounded bg-green-100 p-4 text-green-800">
			Your profile has been successfully updated.
		</div>
	{/if}

	<form method="POST" class="space-y-4">
		<div>
			<label for="name" class="mb-1 block font-medium">Name</label>
			<input
				id="name"
				name="name"
				type="text"
				bind:value={name}
				required
				class="w-full rounded border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			/>
		</div>

		<div>
			<label for="email" class="mb-1 block font-medium">Email</label>
			<input
				id="email"
				name="email"
				type="email"
				bind:value={email}
				required
				class="w-full rounded border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			/>
		</div>

		<div>
			<label for="password" class="mb-1 block font-medium">
				New Password (leave blank to keep current)
			</label>
			<input
				id="password"
				name="password"
				type="password"
				bind:value={password}
				placeholder="••••••••"
				class="w-full rounded border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			/>
		</div>

		<div>
			<label for="calories_goal" class="mb-1 block font-medium"> Daily Calories Goal </label>
			<input
				id="calories_goal"
				name="calories_goal"
				type="number"
				min="0"
				step="1"
				bind:value={caloriesGoal}
				required
				class="w-full rounded border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			/>
		</div>

		<div>
			<label for="protein_goal" class="mb-1 block font-medium">Protein Goal (g)</label>
			<input
				id="protein_goal"
				name="protein_goal"
				type="number"
				min="0"
				step="0.1"
				bind:value={proteinGoal}
				required
				class="w-full rounded border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			/>
		</div>

		<div>
			<label for="fat_goal" class="mb-1 block font-medium">Fat Goal (g)</label>
			<input
				id="fat_goal"
				name="fat_goal"
				type="number"
				min="0"
				step="0.1"
				bind:value={fatGoal}
				required
				class="w-full rounded border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			/>
		</div>

		<div>
			<label for="carb_goal" class="mb-1 block font-medium">Carbohydrate Goal (g)</label>
			<input
				id="carb_goal"
				name="carb_goal"
				type="number"
				min="0"
				step="0.1"
				bind:value={carbGoal}
				required
				class="w-full rounded border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			/>
		</div>

		<div>
			<label for="sugar_goal" class="mb-1 block font-medium">Sugar Goal (g)</label>
			<input
				id="sugar_goal"
				name="sugar_goal"
				type="number"
				min="0"
				step="0.1"
				bind:value={sugarGoal}
				required
				class="w-full rounded border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			/>
		</div>

		<div>
			<label for="cholesterol_goal" class="mb-1 block font-medium">Cholesterol Goal (mg)</label>
			<input
				id="cholesterol_goal"
				name="cholesterol_goal"
				type="number"
				min="0"
				step="0.1"
				bind:value={cholesterolGoal}
				required
				class="w-full rounded border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			/>
		</div>

		<div>
			<label for="sodium_goal" class="mb-1 block font-medium">Sodium Goal (mg)</label>
			<input
				id="sodium_goal"
				name="sodium_goal"
				type="number"
				min="0"
				step="0.1"
				bind:value={sodiumGoal}
				required
				class="w-full rounded border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			/>
		</div>

		<div>
			<label for="potassium_goal" class="mb-1 block font-medium">Potassium Goal (mg)</label>
			<input
				id="potassium_goal"
				name="potassium_goal"
				type="number"
				min="0"
				step="0.1"
				bind:value={potassiumGoal}
				required
				class="w-full rounded border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			/>
		</div>

		<div>
			<label for="calcium_goal" class="mb-1 block font-medium">Calcium Goal (mg)</label>
			<input
				id="calcium_goal"
				name="calcium_goal"
				type="number"
				min="0"
				step="0.1"
				bind:value={calciumGoal}
				required
				class="w-full rounded border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			/>
		</div>

		<div>
			<label for="magnesium_goal" class="mb-1 block font-medium">Magnesium Goal (mg)</label>
			<input
				id="magnesium_goal"
				name="magnesium_goal"
				type="number"
				min="0"
				step="0.1"
				bind:value={magnesiumGoal}
				required
				class="w-full rounded border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			/>
		</div>

		<div>
			<label for="zinc_goal" class="mb-1 block font-medium">Zinc Goal (mg)</label>
			<input
				id="zinc_goal"
				name="zinc_goal"
				type="number"
				min="0"
				step="0.1"
				bind:value={zincGoal}
				required
				class="w-full rounded border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			/>
		</div>

		{#if $page.form?.message}
			<div class="text-sm text-red-600">
				{$page.form.message}
			</div>
		{/if}

		<button
			type="submit"
			class="mt-4 w-full rounded border-2 border-[var(--color-orange)] bg-[var(--color-background)] px-6 py-2 text-white transition duration-300 hover:bg-[var(--color-orange)] hover:shadow-lg"
		>
			Save Changes
		</button>
	</form>
</main>

<style>
	h1 {
		color: var(--color-white);
	}
	form {
		color: var(--color-white);
	}
</style>
