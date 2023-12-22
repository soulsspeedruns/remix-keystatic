import { collection, fields } from '@keystatic/core'

function previewUrl(to: string) {
	if (process.env.NODE_ENV === 'development') return to
	return `/preview/start?branch={branch}&to=${to}`
}

export const pages = collection({
	label: 'Pages',
	slugField: 'title',
	path: 'app/content/pages/**',
	previewUrl: previewUrl('/{slug}'),
	entryLayout: 'content',
	format: {
		contentField: 'content',
	},
	schema: {
		title: fields.slug({
			name: {
				label: 'Title',
				validation: {
					length: {
						min: 0,
					},
				},
			},
			slug: {
				validation: {
					length: {
						min: 0,
					},
				},
			},
		}),
		content: fields.document({
			label: 'Content',
			formatting: true,
			dividers: true,
			links: true,
			tables: true,
			images: {
				directory: 'public/pages',
				publicPath: '/pages',
			},
		}),
	},
})
