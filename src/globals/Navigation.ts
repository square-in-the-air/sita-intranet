import type { GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'

// Default menu, used to pre-fill the admin and as the front-end fallback
export const defaultNavItems = [
  { label: 'News', link: '/news' },
  { label: 'Resources', link: '/resources' },
  { label: 'HR', link: '/hr' },
  { label: 'Inspo board', link: '/inspo-board' },
  { label: 'Kudos board', link: '/kudos-board' },
  { label: 'What’s on', link: '/whats-on' },
]

// Main menu in the site header
export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Navigation items',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Options',
    description: 'The main menu in the site header. Drag to reorder, edit a link, then save.',
  },
  hooks: {
    // Refresh the header on the front end as soon as the menu is saved
    afterChange: [
      () => {
        try {
          revalidatePath('/', 'layout')
        } catch {
          // Not running inside Next (e.g. a seed script)
        }
      },
    ],
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      labels: { singular: 'Item', plural: 'Items' },
      defaultValue: defaultNavItems,
      minRows: 1,
      admin: {
        initCollapsed: true,
        components: { RowLabel: '/globals/components/NavRowLabel#NavRowLabel' },
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          maxLength: 30,
        },
        {
          name: 'link',
          type: 'text',
          required: true,
          admin: { description: 'A page on the Hub (e.g. /whats-on) or a full URL.' },
        },
      ],
    },
  ],
}
