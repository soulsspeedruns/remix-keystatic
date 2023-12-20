import { fields, singleton } from '@keystatic/core'

export const navigation = singleton({
	label: 'Navigation',
	path: 'app/content/navigation',
	schema: {
		navGroups: fields.array(
			fields.object({
				groupName: fields.text({ label: 'Group name' }),
				items: fields.array(
					fields.object({
						label: fields.text({
							label: 'Label',
							description:
								"Required when using a URL, or overriding the page's title",
						}),
						link: fields.conditional(
							fields.select({
								label: 'Link type',
								options: [
									{ label: 'Page', value: 'page' },
									{ label: 'URL', value: 'url' },
									{ label: 'Coming soon (no link)', value: 'coming-soon' },
								],
								defaultValue: 'page',
							}),
							{
								page: fields.relationship({
									label: 'Page',
									collection: 'pages',
								}),
								url: fields.text({ label: 'URL' }),
								'coming-soon': fields.empty(),
							},
						),
						isNew: fields.checkbox({
							label: 'Is new?',
							description: 'Show a "new" badge next to this item',
							defaultValue: false,
						}),
					}),
					{
						label: 'Navigation items',
						itemLabel: (props) => props.fields.label.value,
					},
				),
			}),
			{
				label: 'Navigation groups',
				itemLabel: (props) => props.fields.groupName.value,
			},
		),
	},
})
