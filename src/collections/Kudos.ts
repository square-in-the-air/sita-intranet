import { buildPostCollection } from './postCollection'

// Posts for the Kudos board. Same fields as the Inspo board.
export const Kudos = buildPostCollection({
  slug: 'kudos',
  labels: { singular: 'Kudos post', plural: 'Kudos board' },
  urlPath: 'kudos-board',
  group: 'Posts',
  authorDescription: 'Shown above the title on the cards.',
  heroImage: false,
  extraFields: [
    {
      name: 'gallery',
      label: 'Images',
      type: 'array',
      labels: { singular: 'Image', plural: 'Images' },
      admin: {
        description:
          'The top of the post page is split equally between these images. The first one is used on the cards.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
  ],
})
