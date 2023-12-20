import { createReader as _createReader } from '@keystatic/core/reader'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import keystaticConfig from '../../keystatic.config'

export function createReader() {
	return _createReader(process.cwd(), keystaticConfig)
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}
