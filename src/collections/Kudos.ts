import { buildPostCollection } from './postCollection'

// Posts for the Kudos board. Same fields as the Inspo board.
export const Kudos = buildPostCollection({
  slug: 'kudos',
  labels: { singular: 'Kudos post', plural: 'Kudos board' },
  urlPath: 'kudos-board',
  group: 'Posts',
  authorDescription: 'Shown above the title on the cards.',
})
