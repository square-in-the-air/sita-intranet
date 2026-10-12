import { cache } from 'react'
import { getPayload } from 'payload'

import config from '@/payload.config'

// Logo is edited in Payload (Globals → Logo). Cached so the header and footer share one lookup per request.
export const getLogo = cache(async () => {
  const payload = await getPayload({ config: await config })

  const { image } = await payload.findGlobal({ slug: 'logo', depth: 1 })
  if (image && typeof image === 'object') return image

  // Nothing chosen yet: fall back to the original logo file
  const { docs } = await payload.find({
    collection: 'media',
    where: { filename: { equals: 'SITA_Primary_Light.svg' } },
    limit: 1,
  })

  return docs[0] ?? null
})
