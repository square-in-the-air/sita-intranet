import { buildPostCollection } from './postCollection'

// Posts for the Kudos board
export const Kudos = buildPostCollection({
  slug: 'kudos',
  labels: { singular: 'Kudos post', plural: 'Kudos board' },
  urlPath: 'kudos-board',
  group: 'Posts',
  titleDescription: 'Who the kudos is for, e.g. “Tom & Kiane”.',
  authorDescription: 'Who is giving the kudos.',
  excerptDescription: 'The kudos message shown on the cards. Keep it to a sentence or two.',
  extraFields: [
    {
      name: 'recipients',
      type: 'relationship',
      relationTo: 'people',
      hasMany: true,
      admin: { description: 'Their photos (or initials) are shown on the kudos card.' },
    },
  ],
})
