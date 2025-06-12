<script lang="ts">
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';
	import { color } from 'chart.js/helpers';
	import Header from '$lib/components/Header.svelte';
	import ChuckNorrisIcon from '$lib/components/ChuckNorrisIcon.svelte';

	export let data: {
		userName: string;
		caloriesGoal: number;
		mealCalories: {
			breakfast: number;
			lunch: number;
			dinner: number;
			snack: number;
		};
		nutrientSums: {
			protein: number;
			fat: number;
			carbohydrate: number;
			sugar: number;
			cholesterol: number;
			sodium: number;
			potassium: number;
			calcium: number;
			magnesium: number;
			zinc: number;
		};
		nutrientGoals: {
			protein: number;
			fat: number;
			carbohydrate: number;
			sugar: number;
			cholesterol: number;
			sodium: number;
			potassium: number;
			calcium: number;
			magnesium: number;
			zinc: number;
		};
	};

	let doughnutCanvas: HTMLCanvasElement;

	onMount(() => {
		const { breakfast, lunch, dinner, snack } = data.mealCalories;
		const totalConsumed = breakfast + lunch + dinner + snack;
		const goal = data.caloriesGoal;
		const remaining = goal - totalConsumed;

		const labels: string[] = [];
		const values: number[] = [];
		const bgColors: string[] = [];

		if (breakfast > 0) {
			labels.push('Breakfast');
			values.push(breakfast);
			bgColors.push('#ff9675');
		}
		if (lunch > 0) {
			labels.push('Lunch');
			values.push(lunch);
			bgColors.push('#9363ff');
		}
		if (dinner > 0) {
			labels.push('Dinner');
			values.push(dinner);
			bgColors.push('#3490e4');
		}
		if (snack > 0) {
			labels.push('Snack');
			values.push(snack);
			bgColors.push('#e3b505');
		}

		if (remaining >= 0) {
			labels.push('Remaining');
			values.push(remaining);
			bgColors.push('#C0C0C0');
		} else {
			labels.push('Over Goal');
			values.push(Math.abs(remaining));
			bgColors.push('#FF0000');
		}

		new Chart(doughnutCanvas, {
			type: 'doughnut',
			data: {
				labels,
				datasets: [
					{
						data: values,
						backgroundColor: bgColors,
						borderWidth: 1
					}
				]
			},
			options: {
				responsive: true,
				plugins: {
					legend: {
						position: 'bottom',
						labels: {
							color: '#d9d9d9'
						}
					},
					tooltip: {
						callbacks: {
							label: (context) => {
								const lbl = context.label || '';
								const val = context.parsed as number;
								return `${lbl}: ${Math.round(val)} kcal`;
							}
						}
					}
				}
			}
		});
	});

	// Function to calculate percentage intake against goal
	function percent(intake: number, goal: number) {
		if (goal <= 0) return 0;
		return Math.min((intake / goal) * 100, 100);
	}
</script>

<Header />

