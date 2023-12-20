import { ActionFunctionArgs, redirect } from '@remix-run/node'
import * as draftMode from '~/cookies/draft.server'

export async function action({ request }: ActionFunctionArgs) {
	if (request.headers.get('origin') !== new URL(request.url).origin) {
		return new Response('Invalid origin', { status: 400 })
	}

	const referrer = request.headers.get('Referer')

	if (!referrer) {
		return new Response('Missing Referer', { status: 400 })
	}

	throw redirect(referrer, {
		headers: {
			'Set-Cookie': await draftMode.serialize(null),
		},
	})
}
