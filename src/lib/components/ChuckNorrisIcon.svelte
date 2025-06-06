<script lang="ts">
	import { onDestroy } from 'svelte';
	let iconSrc = '/ChuckNorris.png';
	let clicked = false;
	let joke: string | null = null;
	let exploded = false;
	let removed = false;

	let explodeTimeout: ReturnType<typeof setTimeout>;
	let removeTimeout: ReturnType<typeof setTimeout>;

	async function handleClick() {
		if (clicked) return;

		clicked = true;

		// Fetch API
		try {
			const res = await fetch('https://api.chucknorris.io/jokes/random');
			const data = await res.json();
			joke = data.value;
		} catch (err) {
			joke = "Oops, couldn't fetch a joke.";
		}

		// After 10s, trigger explosion
		explodeTimeout = setTimeout(() => {
			exploded = true;
			// After explosion animation (~800ms), remove component
			removeTimeout = setTimeout(() => {
				removed = true;
			}, 800);
		}, 10000);
	}

	onDestroy(() => {
		clearTimeout(explodeTimeout);
		clearTimeout(removeTimeout);
	});
</script>

{#if !removed}
	<div class="relative inline-block">
		<div
			class="flex h-16 w-16 items-end justify-center overflow-visible rounded-full bg-gradient-to-br from-red-500 via-orange-400 to-yellow-400 {clicked
				? 'clicked'
				: ''} {exploded ? 'explode' : ''}"
		>
			<img
				src={iconSrc}
				alt="Chuck Norris"
				class="icon w-16 {clicked ? 'clicked' : ''} {exploded ? 'explode' : ''}"
				on:click={handleClick}
			/>
		</div>

		{#if joke && !exploded}
			<div class="bubble">
				{joke}
			</div>
		{/if}
	</div>
{/if}

<style>
	.icon {
		cursor: pointer;
		transition: transform 0.2s ease;
	}

	.clicked {
		animation: pop 0.3s ease forwards;
	}

	@keyframes pop {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.2);
		}
		100% {
			transform: scale(1);
		}
	}

	.explode {
		animation: explodeAnim 0.8s ease forwards;
	}

	@keyframes explodeAnim {
		to {
			transform: scale(3);
			opacity: 0;
		}
	}

	.bubble {
		position: absolute;
		bottom: 100%;
		left: 50%;
		transform: translateX(-90%);
		background: white;
		border: 1px solid #ccc;
		border-radius: 0.75rem;
		padding: 0.75rem 1rem;
		max-width: 300px;
		width: max-content;
		white-space: normal;
		word-wrap: break-word;
		text-align: left;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
		margin-bottom: 0.75rem;
		z-index: 5;
		font-size: 0.9rem;
		line-height: 1.3;
	}

	.bubble::after {
		content: '';
		position: absolute;
		top: 100%;
		left: 90%;
		transform: translateX(-90%);
		border-width: 8px;
		border-style: solid;
		border-color: white transparent transparent transparent;
	}
</style>
