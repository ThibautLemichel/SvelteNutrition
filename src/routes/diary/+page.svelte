<script lang="ts">
	import DiaryItem from '$lib/components/DiaryItem.svelte';
	import MainDiaryComponent from '$lib/components/MainDiaryComponent.svelte';

	export let data: {
		entries: Array<{
			entry_id: number;
			name: string;
			quantity: number;
			metric: string;
			calories: number;
			protein: number;
			fat: number;
			carbohydrate: number;
			sugars: number;
			cholesterol: number;
			sodium: number;
			potassium: number;
			calcium: number;
			magnesium: number;
			zinc: number;
			meal_type: string;
		}>;
		date: string;
	};

	type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

	const grouped: Record<MealType, typeof data.entries> = {
		breakfast: [],
		lunch: [],
		dinner: [],
		snack: []
	};

	data.entries.forEach((e) => {
		const meal = e.meal_type as MealType;
		if (grouped[meal]) {
			grouped[meal].push(e);
		}
	});

	const totals = data.entries.reduce(
		(acc, e) => {
			const factor = e.quantity / 100;
			acc.calories += e.calories * factor;
			acc.protein += e.protein * factor;
			acc.fat += e.fat * factor;
			acc.carbohydrate += e.carbohydrate * factor;
			acc.sugars += e.sugars * factor;
			return acc;
		},
		{ calories: 0, protein: 0, fat: 0, carbohydrate: 0, sugars: 0 }
	);

	function formatNumber(val: number) {
		return val.toFixed(val % 1 === 0 ? 0 : 1);
	}

	function formatDate(dt: string) {
		return new Date(dt).toLocaleString();
	}
</script>

<main class="mx-auto max-w-4xl space-y-8 p-8">
	<h1 class="text-3xl font-bold">My Diary for {data.date}</h1>

	<section class="grid grid-cols-2 gap-6">
		<div>
			<h2 class="text-xl font-semibold">Nutritional Summary</h2>
			<div class="mt-2 flex space-x-6">
				<div class="rounded bg-gray-100 p-4">
					<span class="font-bold">Calories</span>
					<div class="text-xl">{Math.round(totals.calories)} kcal</div>
				</div>
				<div class="rounded bg-gray-100 p-4">
					<span class="font-bold">Proteins</span>
					<div class="text-xl">{formatNumber(totals.protein)} g</div>
				</div>
				<div class="rounded bg-gray-100 p-4">
					<span class="font-bold">Carbohydrates</span>
					<div class="text-xl">{formatNumber(totals.carbohydrate)} g</div>
				</div>
				<div class="rounded bg-gray-100 p-4">
					<span class="font-bold">Fats</span>
					<div class="text-xl">{formatNumber(totals.fat)} g</div>
				</div>
			</div>
		</div>
		<div class="flex items-end justify-end">
			<button
				class="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
				on:click={() => (window.location.href = '/addproduct')}
			>
				Add Food
			</button>
		</div>
	</section>

	{#each Object.entries(grouped) as [meal, items] (meal)}
		{#if items.length > 0}
			<MainDiaryComponent title={meal}>
				{#each items as e}
					<DiaryItem
						name={e.name}
						quantity={e.quantity}
						metric={e.metric}
						energy={(e.calories * e.quantity) / 100}
						entryId={e.entry_id}
					/>
				{/each}
			</MainDiaryComponent>
		{/if}
	{/each}
</main>
