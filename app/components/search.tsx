import { useNavigate } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { ClientOnly } from 'remix-utils/client-only'
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '~/components/ui/command'
import { type PagefindDocument, importPagefind } from '~/lib/pagefind'

function ClientSearch() {
	const navigate = useNavigate()
	const [open, setOpen] = useState(false)
	const [results, setResults] = useState<
		{ id: string; data: PagefindDocument }[]
	>([])

	useEffect(() => {
		async function loadPagefind() {
			if (typeof window.pagefind === 'undefined') {
				window.pagefind = await importPagefind()
			}
		}

		loadPagefind()
	}, [])

	useEffect(() => {
		function onKeyDown(event: KeyboardEvent) {
			if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
				setOpen(!open)
			}
		}

		window.addEventListener('keydown', onKeyDown)
		return () => window.removeEventListener('keydown', onKeyDown)
	}, [open])

	return (
		<CommandDialog open={open} onOpenChange={setOpen} shouldFilter={false}>
			<CommandInput
				onInput={async (e) => {
					const search = await window.pagefind.search(e.currentTarget.value)

					const awaited = await Promise.all(
						search?.results.map(async (result) => ({
							...result,
							data: await result.data(),
						})),
					)

					setResults(awaited)
				}}
				placeholder='Type a command or search...'
			/>
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>
				{results.length > 0 && (
					<CommandGroup heading='Suggestions'>
						{results.map((result) => (
							<CommandItem
								key={result.id}
								onSelect={() => {
									navigate(result.data.raw_url)
									setOpen(false)
								}}
							>
								<span
									// biome-ignore lint/security/noDangerouslySetInnerHtml: results from pagefind
									dangerouslySetInnerHTML={{ __html: result.data.excerpt }}
								/>
							</CommandItem>
						))}
					</CommandGroup>
				)}
			</CommandList>
		</CommandDialog>
	)
}

export function Search() {
	return <ClientOnly fallback={null}>{() => <ClientSearch />}</ClientOnly>
}
