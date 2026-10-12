// Placeholder content for the homepage sections that don't have a Payload
// collection yet. Swap each of these for a payload.find() call once the
// matching collection (or global, for quick links) exists.

import type { QuickLink, SocialLinks } from './QuickLinks'
import type { WhatsOnItem } from './WhatsOn'

// whatsOnItems is the fallback for the homepage box when there's nothing in
// Events or the People directory yet.

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

export const socialLinks: SocialLinks = {
  linkedin: '#',
  x: '#',
  instagram: '#',
}

const inspoText =
  'If AI has changed anything, it\u2019s the value of originality. When any brand or agency can now generate mass content at scale by punching commands into ChatGPT, the only real differentiator is authoritative information that doesn\u2019t already exist\u2026'

export const whatsOnItems: WhatsOnItem[] = [
  { date: 'XX Oct', title: 'Opening jumps (Cheltenham)' },
  { date: 'XX Oct', title: 'Jasmine’s first day' },
  { date: 'XX Nov', title: 'Annette work anniversary' },
  { date: '26 Nov', title: 'Armen birthday' },
  { date: '26 Nov', title: 'Christmas RSVP deadline' },
]

// Shown until messages are added in Payload (Globals → Ticker)
export const tickerPlaceholder = [{ text: 'Moving banner' }]

// TODO: swap for the real anonymous feedback form URL (e.g. a Microsoft Form)
export const feedbackFormHref = '#'

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
