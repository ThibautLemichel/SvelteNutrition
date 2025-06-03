<script lang="ts">
	export let name: string;
	export let quantity: number;
	export let metric: string;
	export let energy: number;
	export let entryId: number | string;
</script>

<div class="entry-item">
	<div class="entry-info">
		<div class="entry-name">{name}</div>
		<div class="entry-quantity">{quantity} {metric}</div>
		<div class="entry-energy">{Math.round(energy)} kcal</div>
	</div>
	<form method="POST">
		<input type="hidden" name="deleteEntry" value={entryId} />
		<button type="submit" name="delete" class="delete-btn">×</button>
	</form>
</div>

<style>
	.entry-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: #f9f9f9;
		padding: 1rem;
		border-radius: 0.75rem;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
		margin-bottom: 1rem;
		transition: background 0.2s ease;
	}

	.entry-item:hover {
		background: #f1f1f1;
	}

	.entry-info {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.entry-name {
		font-weight: 600;
		font-size: 1.1rem;
	}

	.entry-quantity,
	.entry-energy {
		font-size: 0.9rem;
		color: #555;
	}

	.delete-btn {
		font-size: 1.2rem;
		color: #e74c3c;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.25rem;
		transition:
			transform 0.15s ease,
			color 0.15s ease;
	}

	.delete-btn:hover {
		color: #c0392b;
		transform: scale(1.2);
	}
</style>
