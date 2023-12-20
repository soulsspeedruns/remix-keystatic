import { LoaderFunctionArgs } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'
import { createReader } from '~/lib/utils'

export async function loader({ request }: LoaderFunctionArgs) {
	const reader = await createReader(request)
	const navigation = await reader.singletons.navigation.readOrThrow()

	return {
		navigation,
	}
}

export default function Page() {
	const { navigation } = useLoaderData<typeof loader>()

	return (
		<div className='flex gap-3'>
			<aside>
				<ul>
					{navigation?.navGroups.map((group, key) => (
						<li key={`${group.groupName}_${key}`}>{group.groupName}</li>
					))}
				</ul>
			</aside>
			<Outlet />
		</div>
	)
}
