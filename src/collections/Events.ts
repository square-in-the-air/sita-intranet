import type { CollectionConfig } from 'payload'

import { wordCap } from '../fields/wordCap'

// Word caps keep the cards on the What's On page an even size
export const EVENT_TITLE_WORDS = 8
export const EVENT_DESCRIPTION_WORDS = 50

export const Events: CollectionConfig = {
  slug: 'events',
  labels: { singular: 'Event', plural: 'Events' },
  admin: {
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
      validate: wordCap(EVENT_TITLE_WORDS),
      admin: { description: `Max ${EVENT_TITLE_WORDS} words.` },
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
      validate: wordCap(EVENT_DESCRIPTION_WORDS),
      admin: { description: `Max ${EVENT_DESCRIPTION_WORDS} words.` },
    },
  ],
}
