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
		<main className='container mx-auto mt-16 grid grid-cols-10'>
			<aside className="fixed top-16 col-span-2 hidden h-[calc(100vh-theme('spacing.16'))] w-full border-r py-2 pr-2 md:sticky md:block">
				<ul>
					{navigation?.navGroups.map((group, key) => (
						<li key={`${group.groupName}_${key}`}>{group.groupName}</li>
					))}
				</ul>
			</aside>
			<div className='col-span-8'>
				<Outlet />
			</div>
		</main>
	)
}
