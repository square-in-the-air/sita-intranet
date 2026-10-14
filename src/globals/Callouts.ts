import type { GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'

// Defaults, used to pre-fill the admin and as the front-end fallback
export const defaultCallouts = {
  feedback: {
    title: 'Anonymous company feedback link',
    text: 'Think we could improve in an area? Let us know anonymously!',
    link: '#',
  },
  itProblem: {
    title: 'Report an IT problem',
    text: 'Something not working? Send us an email and we’ll get it sorted.',
    email: 'andrew@squareintheair.com',
  },
}

// Yellow call-out boxes under What's On on the homepage
export const Callouts: GlobalConfig = {
  slug: 'callouts',
  label: 'Call-out boxes',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Options',
    description: 'The yellow boxes under What’s On on the homepage.',
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
      name: 'feedback',
      label: 'Anonymous feedback box',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          defaultValue: defaultCallouts.feedback.title,
          maxLength: 60,
        },
        {
          name: 'text',
          type: 'textarea',
          required: true,
          defaultValue: defaultCallouts.feedback.text,
          maxLength: 120,
        },
        {
          name: 'link',
          type: 'text',
          required: true,
          defaultValue: defaultCallouts.feedback.link,
          admin: { description: 'Where the box goes, e.g. the feedback form URL.' },
        },
      ],
    },
    {
      name: 'itProblem',
      label: 'IT problem box',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          defaultValue: defaultCallouts.itProblem.title,
          maxLength: 60,
        },
        {
          name: 'text',
          type: 'textarea',
          required: true,
          defaultValue: defaultCallouts.itProblem.text,
          maxLength: 120,
        },
        {
          name: 'email',
          type: 'email',
          required: true,
          defaultValue: defaultCallouts.itProblem.email,
          admin: { description: 'Clicking the box opens a new email to this address.' },
        },
      ],
    },
  ],
}
