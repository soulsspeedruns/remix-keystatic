import { DocumentRenderer } from '@keystatic/core/renderer'
import { LoaderFunctionArgs } from '@remix-run/node'
import {
	Link,
	MetaFunction,
	isRouteErrorResponse,
	useLoaderData,
	useRouteError,
} from '@remix-run/react'
import * as draftMode from '~/cookies/draft.server'
import { toFormatted } from '~/lib/markdoc.server'
import { createReader } from '~/lib/utils'
import keystaticConfig from '../../keystatic.config'

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	if (data) {
		const { title } = data

		return [
			{ title: `${title} - Souls Speedruns` },
			{ name: 'description', content: 'Welcome to Souls Speedruns!' },
		]
	}

	return [
		{ title: 'Souls Speedruns' },
		{ name: 'description', content: 'Welcome to Souls Speedruns!' },
	]
}

export async function loader({ request, params }: LoaderFunctionArgs) {
	const slug = params['*']
	const reader = await createReader(request)

	if (!slug) {
		throw new Response(null, {
			status: 400,
		})
	}

	const page = await reader.collections.pages.read(slug, {
		resolveLinkedFiles: true,
	})

	if (!page) {
		throw new Response(null, {
			status: 404,
			statusText: 'page not found',
		})
	}

	const { content, headings } = toFormatted(page.content)

	const branch = await draftMode.parse(request)
	const kind = keystaticConfig.storage.kind

	let editUrl = '/keystatic'

	if (kind === 'github') {
		editUrl += `/branch/${branch ? encodeURIComponent(branch) : 'main'}`
	}

	editUrl = `${editUrl}/collection/pages/item/${encodeURIComponent(slug)}`

	return {
		title: page.title,
		editUrl,
		content,
		headings,
	}
}

export default function Page() {
	const { title, content, editUrl, headings } = useLoaderData<typeof loader>()

	return (
		<div className='flex gap-3'>
			<article className='prose max-w-none'>
				<h1>{title}</h1>
				<DocumentRenderer
					document={content}
					renderers={{
						inline: {
							link: ({ href, children }) => <Link to={href}>{children}</Link>,
						},
						block: {
							heading: ({ level, textAlign, ...props }) => {
								const Comp = `h${level}` as const
								return <Comp {...props} />
							},
						},
					}}
				/>
				<Link to={editUrl}>Edit this page</Link>
			</article>
			<aside>
				<h2>On this page</h2>
				<ul>
					{headings.map(({ level, text, slug }) => (
						<li key={text}>
							<a href={`#${slug}`}>{text}</a>
						</li>
					))}
				</ul>
			</aside>
		</div>
	)
}

export function ErrorBoundary() {
	const error = useRouteError()

	if (isRouteErrorResponse(error)) {
		return (
			<div>
				<h1>Oops</h1>
				<p>Status: {error.status}</p>
				<p>{error.data.message}</p>
			</div>
		)
	}

	const errorMessage = 'Unknown error'

	return (
		<div>
			<h1>Uh oh ...</h1>
			<p>Something went wrong.</p>
			<pre>{errorMessage}</pre>
		</div>
	)
}
