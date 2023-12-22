import { useNavigate } from '@remix-run/react'
import { useHydrated } from 'remix-utils/use-hydrated'
import { SearchButton } from '~/components/search-button'
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '~/components/ui/command'
import { type PagefindDocument, importPagefind } from '~/lib/pagefind'

export function Search() {
	const hydrated = useHydrated()
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

		open && loadPagefind()
	}, [open])

	useEffect(() => {
		function onKeyDown(event: KeyboardEvent) {
			if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
				setOpen((open) => !open)
			}
		}

		window.addEventListener('keydown', onKeyDown)
		return () => window.removeEventListener('keydown', onKeyDown)
	}, [])

	return (
		<>
			<SearchButton disabled={!hydrated} onClick={() => setOpen(true)} />
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

						console.log(awaited)

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
									className='h-14 cursor-pointer overflow-hidden truncate'
									onSelect={() => {
										navigate(result.data.url)
										setOpen(false)
									}}
								>
									<span
										className='whitespace-nowrap [&_mark]:bg-transparent [&_mark]:text-current [&_mark]:underline [&_mark]:underline-offset-2'
										// biome-ignore lint/security/noDangerouslySetInnerHtml: results from pagefind
										dangerouslySetInnerHTML={{ __html: result.data.excerpt }}
									/>
								</CommandItem>
							))}
						</CommandGroup>
					)}
				</CommandList>
			</CommandDialog>
		</>
	)
}
