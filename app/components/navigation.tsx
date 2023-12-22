import type { Entry } from '@keystatic/core/reader'
import { Link } from '@remix-run/react'
import keystaticConfig from 'keystatic.config'
import { Fragment } from 'react'

type NavigationItem = Entry<
	(typeof keystaticConfig)['singletons']['navigation']
>['items'][number]

export type Props = {
	items: NavigationItem[]
}

export function Navigation({ items }: Props) {
	if (items.length === 0) {
		return null
	}

	return (
		<ul>
			{items.map(({ item, children }, key) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: the list doesn't get rerendered
				<Fragment key={key}>
					<li>
						<NavigationItem item={item} />
					</li>
					{children.length > 0 && (
						<ul className='ml-4'>
							{children.map((child, key) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: the list doesn't get rerendered
								<li key={key}>
									<NavigationItem item={child} />
								</li>
							))}
						</ul>
					)}
				</Fragment>
			))}
		</ul>
	)
}

function NavigationItem({ item }: { item: Props['items'][number]['item'] }) {
	if (item.discriminant === 'group') {
		return <>{item.value.name}</>
	}

	if (item.discriminant === 'url') {
		return (
			<a
				href={item.value.url}
				target={item.value.newTab ? '_blank' : undefined}
			>
				{item.value.label}
			</a>
		)
	}

	return <Link to={`/${item.value.slug}`}>{item.value.label}</Link>
}
