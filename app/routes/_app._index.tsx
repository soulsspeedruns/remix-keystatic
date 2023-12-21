import { DiscordLogoIcon } from '@radix-ui/react-icons'
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { ArrowRightIcon } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { createReader } from '~/lib/utils'

export const meta: MetaFunction<typeof loader> = () => {
	return [
		{ title: 'Souls Speedruns' },
		{ name: 'description', content: 'Welcome to Souls Speedruns!' },
	]
}

export async function loader({ request }: LoaderFunctionArgs) {
	const reader = await createReader(request)
	const games = await reader.collections.games.all()

	return {
		games,
	}
}

export default function Index() {
	const { games } = useLoaderData<typeof loader>()

	return (
		<main className='container mx-auto mt-16 py-2'>
			<div className='px-2 py-12 sm:px-6 lg:px-8'>
				<div className='mx-auto max-w-2xl text-center'>
					<h2 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'>
						The reference for
						<br />
						Souls Speedrunning
					</h2>
				</div>
				<div className='mt-10 flex items-center justify-center gap-x-2'>
					<Button variant='outline' asChild>
						<a
							href='discord.soulsspeedruns.com'
							target='_blank'
							rel='noreferrer'
							className='flex items-center gap-2'
						>
							<DiscordLogoIcon className='h-4 w-4 fill-current' />
							Discord
						</a>
					</Button>
					<Button variant='outline' asChild>
						<Link
							to='/getting-started'
							className='group flex items-center gap-2'
						>
							Getting started
							<ArrowRightIcon className='h-4 w-4 transition-transform group-hover:translate-x-1' />
						</Link>
					</Button>
				</div>
			</div>
			<section className='grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3'>
				{games.map((game) => (
					<a
						href={`/${game.entry.homepage}`}
						rel='prefetch'
						className='group relative aspect-video overflow-hidden rounded-lg'
					>
						<div className='absolute inset-0 bg-black' />
						{game.entry.assets.background && (
							<img
								src={game.entry.assets.background}
								width={240}
								height={135}
								alt={game.entry.name}
								className='h-full w-full scale-100 object-fill transition-transform duration-100 group-hover:scale-105'
							/>
						)}
						<div className='absolute inset-0 flex items-center justify-center bg-black/25 p-6 text-center'>
							<h2 className='text-xl font-bold text-white'>
								{game.entry.name}
							</h2>
						</div>
					</a>
				))}
			</section>
		</main>
	)
}
