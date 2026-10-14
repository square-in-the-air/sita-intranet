import type { GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'

// Site logo shown in the header and footer
export const Logo: GlobalConfig = {
  slug: 'logo',
  label: 'Logo',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Options',
    description:
      'The logo in the site header and footer, plus a separate dark version for the admin panel. Pick or upload a new image, then save.',
  },
  hooks: {
    // Refresh the header and footer on the front end as soon as the logo is saved
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
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: { description: 'Use a light-coloured SVG or PNG with a transparent background.' },
    },
    {
      name: 'adminImage',
      label: 'Alternative logo (admin panel)',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'Shown in the admin sidebar and dashboard, which have a light background. Use a dark-coloured SVG or PNG with a transparent background. Leave empty to use SITA_Primary_Dark.svg.',
      },
    },
  ],
}
