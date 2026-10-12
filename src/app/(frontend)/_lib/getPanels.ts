import { getPayload } from 'payload'

import config from '@/payload.config'
import type { LinkPanel } from '../_components/LinkPanels'

// Sections and documents are edited in Payload (HR and Resources → HR / Resources).
// Returns null while the page has no sections so the caller can show its placeholder.
export async function getPanels(slug: 'hr' | 'resources'): Promise<LinkPanel[] | null> {
  const payload = await getPayload({ config: await config })
  const page = await payload.findGlobal({ slug, depth: 2 })

  if (!page.sections?.length) return null

  return page.sections.map((section) => ({
    title: section.title,
    intro: section.intro ?? undefined,
    links: (section.documents ?? []).flatMap((doc) => {
      const file = doc.file && typeof doc.file === 'object' ? doc.file : null
      const href = file?.url || doc.link
      return href ? [{ label: doc.label, href, newTab: Boolean(file?.url) }] : []
    }),
  }))
}
