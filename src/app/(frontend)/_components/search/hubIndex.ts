// Placeholder search index for Hub pages, policies and forms.
// Swap for a payload.find() across the real collections once the Company,
// HR, Finance and Health & Safety content lives in Payload.

import type { SearchResult } from '../../_lib/search'

type HubEntry = Omit<SearchResult, 'id' | 'breadcrumb'> & { keywords?: string }

export type HubResult = SearchResult & { keywords?: string }

// TODO: replace '#' links with the real pages / documents
const entries: HubEntry[] = [
  {
    section: 'hr',
    type: 'How-to',
    title: 'Submit expenses',
    summary: 'Claim back money spent on company business – receipts, approval and when you’re paid.',
    href: '#',
    keywords: 'expenses receipts claim reimburse',
  },
  {
    section: 'finance',
    type: 'How-to',
    title: 'Claim mileage',
    summary: 'Business journeys in your own vehicle: log each trip and add it to your expenses claim.',
    href: '#',
    keywords: 'expenses mileage car travel',
  },
  {
    section: 'finance',
    type: 'Form',
    title: 'Mileage form',
    summary: 'Log date, from/to, reason and miles for each business journey.',
    href: '#',
    keywords: 'expenses mileage form',
  },
  {
    section: 'finance',
    type: 'Deadline',
    title: 'Expenses & mileage cut-off',
    summary: 'Submit claims by [day each month] to be paid with that month’s salary.',
    href: '#',
    keywords: 'expenses mileage deadline payroll',
  },
  {
    section: 'finance',
    type: 'How-to',
    title: 'Send an invoice',
    summary: 'How to raise an invoice and who needs to approve it.',
    href: '#',
    keywords: 'invoice billing',
  },
  {
    section: 'hr',
    type: 'How-to',
    title: 'Book holiday',
    summary: 'Request annual leave in Teamseer and check how many days you have left.',
    href: '#',
    keywords: 'holiday annual leave time off teamseer',
  },
  {
    section: 'hr',
    type: 'Policy',
    title: 'Holiday policy',
    summary: 'Your holiday allowance, carry-over rules and bank holidays.',
    href: '#',
    keywords: 'holiday annual leave allowance',
  },
  {
    section: 'hr',
    type: 'Policy',
    title: 'Sickness absence',
    summary: 'Who to tell, when you need a fit note and how sick pay works.',
    href: '#',
    keywords: 'sick illness absence',
  },
  {
    section: 'hr',
    type: 'How-to',
    title: 'Prep a 1-2-1',
    summary: 'Get ready for your 1-2-1 in Appraisd – objectives, notes and actions.',
    href: '#',
    keywords: 'appraisd one to one review objectives',
  },
  {
    section: 'company',
    type: 'Page',
    title: 'Company objectives',
    summary: 'Where we’re heading this year and how we’ll measure it.',
    href: '/resources#objectives',
    keywords: 'objectives goals strategy',
  },
  {
    section: 'company',
    type: 'Page',
    title: 'Branded templates',
    summary: 'Decks, letterheads and documents in the SITA brand.',
    href: '/resources',
    keywords: 'templates brand powerpoint',
  },
  {
    section: 'health-safety',
    type: 'Policy',
    title: 'Fire safety',
    summary: 'Fire exits, assembly point and who our fire marshals are.',
    href: '#',
    keywords: 'fire evacuation marshal',
  },
  {
    section: 'health-safety',
    type: 'Form',
    title: 'Report an accident',
    summary: 'Log an accident or near miss in the office or on a shoot.',
    href: '#',
    keywords: 'accident injury first aid near miss',
  },
]

const sectionNames: Record<string, string> = {
  company: 'Company',
  hr: 'HR',
  finance: 'Finance',
  'health-safety': 'Health & Safety',
}

export const hubIndex: HubResult[] = entries.map((entry, i) => ({
  ...entry,
  id: `hub-${i}`,
  breadcrumb: ['Hub', sectionNames[entry.section], entry.title],
}))
