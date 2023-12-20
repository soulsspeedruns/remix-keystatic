export interface Pagefind {
	search: (query: string) => Promise<PagefindResponse>
}

export interface PagefindResponse {
	results: PagefindResult[]
}

export interface PagefindResult {
	id: string
	data: () => Promise<PagefindDocument>
}

export interface PagefindDocument {
	url: string
	raw_url: string
	excerpt: string
	filters: {
		author: string
	}
	meta: {
		title: string
		image: string
	}
	content: string
	word_count: number
}

declare global {
	interface Window {
		pagefind: Pagefind
	}
}

export async function importPagefind(): Promise<Pagefind> {
	const url = new URL('/pagefind/pagefind.js', import.meta.url).href
	return await import(/* @vite-ignore */ url).catch(() => ({
		search: async () => ({ results: [] }),
	}))
}
