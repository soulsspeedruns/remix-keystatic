import { createCookie } from '@remix-run/node'
import { z } from 'zod'

const schema = z.string().min(1).nullable().catch(null)

const draftMode = createCookie('draft-mode', {
	maxAge: 60 * 60,
})

export async function parse(request: Request) {
	const cookieHeader = request.headers.get('Cookie')
	const raw = await draftMode.parse(cookieHeader)
	return schema.parse(raw)
}

export function serialize(input: z.infer<typeof schema>) {
	return draftMode.serialize(input)
}
