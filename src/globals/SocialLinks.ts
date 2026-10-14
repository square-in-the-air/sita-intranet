import type { GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'

// Square in the Air's profiles (from the footer of squareintheair.com). Pre-fill the
// admin and are used on the homepage until a link is saved.
export const defaultSocialLinks = {
  linkedin: 'https://www.linkedin.com/company/square-in-the-air/',
  x: 'https://x.com/squareintheair',
  instagram: 'https://www.instagram.com/squareintheair/',
}

// LinkedIn, X and Instagram icons next to the Quick links title on the homepage
export const SocialLinks: GlobalConfig = {
  slug: 'social-links',
  label: 'Social links',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Options',
    description: 'The social icons next to the Quick links title on the homepage. Paste the full URL for each.',
  },
  hooks: {
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
      name: 'linkedin',
      defaultValue: defaultSocialLinks.linkedin,
      label: 'LinkedIn',
      type: 'text',
      admin: { description: 'e.g. https://www.linkedin.com/company/your-company' },
    },
    {
      name: 'x',
      defaultValue: defaultSocialLinks.x,
      label: 'X',
      type: 'text',
      admin: { description: 'e.g. https://x.com/your-account' },
    },
    {
      name: 'instagram',
      defaultValue: defaultSocialLinks.instagram,
      label: 'Instagram',
      type: 'text',
      admin: { description: 'e.g. https://www.instagram.com/your-account' },
    },
  ],
}
