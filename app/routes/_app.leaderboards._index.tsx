import { Link, Outlet, useLoaderData } from '@remix-run/react'
import { createReader } from '~/lib/utils'

export async function loader() {
	const reader = createReader()
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
