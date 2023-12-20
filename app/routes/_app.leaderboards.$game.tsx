import { LoaderFunctionArgs } from '@remix-run/node'
import { ClientLoaderFunctionArgs, Link, useLoaderData } from '@remix-run/react'

async function fetchGame({
	params,
}: Pick<ClientLoaderFunctionArgs, 'params'>): Promise<string> {
	if (!params.game) {
		throw new Response(null, {
			status: 400,
		})
	}

	const resp = await fetch(
		`https://www.speedrun.com/api/v1/games/${params.game}`,
	)

	return await resp.json()
}

export async function loader({ params }: LoaderFunctionArgs) {
	return await fetchGame({ params })
}

export async function clientLoader({ params }: ClientLoaderFunctionArgs) {
	return await fetchGame({ params })
}

export default function Leaderboard() {
	const lmao = useLoaderData<typeof loader>()
	return <pre>{JSON.stringify(lmao, null, 2)}</pre>
}
