import { cache } from 'react'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { defaultNavItems } from '@/globals/Navigation'

// Menu is edited in Payload (Globals → Navigation items). Falls back to the defaults if it's empty.
export const getNavLinks = cache(async () => {
  const payload = await getPayload({ config: await config })
  const nav = await payload.findGlobal({ slug: 'navigation', depth: 0 })
  const items = nav.items?.length ? nav.items : defaultNavItems
  return items.map(({ label, link }) => ({ label, href: link }))
})
