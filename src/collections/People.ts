import type { CollectionConfig } from 'payload'

export const People: CollectionConfig = {
  slug: 'people',
  admin: {
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
        { label: 'Creative', value: 'creative' },
        { label: 'Design', value: 'design' },
        { label: 'PR', value: 'pr' },
        { label: 'Social', value: 'social' },
        { label: 'Video', value: 'video' },
      ],
    },
    {
      name: 'workEmail',
      type: 'email',
      required: true,
      unique: true,
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
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
  ],
}
