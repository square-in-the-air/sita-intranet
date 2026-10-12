import { buildPostCollection } from './postCollection'

export const News = buildPostCollection({
  slug: 'news',
  urlPath: 'news',
  group: 'Posts',
  authorDescription: 'Shown above the title on news cards.',
  excerptDescription: 'Short summary shown on news cards. Keep it to a sentence or two.',
})
