import type { SerializeFrom } from '@remix-run/node'
import { useRouteLoaderData as _useRouteLoaderData } from '@remix-run/react'
import type { loader } from '~/routes/_app'

type Routes = {
	'routes/_app': typeof loader
}

export function useRouteLoaderData<Key extends keyof Routes>(key: Key) {
	return _useRouteLoaderData(key) as SerializeFrom<Routes[Key]>
}
