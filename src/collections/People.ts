import type { CollectionConfig } from 'payload'

export const People: CollectionConfig = {
  slug: 'people',
  labels: { singular: 'Employee', plural: 'Employees' },
  admin: {
    group: 'Users',
    useAsTitle: 'name',
    defaultColumns: ['lastName', 'firstName', 'jobTitle', 'department', 'workEmail'],
  },
  access: {
    // Directory contains work emails, so keep it to logged-in staff rather than
    // public like News.
    read: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'headshot',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },
    {
      // Stored (not virtual) so it can be used as admin.useAsTitle. Payload only
      // allows a virtual field as the title when it's linked to a relationship.
      // Kept in sync with firstName/lastName on every save and hidden from the
      // edit form so nobody edits it directly.
      name: 'name',
      type: 'text',
      admin: {
        hidden: true,
      },
      hooks: {
        beforeChange: [
          ({ siblingData }) => `${siblingData.firstName ?? ''} ${siblingData.lastName ?? ''}`.trim(),
        ],
      },
    },
    {
      name: 'jobTitle',
      type: 'text',
      required: true,
    },
    {
      name: 'department',
      type: 'select',
      required: true,
      options: [
        { label: 'Activation', value: 'activation' },
        { label: 'B2B PR', value: 'b2b-pr' },
        { label: 'Consumer PR', value: 'consumer-pr' },
        { label: 'Creative', value: 'creative' },
        { label: 'Design', value: 'design' },
        { label: 'Management', value: 'management' },
        { label: 'PR', value: 'pr' },
        { label: 'Social', value: 'social' },
        { label: 'Video', value: 'video' },
      ],
    },
    {
      name: 'workEmail',
      type: 'email',
      unique: true,
      admin: { description: 'Add when known. Used to match a login to this person and for the search result link.' },
    },
    {
      name: 'shortBio',
      type: 'textarea',
      admin: {
        description: 'A couple of sentences for the profile page. Written by the person themselves where possible.',
      },
    },
    {
      name: 'startDate',
      type: 'date',
      admin: {
        description: 'Drives the new starter box and the month’s work anniversaries on the What’s On page.',
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'd MMM yyyy',
        },
      },
    },
    {
      name: 'birthday',
      type: 'date',
      admin: {
        description:
          'Pick the year, month and day. Shows in the month’s birthdays on the What’s On page. Leave blank if they’d rather it wasn’t shown.',
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'd MMM yyyy',
        },
      },
    },
    {
      type: 'collapsible',
      label: 'New starter',
      admin: {
        initCollapsed: true,
        description: 'Shown in the New starters box on the What’s On page around their start date.',
      },
      fields: [
        {
          name: 'newStarterIntro',
          label: 'Intro line',
          type: 'text',
          maxLength: 80,
          admin: {
            description: 'e.g. “Joining the video and creative team.” Defaults to their department.',
          },
        },
        {
          name: 'newStarterSlide',
          label: 'New starter slide',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Upload the intro slide (PDF, PowerPoint or image). The box links to it.',
          },
        },
      ],
    },
  ],
}
