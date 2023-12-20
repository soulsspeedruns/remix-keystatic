import { LoaderFunctionArgs, redirect } from '@remix-run/node'
import * as draftMode from '~/cookies/draft.server'

export async function loader({ request }: LoaderFunctionArgs) {
	const url = new URL(request.url)
	const params = url.searchParams
	const branch = params.get('branch')
	const to = params.get('to')

	if (!branch || !to) {
		return new Response('Missing branch or to params', { status: 400 })
	}

	const toUrl = new URL(to, url.origin)
	toUrl.protocol = url.protocol
	toUrl.host = url.host

	throw redirect(toUrl.toString(), {
		headers: {
			'Set-Cookie': await draftMode.serialize(branch),
		},
	})
}
