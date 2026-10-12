import type { GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'

// Default links, used to pre-fill the admin and as the front-end fallback
export const defaultQuickLinks = [
  { label: 'Google', link: 'https://www.google.com', style: 'highlight' },
  { label: 'SITA website', link: '#', style: 'dark' },
  { label: 'Book holiday', link: '#', style: 'default' },
  { label: 'Prep a 1-2-1', link: '#', style: 'default' },
  { label: 'Send an invoice', link: '#', style: 'default' },
  { label: 'Company resources', link: '/resources', style: 'default' },
  { label: 'Access OneDrive', link: '#', style: 'default' },
  { label: 'Who’s off today?', link: '#', style: 'default' },
]

// Quick links grid on the homepage
export const QuickLinks: GlobalConfig = {
  slug: 'quick-links',
  label: 'Quick links',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Options',
    description: 'The quick links on the homepage. Drag to reorder, edit a link, then save.',
  },
  hooks: {
    // Refresh the homepage as soon as the links are saved
    afterChange: [
      () => {
        try {
          revalidatePath('/', 'page')
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
      labels: { singular: 'Link', plural: 'Links' },
      defaultValue: defaultQuickLinks,
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
          admin: { description: 'A page on the Hub (e.g. /resources) or a full URL.' },
        },
        {
          name: 'style',
          type: 'select',
          defaultValue: 'default',
          options: [
            { label: 'Default', value: 'default' },
            { label: 'Highlight (orange)', value: 'highlight' },
            { label: 'Dark', value: 'dark' },
          ],
        },
      ],
    },
  ],
}
