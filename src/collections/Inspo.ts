import { buildPostCollection } from './postCollection'

// Posts for the Inspo board
export const Inspo = buildPostCollection({
  slug: 'inspo',
  labels: { singular: 'Inspo post', plural: 'Inspo board' },
  urlPath: 'inspo-board',
  group: 'Posts',
  authorDescription: 'Shown above the title on the cards.',
  extraFields: [
    {
      name: 'link',
      type: 'text',
      required: true,
      admin: {
        description:
          'Where the card goes when it’s clicked. A full URL (https://…) opens in a new tab, or use a Hub page such as /resources. Inspo posts don’t have a page of their own.',
      },
    },
  ],
})
