import { LoaderFunctionArgs } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { createReader } from '~/lib/utils'

export async function loader({ request }: LoaderFunctionArgs) {
	const reader = await createReader(request)
	const games = await reader.collections.games.all()

	return {
		games,
	}
}

export default function LeaderboardsIndex() {
	const { games } = useLoaderData<typeof loader>()

	return (
		<div>
			<ul>
				{games.map((game) => (
					<li key={game.slug}>
						<Link to={`/leaderboards/${game.slug}`}>{game.entry.name}</Link>
					</li>
				))}
			</ul>
		</div>
	)
}
