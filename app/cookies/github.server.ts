import { parse as _parse } from 'cookie'
import { z } from 'zod'

const name = 'keystatic-gh-access-token'

const schema = z.string().min(1)

export async function parse(request: Request) {
	const cookieHeader = request.headers.get('Cookie')
	if (!cookieHeader) return null

	const cookies = _parse(cookieHeader)
	return name in cookies ? (cookies[name] === '' ? '' : cookies[name]) : null
}
