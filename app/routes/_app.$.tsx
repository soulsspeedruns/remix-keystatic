import { DocumentRenderer } from '@keystatic/core/renderer'
import { LoaderFunctionArgs } from '@remix-run/node'
import { Link, MetaFunction, useLoaderData } from '@remix-run/react'
import { createReader } from '~/lib/utils'

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	if (data) {
		const { page } = data

		return [
			{ title: `${page.title} - Souls Speedruns` },
			{ name: 'description', content: 'Welcome to Souls Speedruns!' },
		]
	}

	return [
		{ title: 'Souls Speedruns' },
		{ name: 'description', content: 'Welcome to Souls Speedruns!' },
	]
}

export async function loader({ params }: LoaderFunctionArgs) {
	const reader = createReader()

	if (!params['*']) {
		throw new Response(null, {
			status: 400,
		})
	}

	const [navigation, page] = await Promise.all([
		reader.singletons.navigation.readOrThrow(),
		reader.collections.pages.readOrThrow(params['*'], {
			resolveLinkedFiles: true,
		}),
	])

	return {
		slug: params['*'],
		page,
		navigation,
	}
}

export default function Page() {
	const { slug, page, navigation } = useLoaderData<typeof loader>()

	return (
		<div>
			<aside>
				<ul>
					{navigation?.navGroups.map((group, key) => (
						<li key={`${group.groupName}_${key}`}>{group.groupName}</li>
					))}
				</ul>
			</aside>
			<Link to={`/keystatic/collection/pages/item/${encodeURIComponent(slug)}`}>
				Edit this page
			</Link>
			<h1>{page.title}</h1>
			<DocumentRenderer
				document={page.content}
				renderers={{
					inline: {
						link: ({ href, children }) => <Link to={href}>{children}</Link>,
					},
				}}
			/>
		</div>
	)
}
