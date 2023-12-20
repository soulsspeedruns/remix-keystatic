import { config } from '@keystatic/core'
import { games } from '~/collections/games'
import { pages } from '~/collections/pages'
import { navigation } from '~/singletons/navigation'

export default config({
	storage: import.meta.env.DEV
		? {
				kind: 'local',
		  }
		: {
				kind: 'github',
				repo: 'soulsspeedruns/remix-keystatic',
				branchPrefix: 'wiki/',
		  },
	ui: {
		brand: { name: 'Souls Speedruns' },
	},
	collections: {
		pages,
		games,
	},
	singletons: {
		navigation,
	},
})
