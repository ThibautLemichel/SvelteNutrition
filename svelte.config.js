//import adapter from '@sveltejs/adapter-vercel';
//import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import preprocess from 'svelte-preprocess';
import vercel from '@sveltejs/adapter-vercel';

const config = {
	preprocess: preprocess({
		postcss: true
	}),
	kit: { adapter: vercel() }
};

export default config;
