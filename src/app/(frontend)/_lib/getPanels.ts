import { getPayload } from 'payload'

import config from '@/payload.config'
import type { LinkPanel } from '../_components/LinkPanels'
import type { Objective } from '../_components/Objectives'

// Sections and documents are edited in Payload (HR, Finance and Resources pages).
// Returns null while the page has no sections so the caller can show its placeholder.
export async function getPanels(slug: 'hr' | 'finance' | 'resources'): Promise<LinkPanel[] | null> {
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

// Objectives are edited on the Resources page in Payload.
// Returns null while none are added so the caller can show its placeholder.
export async function getObjectives(): Promise<{
  heading: string
  label?: string
  items: Objective[]
} | null> {
  const payload = await getPayload({ config: await config })
  const page = await payload.findGlobal({ slug: 'resources', depth: 0 })

  if (!page.objectives?.length) return null

  return {
    heading: page.objectivesHeading || 'Objectives',
    label: page.objectivesLabel || undefined,
    items: page.objectives.map(({ title, text }) => ({ title, text })),
  }
}
