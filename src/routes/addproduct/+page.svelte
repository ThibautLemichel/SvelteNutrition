<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import ProductComponent from '$lib/components/ProductComponent.svelte';

	// Search state
	const query = writable('');
	const results = writable<Array<{ id: number; name: string; energy: number }>>([]);

	let debounceTimer: NodeJS.Timeout;

	// History state (unchanged from previous)
	const history = writable<
		Array<{
			product_id: number;
			name: string;
			meal_type: string;
		}>
	>([]);
	const histError = writable<string>('');

	const currentMealType = writable<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');

	function onInput(event: Event) {
		const value = (event.target as HTMLInputElement).value;
		query.set(value);
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => fetchProducts(value), 300);
	}

	async function fetchProducts(term: string) {
		if (!term.trim()) {
			results.set([]);
			return;
		}
		try {
			const res = await fetch(`/api/products?q=${encodeURIComponent(term)}`);
			if (res.ok) {
				const data = await res.json();
				results.set(data);
			}
		} catch (err) {
			console.error(err);
		}
	}

	onMount(async () => {
		try {
			const res = await fetch('/api/history');
			if (res.ok) {
				const data = await res.json();
				history.set(data);
			} else {
				histError.set('Impossible de charger l’historique');
			}
		} catch (err) {
			console.error(err);
			histError.set('Erreur réseau');
		}
	});

	onDestroy(() => clearTimeout(debounceTimer));

	// Called when ProductComponent dispatches “add”
	async function addQuickly(event: CustomEvent<any>) {
		const { id, quantity } = event.detail;

		const formData = new FormData();
		formData.set('product_id', String(id));
		formData.set('metric', 'g');
		formData.set('quantity', String(quantity));
		formData.set('meal_type', $currentMealType);

		try {
			console.log(
				'Adding product:',
				formData.get('meal_type'),
				formData.get('product_id'),
				formData.get('quantity')
			);
			const res = await fetch('/addproduct', {
				method: 'POST',
				body: formData
			});
			if (res.ok) {
				// Refresh history
				const hist = await fetch('/api/history');
				if (hist.ok) {
					history.set(await hist.json());
				}
			} else {
				console.error('Add product fails:', res.status);
			}
		} catch (err) {
			console.error(err);
		}
	}

	// Format date
	function formatDate(dt: string) {
		return new Date(dt).toLocaleString();
	}
</script>

<main class="bg-background mx-auto max-w-3xl space-y-6 p-8">
	<h1 class="mb-4 text-2xl font-bold">Add a product :</h1>

	<div class="mealTypeContainer mb-4 flex items-center justify-between p-4">
		<label for="meal" class="mb-1 block text-xl font-bold">Meal type :</label>
		<div class="mealTypeWrapper">
			<select
				id="meal"
				bind:value={$currentMealType}
				class="border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			>
				<option value="breakfast">Breakfast</option>
				<option value="lunch">Lunch</option>
				<option value="dinner">Dinner</option>
				<option value="snack">Snack</option>
			</select>
		</div>
	</div>

	<div class="searchBar relative mb-4">
		<input
			type="text"
			placeholder="Search for a product..."
			class="w-full rounded border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			on:input={onInput}
			bind:value={$query}
		/>

		{#if $results.length}
			<div class="top-12">
				{#each $results as item}
					<ProductComponent
						id={item.id}
						name={item.name}
						energy={item.energy}
						quantity={100}
						meal_type={$currentMealType}
						on:add={addQuickly}
					/>
				{/each}
			</div>
		{/if}
	</div>

	<section class="historyContainer mt-8">
		<h2 class="mb-4 text-xl font-semibold">Recent History</h2>
		{#if $histError !== ''}
			<p class="text-red-500">{$histError}</p>
		{:else if $history.length === 0}
			<p class="text-gray-500">You have not added any products yet.</p>
		{:else}
			<div class="flex flex-col space-y-4">
				{#each $history as entry}
					<ProductComponent
						id={entry.product_id}
						name={entry.name}
						energy={undefined}
						quantity={100}
						meal_type={entry.meal_type}
						on:add={addQuickly}
					/>
				{/each}
			</div>
		{/if}
	</section>
</main>

<style>
	main {
		background-color: var(--color-background2);
	}
	h1 {
		color: var(--color-white);
	}
	.mealTypeContainer {
		background-color: var(--color-grey);
		border-radius: 0.5rem;
	}
	.mealTypeContainer label {
		color: var(--color-background2);
	}
	.mealTypeContainer select {
		color: var(--color-white);
		background-color: var(--color-background2);
		border: none;
		border-radius: 8px;
	}
	.mealTypeWrapper {
		display: inline-block;
		padding: 2px;
		border-radius: 10px;
		background: var(--gradient);
	}
	.historyContainer {
		background-color: var(--color-grey);
		padding: 1rem;
		border-radius: 0.5rem;
	}

	.searchBar {
		background-color: var(--color-grey);
		padding: 1rem;
		border-radius: 0.5rem;
	}
</style>
