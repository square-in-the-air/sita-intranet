import type { GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'

type Options = {
  slug: string
  label: string
  // Where the page lives on the site, e.g. '/hr'
  path: string
  // Adds an editable row of up to three numbered objectives above the sections
  objectives?: boolean
}

// A page made of titled sections, each holding a list of documents (HR and Resources pages)
export const buildDocumentPage = ({ slug, label, path, objectives }: Options): GlobalConfig => ({
  slug,
  label,
  access: {
    read: () => true,
  },
  admin: {
    group: 'Pages',
    description: `The sections and documents on the ${label} page. Drag sections to reorder them, then save.`,
  },
  hooks: {
    // Refresh the page on the front end as soon as it's saved
    afterChange: [
      () => {
        try {
          revalidatePath(path)
        } catch {
          // Not running inside Next (e.g. a seed script)
        }
      },
    ],
  },
  fields: [
    ...(objectives
      ? [
          {
            type: 'collapsible' as const,
            label: 'Objectives',
            admin: {
              description:
                'Up to three objectives shown side by side above the sections. They’re numbered 01, 02, 03 in the order they’re added.',
            },
            fields: [
              {
                type: 'row' as const,
                fields: [
                  {
                    name: 'objectivesHeading',
                    label: 'Heading',
                    type: 'text' as const,
                    defaultValue: 'Objectives',
                    maxLength: 40,
                    admin: { width: '50%' },
                  },
                  {
                    name: 'objectivesLabel',
                    label: 'Small label',
                    type: 'text' as const,
                    defaultValue: 'Where we’re heading',
                    maxLength: 40,
                    admin: { width: '50%', description: 'Optional. Shown to the right of the heading.' },
                  },
                ],
              },
              {
                name: 'objectives',
                type: 'array' as const,
                labels: { singular: 'Objective', plural: 'Objectives' },
                maxRows: 3,
                admin: {
                  initCollapsed: true,
                  components: { RowLabel: '/globals/components/NumberRowLabel#NumberRowLabel' },
                },
                fields: [
                  { name: 'title', type: 'text' as const, required: true, maxLength: 40 },
                  { name: 'text', type: 'textarea' as const, required: true, maxLength: 200 },
                ],
              },
            ],
          },
        ]
      : []),
    {
      name: 'sections',
      type: 'array',
      labels: { singular: 'Section', plural: 'Sections' },
      admin: {
        initCollapsed: true,
        components: { RowLabel: '/globals/components/NavRowLabel#NavRowLabel' },
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          maxLength: 60,
        },
        {
          name: 'intro',
          type: 'textarea',
          admin: { description: 'Optional. A short line shown under the section title.' },
        },
        {
          name: 'documents',
          type: 'array',
          labels: { singular: 'Document', plural: 'Documents' },
          admin: {
            initCollapsed: true,
            components: { RowLabel: '/globals/components/NavRowLabel#NavRowLabel' },
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              maxLength: 80,
              admin: { description: 'The name shown on the page.' },
            },
            {
              name: 'file',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Upload a document, or pick one already in the media library.' },
            },
            {
              name: 'link',
              type: 'text',
              admin: {
                description: 'Optional. Use instead of a file to link to a page on the Hub (e.g. /whats-on) or a full URL.',
              },
            },
          ],
        },
      ],
    },
  ],
})
