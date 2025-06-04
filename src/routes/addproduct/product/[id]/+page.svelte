<script lang="ts">
	export let data: {
		product: {
			id: number;
			name: string;
			protein: number;
			fat: number;
			carbohydrate: number;
			calories: number;
			sugars: number;
			cholesterol: number;
			sodium: number;
			potassium: number;
			calcium: number;
			magnesium: number;
			zinc: number;
		};
	};

	// Form fields
	let quantity = 100; // default in grams
	let metric = 'g';
	let mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' = 'breakfast';

	function scale(per100: number, qty: number) {
		return (per100 * qty) / 100;
	}
</script>

<main class="mx-auto max-w-2xl space-y-6 p-8">
	<h1 class="text-3xl font-bold">{data.product.name}</h1>
	<p class="">(Nutritional values are per 100 g)</p>

	<form method="POST" class="form space-y-4">
		<div class="flex items-center gap-2">
			<label for="quantity" class="font-medium">Quantity (g):</label>
			<input
				id="quantity"
				name="quantity"
				type="number"
				bind:value={quantity}
				min="1"
				step="1"
				class="w-24 rounded border px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			/>
			<select
				name="metric"
				bind:value={metric}
				class="rounded border px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			>
				<option value="g">g</option>
			</select>
		</div>

		<div class="flex items-center gap-2">
			<label for="meal_type" class="font-medium">Meal Type:</label>
			<select
				id="meal_type"
				name="meal_type"
				bind:value={mealType}
				class="rounded border px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			>
				<option value="breakfast">Breakfast</option>
				<option value="lunch">Lunch</option>
				<option value="dinner">Dinner</option>
				<option value="snack">Snack</option>
			</select>
		</div>

		<section class="grid grid-cols-2 gap-4">
			<div class="cal rounded bg-gray-100 p-4">
				<span class="font-bold">Calories</span>
				<div class="text-xl">{Math.round(scale(data.product.calories, quantity))} kcal</div>
			</div>
			<div class="prot rounded bg-gray-100 p-4">
				<span class="font-bold">Proteins</span>
				<div class="text-xl">{scale(data.product.protein, quantity).toFixed(1)} g</div>
			</div>
			<div class="fat rounded bg-gray-100 p-4">
				<span class="font-bold">Fats</span>
				<div class="text-xl">{scale(data.product.fat, quantity).toFixed(1)} g</div>
			</div>
			<div class="carb rounded bg-gray-100 p-4">
				<span class="font-bold">Carbohydrates</span>
				<div class="text-xl">{scale(data.product.carbohydrate, quantity).toFixed(1)} g</div>
			</div>
		</section>

		<section>
			<h2 class="mb-2 text-2xl font-semibold">Nutrition Details</h2>
			<table class="w-full table-auto border-collapse">
				<thead>
					<tr class="bg-gray-200 text-black">
						<th class="p-2 text-left">Nutrient</th>
						<th class="p-2">Per 100 g</th>
						<th class="p-2">Per {quantity} g</th>
					</tr>
				</thead>
				<tbody>
					<tr class="border-t">
						<td class="p-2">Energy (Calories)</td>
						<td class="p-2">{data.product.calories.toFixed(0)} kcal</td>
						<td class="p-2">{Math.round(scale(data.product.calories, quantity))} kcal</td>
					</tr>
					<tr class="border-t">
						<td class="p-2">Proteins</td>
						<td class="p-2">{data.product.protein.toFixed(1)} g</td>
						<td class="p-2">{scale(data.product.protein, quantity).toFixed(1)} g</td>
					</tr>
					<tr class="border-t">
						<td class="p-2">Fats</td>
						<td class="p-2">{data.product.fat.toFixed(1)} g</td>
						<td class="p-2">{scale(data.product.fat, quantity).toFixed(1)} g</td>
					</tr>
					<tr class="border-t">
						<td class="p-2">Carbohydrates</td>
						<td class="p-2">{data.product.carbohydrate.toFixed(1)} g</td>
						<td class="p-2">{scale(data.product.carbohydrate, quantity).toFixed(1)} g</td>
					</tr>
					<tr class="border-t">
						<td class="p-2">Sugars</td>
						<td class="p-2">{data.product.sugars.toFixed(1)} g</td>
						<td class="p-2">{scale(data.product.sugars, quantity).toFixed(1)} g</td>
					</tr>
					<tr class="border-t">
						<td class="p-2">Cholesterol</td>
						<td class="p-2">{data.product.cholesterol.toFixed(1)} mg</td>
						<td class="p-2">{scale(data.product.cholesterol, quantity).toFixed(1)} mg</td>
					</tr>
					<tr class="border-t">
						<td class="p-2">Sodium</td>
						<td class="p-2">{data.product.sodium.toFixed(1)} mg</td>
						<td class="p-2">{scale(data.product.sodium, quantity).toFixed(1)} mg</td>
					</tr>
					<tr class="border-t">
						<td class="p-2">Potassium</td>
						<td class="p-2">{data.product.potassium.toFixed(1)} mg</td>
						<td class="p-2">{scale(data.product.potassium, quantity).toFixed(1)} mg</td>
					</tr>
					<tr class="border-t">
						<td class="p-2">Calcium</td>
						<td class="p-2">{data.product.calcium.toFixed(1)} mg</td>
						<td class="p-2">{scale(data.product.calcium, quantity).toFixed(1)} mg</td>
					</tr>
					<tr class="border-t">
						<td class="p-2">Magnesium</td>
						<td class="p-2">{data.product.magnesium.toFixed(1)} mg</td>
						<td class="p-2">{scale(data.product.magnesium, quantity).toFixed(1)} mg</td>
					</tr>
					<tr class="border-t">
						<td class="p-2">Zinc</td>
						<td class="p-2">{data.product.zinc.toFixed(1)} mg</td>
						<td class="p-2">{scale(data.product.zinc, quantity).toFixed(1)} mg</td>
					</tr>
				</tbody>
			</table>
		</section>
		<div class="buttonContainer">
			<button type="submit" class="w-full px-6 py-2 font-bold"> Add to Diary </button>
		</div>
	</form>
</main>

<style>
	h1 {
		color: var(--color-white);
	}
	main p {
		color: var(--color-contrast);
	}
	.form {
		background-color: var(--color-background);
		border-radius: 8px;
		padding: 2rem;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	}
	.form div {
		color: var(--color-white);
	}
	.form section {
		color: var(--color-white);
		padding: 1rem;
		border-radius: 8px;
	}
	.form section div {
		color: var(--color-black);
		padding: 1rem;
		border-radius: 8px;
	}
	select,
	input {
		border: 2px solid transparent;
		background-image:
			linear-gradient(var(--color-background), var(--color-background)), var(--gradient-boost);
		background-origin: border-box;
		background-clip: padding-box, border-box;
	}
	button {
		color: var(--color-white);
		border-radius: 8px;
		cursor: pointer;
		background-color: var(--color-background2);
		transition: background-color 0.2s ease;
	}
	.buttonContainer {
		background-image: var(--gradient);
		border-radius: 0.5rem;
		padding: 2px;
	}
	button:hover {
		background-color: var(--color-gradient);
		color: var(--color-background2);
	}
</style>
