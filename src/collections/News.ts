import type { CollectionConfig } from 'payload'

const formatSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

export const News: CollectionConfig = {
  slug: 'news',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'department', 'publishedDate', '_status'],
  },
  versions: {
    drafts: true,
  },
  access: {
    // Logged-in editors can read drafts in the admin panel.
    // Everyone else only ever sees published posts.
    read: ({ req }) => {
      if (req.user) return true
      return {
        _status: {
          equals: 'published',
        },
      }
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'people',
      admin: {
        position: 'sidebar',
        description: 'Shown above the title on news cards.',
      },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'Auto-generated from the title. Used in the news URL.',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (value) return formatSlug(value)
            if (data?.title) return formatSlug(data.title)
            return value
          },
        ],
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      admin: {
        description: 'Short summary shown on news cards. Keep it to a sentence or two.',
      },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'department',
      type: 'select',
      defaultValue: 'all',
      options: [
        { label: 'All departments', value: 'all' },
        { label: 'Activation', value: 'activation' },
        { label: 'Creative', value: 'creative' },
        { label: 'Design', value: 'design' },
        { label: 'PR', value: 'pr' },
        { label: 'Social', value: 'social' },
        { label: 'Video', value: 'video' },
      ],
    },
    {
      name: 'publishedDate',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
  ],
}
