import { LoaderFunctionArgs } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'
import { createReader } from '~/lib/utils'

import type { Entry } from '@keystatic/core/reader'
import keystaticConfig from 'keystatic.config'
import { Navigation } from '~/components/navigation'

type Page = Extract<
	Entry<
		(typeof keystaticConfig)['singletons']['navigation']
	>['items'][number]['item'],
	{ discriminant: 'page' }
>

export async function loader({ request }: LoaderFunctionArgs) {
	const reader = await createReader(request)
	const navigation = await reader.singletons.navigation.readOrThrow()

	async function resolveLinkedPage(item: Page) {
		if (!item.value.label) {
			const page = await reader.collections.pages.readOrThrow(item.value.slug)

			return {
				discriminant: item.discriminant,
				value: {
					slug: item.value.slug,
					label: page.title,
				},
			}
		}

		return item
	}

	const items = await Promise.all(
		navigation.items.map(async ({ item, children }) => {
			return {
				item:
					item.discriminant === 'page' ? await resolveLinkedPage(item) : item,
				children: await Promise.all(
					children.map(async (item) => {
						return item.discriminant === 'page'
							? await resolveLinkedPage(item)
							: item
					}),
				),
			} as const
		}),
	)

	return {
		items,
	}
}

export default function WikiLayout() {
	const { items } = useLoaderData<typeof loader>()

	return (
		<main className='container mx-auto mt-16 grid grid-cols-10'>
			<aside className="fixed top-16 col-span-2 hidden h-[calc(100vh-theme('spacing.16'))] w-full border-r py-2 pr-2 md:sticky md:block">
				<Navigation items={items} />
			</aside>
			<div className='col-span-8'>
				<Outlet />
			</div>
		</main>
	)
}
