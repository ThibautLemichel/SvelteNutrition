import adapter from '@sveltejs/adapter-vercel';
//import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import preprocess from 'svelte-preprocess';

const config = {
	preprocess: preprocess({
		postcss: true
	}),
	kit: { adapter: adapter() }
};

export default config;
