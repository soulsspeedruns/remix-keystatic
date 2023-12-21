import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { ComponentPropsWithoutRef } from 'react'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'

export function SearchButton({
	className,
	...props
}: ComponentPropsWithoutRef<'button'>) {
	return (
		<Button
			variant='outline'
			className={cn('w-full justify-start bg-background', className)}
			{...props}
		>
			<MagnifyingGlassIcon className='mr-2 h-4 w-4' />
			<span className='text-sm opacity-50'>Search...</span>
		</Button>
	)
}
