import { unstable_vitePlugin as remix } from '@remix-run/dev'
import autoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
	plugins: [
		remix(),
		tsconfigPaths(),
		autoImport({
			imports: ['react'],
		}),
	],
	build: {
		rollupOptions: {
			external: ['/pagefind/pagefind.js'],
		},
	},
})