<main class="relative mx-auto max-w-4xl space-y-6 p-8">
	<div class="absolute top-50 right-4">
		<ChuckNorrisIcon />
	</div>
	<h1 class="text-3xl font-bold">Welcome, {data.userName}!</h1>

	<section class="background rounded-lg p-6 shadow-md">
		<h2 class="mb-4 text-2xl font-semibold">Calories Breakdown (Today)</h2>
		<canvas bind:this={doughnutCanvas}></canvas>
	</section>

	<section class="colorWhite grid grid-cols-2 gap-6 md:grid-cols-4">
		<div class="carb line rounded p-4 text-center">
			<span class="block font-bold">Breakfast</span>
			<span class="text-xl">{Math.round(data.mealCalories.breakfast)} kcal</span>
		</div>
		<div class="cal line rounded p-4 text-center">
			<span class="block font-bold">Lunch</span>
			<span class="text-xl">{Math.round(data.mealCalories.lunch)} kcal</span>
		</div>
		<div class="prot line rounded p-4 text-center">
			<span class="block font-bold">Dinner</span>
			<span class="text-xl">{Math.round(data.mealCalories.dinner)} kcal</span>
		</div>
		<div class="backgroundYellow line rounded p-4 text-center">
			<span class="block font-bold">Snack</span>
			<span class="text-xl">{Math.round(data.mealCalories.snack)} kcal</span>
		</div>
	</section>

	<section class="colorWhite grid grid-cols-2 gap-6">
		<div class="cal line rounded p-4">
			<span class="font-bold">Daily Calories Goal</span>
			<div class="text-xl">{data.caloriesGoal} kcal</div>
		</div>
		<div class="prot line rounded p-4">
			<span class="font-bold">Total Consumed</span>
			<div class="text-xl">
				{Math.round(
					data.mealCalories.breakfast +
						data.mealCalories.lunch +
						data.mealCalories.dinner +
						data.mealCalories.snack
				)} / {data.caloriesGoal} kcal
			</div>
		</div>
	</section>

	<section class="background rounded-lg p-6 shadow-md">
		<h2 class="mb-4 text-2xl font-semibold">Nutrient Progress</h2>

		{#each [{ name: 'Protein', intake: data.nutrientSums.protein, goal: data.nutrientGoals.protein, unit: 'g' }, { name: 'Fat', intake: data.nutrientSums.fat, goal: data.nutrientGoals.fat, unit: 'g' }, { name: 'Carbohydrates', intake: data.nutrientSums.carbohydrate, goal: data.nutrientGoals.carbohydrate, unit: 'g' }, { name: 'Sugar', intake: data.nutrientSums.sugar, goal: data.nutrientGoals.sugar, unit: 'g' }, { name: 'Cholesterol', intake: data.nutrientSums.cholesterol, goal: data.nutrientGoals.cholesterol, unit: 'mg' }, { name: 'Sodium', intake: data.nutrientSums.sodium, goal: data.nutrientGoals.sodium, unit: 'mg' }, { name: 'Potassium', intake: data.nutrientSums.potassium, goal: data.nutrientGoals.potassium, unit: 'mg' }, { name: 'Calcium', intake: data.nutrientSums.calcium, goal: data.nutrientGoals.calcium, unit: 'mg' }, { name: 'Magnesium', intake: data.nutrientSums.magnesium, goal: data.nutrientGoals.magnesium, unit: 'mg' }, { name: 'Zinc', intake: data.nutrientSums.zinc, goal: data.nutrientGoals.zinc, unit: 'mg' }] as nutrient}
			<div class="colorWhite mb-6">
				<div class="mb-1 flex justify-between">
					<span class="font-medium">{nutrient.name}</span>
					<span class="colorContrast text-sm">
						{Math.round(nutrient.intake)} / {nutrient.goal}
						{nutrient.unit}
					</span>
				</div>

				<div class="h-4 w-full overflow-hidden rounded-full bg-gray-200">
					<div
						class="progress-bar h-full rounded-full"
						style="width: {percent(nutrient.intake, nutrient.goal)}%;"
					></div>
				</div>
			</div>
		{/each}
	</section>

	<section class="background line space-y-4 rounded-lg p-6 shadow-md">
		<h2 class="text-2xl font-semibold">Quick Actions</h2>
		<div class="flex space-x-4">
			<button
				class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
				on:click={() => (window.location.href = '/addproduct')}
			>
				Add New Food
			</button>
			<button
				class="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
				on:click={() => (window.location.href = '/diary')}
			>
				View Full Diary
			</button>
			<button
				class="rounded bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-700"
				on:click={() => (window.location.href = '/profile')}
			>
				Edit Profile
			</button>
		</div>
	</section>
</main>

<style>
	canvas {
		max-height: 300px;
	}
	h1,
	h2 {
		color: var(--color-white);
	}
	.progress-bar {
		background: var(--gradient);
	}
	.background {
		background: var(--color-background);
	}
	.colorWhite {
		color: var(--color-white);
	}
	.colorContrast {
		color: var(--color-contrast);
	}
</style>
