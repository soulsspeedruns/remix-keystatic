import type { MetaFunction } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { createReader } from '~/lib/utils'

export const meta: MetaFunction<typeof loader> = () => {
	return [
		{ title: 'Souls Speedruns' },
		{ name: 'description', content: 'Welcome to Souls Speedruns!' },
	]
}

export async function loader() {
	const reader = createReader()
	const posts = await reader.collections.pages.all()

	return {
		posts,
	}
}

export default function Index() {
	const { posts } = useLoaderData<typeof loader>()

	return (
		<div>
			<ul>
				{posts.map((post) => (
					<li key={post.slug}>
						<Link to={`/${post.slug}`}>{post.entry.title}</Link>
					</li>
				))}
			</ul>
		</div>
	)
}
