import type {
	DocumentElement,
	DocumentNode,
	DocumentText,
} from '@keystatic/core'
import slugify from '@sindresorhus/slugify'

type DocumentHeading = DocumentElement & {
	type: 'heading'
	level: 1 | 2 | 3 | 4 | 5 | 6
	id?: string
}

function isDocumentText(node: DocumentNode): node is DocumentText {
	return 'text' in node
}

function isDocumentHeading(node: DocumentNode): node is DocumentHeading {
	return node.type === 'heading'
}

function getDocumentTextChildren(node: DocumentElement): DocumentText[] {
	return node.children.flatMap((child) => {
		if (isDocumentText(child)) {
			return Array.of(child)
		}

		return getDocumentTextChildren(child)
	})
}

export function toFormatted(content: DocumentElement[]) {
	const slugs = new Set<string>()

	function slugifyUnique(content: string) {
		let tmp = content
		let attempts = 0

		while (true) {
			const slug = slugify(tmp)

			if (!slugs.has(slug)) {
				slugs.add(slug)
				return slug
			}

			tmp = `${content} ${++attempts}`
		}
	}

	const headings: {
		level: DocumentHeading['level']
		text: string
		slug: string
	}[] = []

	const processed = content.map((item) => {
		if (isDocumentHeading(item)) {
			const text = getDocumentTextChildren(item)
				.map((child) => child.text)
				.join(' ')

			if (!item.id) {
				item.id = slugifyUnique(text)
			}

			headings.push({
				level: item.level,
				slug: item.id,
				text,
			})
		}

		return item
	})

	return {
		content: processed,
		headings,
	}
}
