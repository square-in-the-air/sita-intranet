// Site search used by /search. Searches quick links, HR/Resources documents, published
// news and the People directory, and tags each result with a section so the
// results page can filter by Company / HR / Finance / Health & Safety.

import { getPayload, type Where } from 'payload'

import config from '@/payload.config'
import { quickLinks as placeholderQuickLinks } from '../_components/home/placeholderData'
import { richTextToPlainText, truncate } from './excerpt'
import { departmentLabels } from './departments'
import { getPanels } from './getPanels'

export type SearchSection = 'company' | 'hr' | 'finance' | 'health-safety' | 'people'

export type SearchResult = {
  id: string
  section: SearchSection
  type: string
  title: string
  summary: string
  href: string
  breadcrumb: string[]
  // Label on the result's button: files say "View", posts say "Read more", everything else "See more"
  action?: 'view' | 'read-more' | 'see-more'
}

// Filter tabs, in order. People only appears when there are people results.
export const searchSections: { value: SearchSection; label: string; alwaysShow: boolean }[] = [
  { value: 'company', label: 'Company', alwaysShow: true },
  { value: 'hr', label: 'HR', alwaysShow: true },
  { value: 'finance', label: 'Finance', alwaysShow: true },
  { value: 'health-safety', label: 'Health & Safety', alwaysShow: true },
  { value: 'people', label: 'People', alwaysShow: false },
]

export const isSearchSection = (value: unknown): value is SearchSection =>
  searchSections.some((s) => s.value === value)

const terms = (query: string) => query.toLowerCase().split(/\s+/).filter(Boolean)

// Every word in the query has to appear somewhere in the entry
const matches = (query: string, ...fields: (string | null | undefined)[]) => {
  const haystack = fields.filter(Boolean).join(' ').toLowerCase()
  return terms(query).every((t) => haystack.includes(t))
}

export async function search(query: string): Promise<SearchResult[]> {
  const q = query.trim()
  if (!q) return []

  const payload = await getPayload({ config: await config })

  const postWhere: Where = {
    and: [{ _status: { equals: 'published' } }, { title: { like: q } }],
  }
  const postQuery = {
    where: postWhere,
    sort: '-publishedDate',
    limit: 20,
    depth: 0,
  }

  const [news, inspo, kudos, people, hrPanels, financePanels, resourcePanels] = await Promise.all([
    payload.find({ collection: 'news', ...postQuery }),
    payload.find({ collection: 'inspo', ...postQuery }),
    payload.find({ collection: 'kudos', ...postQuery }),
    payload.find({
      collection: 'people',
      where: { or: [{ name: { like: q } }, { jobTitle: { like: q } }] },
      sort: 'firstName',
      limit: 20,
      depth: 0,
    }),
    getPanels('hr'),
    getPanels('finance'),
    getPanels('resources'),
  ])

  // Quick links come from Payload (Options → Quick links), same as the homepage,
  // and open the link they're set up with
  const quickLinksGlobal = await payload.findGlobal({ slug: 'quick-links', depth: 0 })
  const quickLinkItems = quickLinksGlobal.items?.length
    ? quickLinksGlobal.items.map(({ label, link }) => ({ label, href: link }))
    : placeholderQuickLinks.map(({ label, href }) => ({ label, href }))

  const quickLinkResults: SearchResult[] = quickLinkItems
    .filter((item) => matches(q, item.label, 'quick link'))
    .map((item, i) => ({
      id: `quick-link-${i}`,
      section: 'company',
      type: 'Quick link',
      title: item.label,
      summary: '',
      href: item.href,
      breadcrumb: ['Hub', 'Quick links', item.label],
    }))

  // Documents in the HR, Finance and Resources page boxes. Only the document name is
  // searched, not the box title or intro text.
  const panelResults = (
    [
      { id: 'hr', section: 'hr', name: 'HR', panels: hrPanels },
      { id: 'finance', section: 'finance', name: 'Finance', panels: financePanels },
      { id: 'resources', section: 'company', name: 'Resources', panels: resourcePanels },
    ] as const
  ).flatMap(({ id, section, name, panels }) =>
    (panels ?? []).flatMap((panel, p) =>
      panel.links
        .filter((link) => matches(q, link.label))
        .map((link, i): SearchResult => ({
          id: `${id}-panel-${p}-${i}`,
          section,
          type: panel.title,
          title: link.label,
          summary: '',
          href: link.href,
          breadcrumb: ['Hub', name, panel.title, link.label],
          action: link.newTab ? 'view' : 'see-more',
        })),
    ),
  )

  const toResult = (
    doc: (typeof news.docs)[number],
    kind: { id: string; type: string; path: string },
  ): SearchResult => ({
    id: `${kind.id}-${doc.id}`,
    section: 'company',
    type: kind.type,
    title: doc.title,
    summary: truncate(richTextToPlainText(doc.content), 140),
    href: doc.slug ? `/${kind.path}/${doc.slug}` : `/${kind.path}`,
    breadcrumb: ['Hub', kind.type, doc.title],
    action: 'read-more',
  })

  const newsResults = [
    ...news.docs.map((doc) => toResult(doc, { id: 'news', type: 'News', path: 'news' })),
    // Inspo posts have no page of their own, so results go straight to their link
    ...inspo.docs.map((doc) => ({
      ...toResult(doc, { id: 'inspo', type: 'Inspo board', path: 'inspo-board' }),
      href: doc.link || '/inspo-board',
      action: 'see-more' as const,
    })),
    ...kudos.docs.map((doc) => toResult(doc, { id: 'kudos', type: 'Kudos board', path: 'kudos-board' })),
  ]

  const peopleResults: SearchResult[] = people.docs.map((person) => ({
    id: `person-${person.id}`,
    section: 'people',
    type: departmentLabels[person.department] ?? 'Person',
    title: person.name || `${person.firstName} ${person.lastName}`,
    summary: person.jobTitle,
    href: person.workEmail ? `mailto:${person.workEmail}` : '#',
    breadcrumb: ['Hub', 'People', person.name || person.firstName],
  }))

  return [...quickLinkResults, ...panelResults, ...newsResults, ...peopleResults]
}
