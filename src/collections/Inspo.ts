import { buildPostCollection } from './postCollection'

// Posts for the Inspo board
export const Inspo = buildPostCollection({
  slug: 'inspo',
  labels: { singular: 'Inspo post', plural: 'Inspo board' },
  urlPath: 'inspo-board',
  group: 'Posts',
  authorDescription: 'Shown above the title on the cards.',
})
