import * as pagefind from 'pagefind'
import { DocumentRenderer } from '@keystatic/core/renderer'
import { renderToString } from 'react-dom/server'
import { toFormatted } from '~/lib/markdoc.server'
import { createReader } from '@keystatic/core/reader'
import { games } from '~/collections/games'
import { pages } from '~/collections/pages'
import { navigation } from '~/singletons/navigation'

const { index } = await pagefind.createIndex({
	forceLanguage: 'en',
})

if (!index) {
	throw new Error('failed to create index')
}

const reader = createReader(process.cwd(), {
	storage: {
		kind: 'local',
	},
	collections: {
		pages,
		games,
	},
	singletons: {
		navigation,
	},
})

const allPages = await reader.collections.pages.all()

const promises = allPages.map(async (page) => {
	const raw = await page.entry.content()
	const { content } = toFormatted(raw)

	const html = renderToString(
		<html lang='en'>
			<body>
				<DocumentRenderer
					document={content}
					renderers={{
						block: {
							heading: ({ level, textAlign, ...props }) => {
								const Comp = `h${level}` as const
								return <Comp {...props} />
							},
						},
					}}
				/>
			</body>
		</html>,
	)

	return index.addHTMLFile({
		url: `/${page.slug}`,
		content: html,
		sourcePath: `app/content/pages/${page.slug}`,
	})
})

await Promise.all(promises)

await index.writeFiles({
	outputPath: 'public/pagefind',
})

process.exit()
