import { LoaderFunctionArgs } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'
import { Navbar } from '~/components/navbar'
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
		<>
			<Navbar className='fixed left-0 right-0 top-0 h-16 mr-[var(--removed-body-scroll-bar-size)]' />
			<Outlet />
			{branch && (
				<div>
					Draft mode ({branch}){' '}
					<form method='POST' action='/preview/end'>
						<button type='submit'>End preview</button>
					</form>
				</div>
			)}
		</>
	)
}
