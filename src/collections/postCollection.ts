import type { CollectionConfig, Field } from 'payload'

const formatSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

type Options = {
  slug: string
  labels?: CollectionConfig['labels']
  // Where the posts live on the site, e.g. 'news'
  urlPath: string
  // Sidebar group in the admin
  group: string
  titleDescription?: string
  authorDescription: string
  // Extra fields placed after the title
  extraFields?: Field[]
  // Set false for posts that use their own images field instead of a single hero image
  heroImage?: boolean
}

// Shared setup for post types (News, Inspo board, Kudos board) so they all behave the same:
// drafts, publish date, author, hero image and rich text content.
export const buildPostCollection = ({
  slug,
  labels,
  urlPath,
  group,
  titleDescription,
  authorDescription,
  extraFields = [],
  heroImage = true,
}: Options): CollectionConfig => ({
  slug,
  ...(labels ? { labels } : {}),
  admin: {
    group,
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
      ...(titleDescription ? { admin: { description: titleDescription } } : {}),
    },
    ...extraFields,
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'people',
      admin: {
        position: 'sidebar',
        description: authorDescription,
      },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
        description: `Auto-generated from the title. Used in the /${urlPath} URL.`,
      },
      hooks: {
        // Duplicating a post gets its own slug, so several copies of one post don't clash
        beforeDuplicate: [
          ({ value }) =>
            typeof value === 'string' && value
              ? `${value}-copy-${Math.random().toString(36).slice(2, 6)}`
              : undefined,
        ],
        beforeValidate: [
          ({ value, data }) => {
            if (value) return formatSlug(value)
            if (data?.title) return formatSlug(data.title)
            return value
          },
        ],
      },
    },
    ...(heroImage
      ? [
          {
            name: 'heroImage',
            type: 'upload' as const,
            relationTo: 'media' as const,
          },
        ]
      : []),
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
})
