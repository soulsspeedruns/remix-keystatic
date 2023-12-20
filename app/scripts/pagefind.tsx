import { DocumentRenderer } from '@keystatic/core/renderer'
import * as pagefind from 'pagefind'
import { renderToString } from 'react-dom/server'
import { createReader } from '~/lib/utils'

const { index } = await pagefind.createIndex({
	forceLanguage: 'en',
})

if (!index) {
	throw new Error('failed to create index')
}

const reader = createReader()

const pages = await reader.collections.pages.all({
	resolveLinkedFiles: true,
})

const promises = pages.map((page) => {
	const html = renderToString(
		<html lang='en'>
			<body>
				<DocumentRenderer document={page.entry.content} />
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
