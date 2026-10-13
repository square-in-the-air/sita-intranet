// Placeholder content for the homepage sections that don't have a Payload
// collection yet. Swap each of these for a payload.find() call once the
// matching collection (or global, for quick links) exists.

import type { QuickLink } from './QuickLinks'

// TODO: replace the '#' links with the real URLs
export const quickLinks: QuickLink[] = [
  { label: 'Google', href: 'https://www.google.com', variant: 'highlight' },
  { label: 'SITA website', href: '#', variant: 'dark' },
  { label: 'Book holiday', href: '#' },
  { label: 'Prep a 1-2-1', href: '#' },
  { label: 'Send an invoice', href: '#' },
  { label: 'Company resources', href: '/resources' },
  { label: 'Access OneDrive', href: '#' },
  { label: 'Who’s off today?', href: '#' },
]

const inspoText =
  'If AI has changed anything, it\u2019s the value of originality. When any brand or agency can now generate mass content at scale by punching commands into ChatGPT, the only real differentiator is authoritative information that doesn\u2019t already exist\u2026'

// Shown until messages are added in Payload (Globals → Ticker)
export const tickerPlaceholder = [{ text: 'Moving banner' }]

// TODO: swap for the real Internal Comms contact (email or Teams link)
export const askCommsHref = '#'

export const companyObjective =
  'A creative, hard working and people-focused culture that delivers outstanding results for our clients'

// Body copy for the placeholder Inspo / Kudos article pages
export const placeholderArticle = {
  date: '23.07.25',
  lead: 'Square In The Air’s team look back at the latest work and share what they learned along the way…',
  sections: [
    { heading: '1. Original data is the biggest differentiator', text: [inspoText, inspoText] },
    { heading: '2. Relevance beats raw volume', text: [inspoText, inspoText] },
    { heading: '3. Strong brands cut through', text: [inspoText] },
  ],
}
