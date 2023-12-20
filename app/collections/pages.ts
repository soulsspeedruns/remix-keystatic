import { collection, fields } from '@keystatic/core'

export const pages = collection({
	label: 'Pages',
	slugField: 'title',
	path: 'app/content/pages/**',
	previewUrl: '/preview/start?branch={branch}&to=/{slug}',
	entryLayout: 'content',
	format: {
		contentField: 'content',
	},
	schema: {
		title: fields.slug({
			name: {
				label: 'Title',
			},
		}),
		content: fields.document({
			label: 'Content',
			formatting: true,
			dividers: true,
			links: true,
			tables: true,
			images: {
				directory: 'app/assets/images/docs',
				publicPath: '../assets/images/docs',
			},
		}),
	},
})
