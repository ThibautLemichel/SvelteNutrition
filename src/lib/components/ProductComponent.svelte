<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { goto } from '$app/navigation';
	import plusUrl from '../../../static/plus.svg';

	export let id: number; // product ID
	export let name: string;
	export let quantity: number = 100;
	export let energy: number | undefined;
	export let meal_type: string = 'breakfast'; // default or pass from parent

	const dispatch = createEventDispatcher();

	// When the user clicks anywhere on the container (except the +), navigate
	function onContainerClick() {
		goto(`/addproduct/product/${id}`);
	}

	// When the user clicks on +
	function onPlusClick(event: MouseEvent) {
		event.stopPropagation();
		if(energy === undefined) {
			dispatch('add', { id, name, quantity, energy, meal_type });
		}
	}
</script>

<div
	class="product-component relative cursor-pointer bg-white shadow-md"
	on:click={onContainerClick}
>
	<h2 class="text-1xl text-left font-bold">{name}</h2>

	<div class="flex items-center text-sm text-gray-600">
		{#if quantity !== undefined}
			<span>Quantity: {quantity} g</span>
		{/if}
		{#if quantity !== undefined && energy !== undefined}
			<span class="mx-2">|</span>
		{/if}
		{#if energy !== undefined}
			<span>Energy: {energy} kcal</span>
		{/if}
	</div>

	<div
		class="absolute top-1/2 right-1.5 -translate-y-1/2 rounded-full bg-blue-500"
		style="margin-right: 5px;"
		on:click={onPlusClick}
		aria-label="Add this product to diary"
	>
		<img src={plusUrl} alt="Plus" style="width: 24px; height: 24px;" />
	</div>
</div>

<style>
	.product-component {
		border: 1px solid #ddd;
		padding: 1rem;
		border-radius: 8px;
		margin-bottom: 1rem;
		background: #fafafa;
	}
	h2 {
		margin: 0 0 0.5rem 0;
	}
</style>
