import { cache } from 'react'
import { getPayload } from 'payload'

import config from '@/payload.config'

// Cached so the header and footer share a single lookup per request.
export const getLogo = cache(async () => {
  const payload = await getPayload({ config: await config })

  const { docs } = await payload.find({
    collection: 'media',
    where: {
      filename: {
        equals: 'SITA_Primary_Light.svg',
      },
    },
    limit: 1,
  })

  return docs[0] ?? null
})
