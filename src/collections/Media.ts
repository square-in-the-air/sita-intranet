import type { CollectionConfig } from 'payload'

import { staffEditorOrLogo } from '@/access/staff'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Options',
  },
  access: {
    read: staffEditorOrLogo,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}
