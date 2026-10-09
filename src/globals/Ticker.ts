import type { GlobalConfig } from 'payload'

// Scrolling orange banner at the top of the homepage
export const Ticker: GlobalConfig = {
  slug: 'ticker',
  label: 'Ticker',
  access: {
    read: () => true,
  },
  admin: {
    description: 'The scrolling banner at the top of the homepage.',
  },
  fields: [
    {
      name: 'enabled',
      label: 'Show the ticker',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'messages',
      type: 'array',
      labels: { singular: 'Message', plural: 'Messages' },
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
          maxLength: 80,
        },
        {
          name: 'link',
          type: 'text',
          admin: { description: 'Optional. A page on the Hub (e.g. /whats-on) or a full URL.' },
        },
      ],
    },
  ],
}
