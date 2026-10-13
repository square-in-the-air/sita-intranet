// Site search used by /search. Searches the Hub pages/forms index, published
// news and the People directory, and tags each result with a section so the
// results page can filter by Company / HR / Finance / Health & Safety.

import { getPayload, type Where } from 'payload'

import config from '@/payload.config'
import { quickLinks as placeholderQuickLinks } from '../_components/home/placeholderData'
import { hubIndex } from '../_components/search/hubIndex'
import { richTextToPlainText, truncate } from './excerpt'
import { departmentLabels } from './departments'

export type SearchSection = 'company' | 'hr' | 'finance' | 'health-safety' | 'people'

export type SearchResult = {
  id: string
  section: SearchSection
  type: string
  title: string
  summary: string
  href: string
  breadcrumb: string[]
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
    and: [
      { _status: { equals: 'published' } },
      { or: [{ title: { like: q } }, { excerpt: { like: q } }] },
    ],
  }
  const postQuery = {
    where: postWhere,
    sort: '-publishedDate',
    limit: 20,
    depth: 0,
  }

  const [news, inspo, kudos, people] = await Promise.all([
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
      summary: item.href === '#' ? '' : item.href,
      href: item.href,
      breadcrumb: ['Hub', 'Quick links', item.label],
    }))

  // A quick link replaces any placeholder index entry with the same name
  const quickLinkTitles = new Set(quickLinkItems.map((item) => item.label.trim().toLowerCase()))
  const hubResults = hubIndex.filter(
    (item) =>
      !quickLinkTitles.has(item.title.trim().toLowerCase()) &&
      matches(q, item.title, item.summary, item.type, item.keywords),
  )

  const toResult = (
    doc: (typeof news.docs)[number],
    kind: { id: string; type: string; path: string },
  ): SearchResult => ({
    id: `${kind.id}-${doc.id}`,
    section: 'company',
    type: kind.type,
    title: doc.title,
    summary: truncate(doc.excerpt?.trim() || richTextToPlainText(doc.content), 140),
    href: doc.slug ? `/${kind.path}/${doc.slug}` : `/${kind.path}`,
    breadcrumb: ['Hub', kind.type, doc.title],
  })

  const newsResults = [
    ...news.docs.map((doc) => toResult(doc, { id: 'news', type: 'News', path: 'news' })),
    ...inspo.docs.map((doc) => toResult(doc, { id: 'inspo', type: 'Inspo board', path: 'inspo-board' })),
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

  // Drop the matching-only keywords before returning
  const hub = hubResults.map(({ keywords: _keywords, ...result }) => result)

  return [...quickLinkResults, ...hub, ...newsResults, ...peopleResults]
}
