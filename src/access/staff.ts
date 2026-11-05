import type { Access, Where } from 'payload'

import { auth, authBypassed } from '@/auth'

// The proxy keeps signed out visitors off the pages but lets /api through for Payload,
// so these are the real checks next to the data. They only apply to the REST and GraphQL
// API: the front end reads through the local API, which skips access rules.

// Signed in to Payload (editors) or with a SITA Microsoft account (staff).
export const isStaffOrEditor = async ({ req }: Parameters<Access>[0]): Promise<boolean> =>
  Boolean(req.user) || authBypassed || Boolean(await auth())

export const staffOrEditor: Access = isStaffOrEditor

// Media: staff and editors see everything. Signed out visitors only get the logo,
// because the sign in page shows it.
export const staffEditorOrLogo: Access = async (args) => {
  if (await isStaffOrEditor(args)) return true

  const { image } = await args.req.payload.findGlobal({ slug: 'logo', depth: 0, req: args.req })
  const logo: Where[] = [{ filename: { equals: 'SITA_Primary_Light.svg' } }]
  if (image) logo.push({ id: { equals: typeof image === 'object' ? image.id : image } })

  return { or: logo }
}
