import { makePage } from '@keystatic/remix/ui'
import { UpdateIcon } from '@radix-ui/react-icons'
import { ClientOnly } from 'remix-utils/client-only'
import config from '../../keystatic.config'

const ClientPage = makePage(config)

const string = `
let theme = localStorage.getItem('keystatic-color-scheme')

if (theme === 'auto' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    theme = 'dark'
}

document.getElementById("loading")?.setAttribute('data-theme', theme)
`

export default function Keystatic() {
	return (
		<ClientOnly
			fallback={
				<div
					id='loading'
					className='flex items-center justify-center w-full h-screen data-[theme="light"]:bg-white data-[theme="light"]:text-[#2c2c2c] data-[theme="dark"]:bg-[#1F1F1F] data-[theme="dark"]:text-[#e3e3e3]'
					// data-theme won't be ssr'd but will be rendered into the client by our inline script tag
					suppressHydrationWarning
				>
					<script
						// biome-ignore lint/security/noDangerouslySetInnerHtml: used to get theme asap
						dangerouslySetInnerHTML={{ __html: string }}
					/>
					<div>
						<UpdateIcon className='animate-spin' />
					</div>
				</div>
			}
		>
			{() => <ClientPage />}
		</ClientOnly>
	)
}
