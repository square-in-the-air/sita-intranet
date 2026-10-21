import type { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
  labels: { singular: 'Event', plural: 'What’s On' },
  admin: {
    group: 'Posts',
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'organiser'],
    description: 'Shown on the What’s On page and in the What’s On box on the homepage.',
  },
  access: {
    read: () => true,
  },
  defaultSort: 'date',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'date',
          type: 'date',
          required: true,
          admin: {
            width: '50%',
            date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMM yyyy' },
          },
        },
        {
          name: 'dayToBeConfirmed',
          label: 'Day not confirmed yet',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            width: '50%',
            description: 'Shows as “XX Nov 2026” until the exact day is known.',
          },
        },
      ],
    },
    {
      name: 'organiser',
      type: 'relationship',
      relationTo: 'people',
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        rows: 10,
        description: 'Write as much as you like. The What’s On cards show all of it.',
      },
    },
  ],
}
