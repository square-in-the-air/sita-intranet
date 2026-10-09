// Site search used by /search. Searches the Hub pages/forms index, published
// news and the People directory, and tags each result with a section so the
// results page can filter by Company / HR / Finance / Health & Safety.

import { getPayload } from 'payload'

import config from '@/payload.config'
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

  const [news, people] = await Promise.all([
    payload.find({
      collection: 'news',
      where: {
        and: [
          { _status: { equals: 'published' } },
          { or: [{ title: { like: q } }, { excerpt: { like: q } }] },
        ],
      },
      sort: '-publishedDate',
      limit: 20,
      depth: 0,
    }),
    payload.find({
      collection: 'people',
      where: { or: [{ name: { like: q } }, { jobTitle: { like: q } }] },
      sort: 'firstName',
      limit: 20,
      depth: 0,
    }),
  ])

  const hubResults = hubIndex.filter((item) =>
    matches(q, item.title, item.summary, item.type, item.keywords),
  )

  const newsResults: SearchResult[] = news.docs.map((doc) => ({
    id: `news-${doc.id}`,
    section: 'company',
    type: 'News',
    title: doc.title,
    summary: truncate(doc.excerpt?.trim() || richTextToPlainText(doc.content), 140),
    href: doc.slug ? `/news/${doc.slug}` : '/news',
    breadcrumb: ['Hub', 'News', doc.title],
  }))

  const peopleResults: SearchResult[] = people.docs.map((person) => ({
    id: `person-${person.id}`,
    section: 'people',
    type: departmentLabels[person.department] ?? 'Person',
    title: person.name || `${person.firstName} ${person.lastName}`,
    summary: person.jobTitle,
    href: `mailto:${person.workEmail}`,
    breadcrumb: ['Hub', 'People', person.name || person.firstName],
  }))

  // Drop the matching-only keywords before returning
  const hub = hubResults.map(({ keywords: _keywords, ...result }) => result)

  return [...hub, ...newsResults, ...peopleResults]
}
