import { createReader as _createReader } from '@keystatic/core/reader'
import { createGitHubReader } from '@keystatic/core/reader/github'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import * as draftMode from '~/cookies/draft.server'
import * as githubAccessToken from '~/cookies/github.server'
import keystaticConfig from '../../keystatic.config'

export async function createReader(request: Request) {
	const branch = await draftMode.parse(request)

	if (branch) {
		const token = await githubAccessToken.parse(request)

		if (!token) {
			throw new Error('github access token missing')
		}

		return createGitHubReader(keystaticConfig, {
			repo: 'soulsspeedruns/remix-keystatic',
			ref: branch,
			token,
		})
	}

	return createLocalReader()
}

export function createLocalReader() {
	return _createReader(process.cwd(), keystaticConfig)
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}
