import { Link } from '@remix-run/react'
import { ComponentPropsWithoutRef } from 'react'
import { Search } from '~/components/search'
import { SearchButton } from '~/components/search-button'
import { buttonVariants } from '~/components/ui/button'
import { cn } from '~/lib/utils'

export function Navbar({
	className,
	...props
}: ComponentPropsWithoutRef<'nav'>) {
	return (
		<nav
			{...props}
			className={cn(
				'border-b flex flex-col z-10 bg-transparent backdrop-filter backdrop-blur-sm bg-opacity-30',
				className,
			)}
		>
			<div className='container mx-auto grid flex-grow grid-cols-10 items-center py-2'>
				<div className='col-span-2 pr-2'>
					<a
						href='/'
						className={cn(
							buttonVariants({
								variant: 'secondary',
							}),
							'w-full',
						)}
					>
						<span className='hidden truncate xl:block'>Souls Speedrunning</span>
						<span className='xl:hidden'>SSC</span>
					</a>
				</div>
				<div className='col-span-6'>
					<Search />
				</div>
				<ul className='col-span-2 ml-auto flex items-center'>
					{/* {socials.map((social) => {
						const Icon = Icons[social.id]

						return (
							<li>
								<a
									href={social.data.link}
									target='_blank'
									className={buttonVariants({
										variant: 'ghost',
										size: 'icon',
									})}
								>
									<Icon className='h-4 w-4 fill-current' />
								</a>
							</li>
						)
					})} */}
					{/* <li>
						<ModeToggle />
					</li> */}
					<li>
						<Link
							to='/keystatic'
							target='_blank'
							className={buttonVariants({
								variant: 'outline',
							})}
						>
							Admin
						</Link>
					</li>
				</ul>
			</div>
		</nav>
	)
}
