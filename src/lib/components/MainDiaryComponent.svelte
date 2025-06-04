<script lang="ts">
	export let title: string;
</script>

<div class="diary-container">
	<div class="diary-title text-2xl font-bold">{title.toUpperCase()}</div>
	<div class="diary-content">
		<slot />
	</div>
</div>

<style>
	.diary-container {
		max-width: 100%;
		background: var(--color-background);
		border-radius: 1rem;
		box-shadow:
			0 2px 12px rgba(0, 0, 0, 0.08),
			0 1.5px 4px rgba(0, 0, 0, 0.06);
		margin-bottom: 2rem;
		overflow: hidden;
	}

	.diary-title {
		position: sticky;
		color: var(--color-white);
		top: 0;
		z-index: 2;
		padding: 1rem 1.5rem;
		border-bottom: 1px solid var(--color-contrast);
		border-top-left-radius: 1rem;
		border-top-right-radius: 1rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
	}

	.diary-content {
		padding: 1.5rem;
	}
</style>
