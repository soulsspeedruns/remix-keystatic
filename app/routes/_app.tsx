import { LoaderFunctionArgs } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'
import { Search } from '~/components/search'
import * as draftMode from '~/cookies/draft.server'
import keystaticConfig from '../../keystatic.config'

export async function loader({ request }: LoaderFunctionArgs) {
	const branch = await draftMode.parse(request)

	return {
		kind: keystaticConfig.storage.kind,
		branch,
	}
}

export default function App() {
	const { branch } = useLoaderData<typeof loader>()

	return (
		<div>
			<Search />
			<nav>
				<ul>
					<li>Hello</li>
				</ul>
			</nav>
			<Outlet />
			{branch && (
				<div>
					Draft mode ({branch}){' '}
					<form method='POST' action='/preview/end'>
						<button type='submit'>End preview</button>
					</form>
				</div>
			)}
		</div>
	)
}
