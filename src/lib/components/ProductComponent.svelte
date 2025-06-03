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

	const colors = ['#3490e4', '#ff9675', '#9363ff', '#ff6a73'];
	// Pick a random color index for each instance
	const colorIndex = Math.floor(Math.random() * colors.length);

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
	class="product-component relative cursor-pointer shadow-md"
	style="background: {colors[colorIndex]}"

	on:click={onContainerClick}
>
	<h2 class="text-1xl text-left font-bold">{name}</h2>

	<div class="flex items-center text-sm">
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
		class="plus absolute top-1/2 right-1.5 -translate-y-1/2 rounded-full"
		style="margin-right: 5px;"
		on:click={onPlusClick}
		aria-label="Add this product to diary"
	>
		<img src={plusUrl} alt="Plus" style="width: 35px; padding: 4px;"/>
	</div>
</div>

<style>
	.product-component {
		border: 1px solid #ddd;
		padding: 1rem;
		border-radius: 8px;
		margin-bottom: 1rem;
	}
	h2 {
		margin: 0 0 0.5rem 0;
		  color: var(--color-white);
	}
	.plus {
border-radius: 50%;
fill: white;
background-color: var(--color-contrast);
opacity: 1;
 }
 .plus:hover {
	transition: ease-in-out 0.2s;
  	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
 }
 .product-component div {
  color: var(--color-contrast);
 }
</style>
