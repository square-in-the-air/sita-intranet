// Turns Inspo and Kudos docs from Payload into what the cards expect

import type { Inspo, Kudos, Media, Person } from '@/payload-types'
import type { InspoItem } from '../_components/home/InspoCard'
import type { KudosItem } from '../_components/home/KudosCard'
import { richTextToPlainText } from './excerpt'

const media = (value: unknown): Media | null =>
  value && typeof value === 'object' ? (value as Media) : null

const personName = (person: unknown) => {
  if (!person || typeof person !== 'object') return null
  const p = person as Person
  return p.name || `${p.firstName ?? ''} ${p.lastName ?? ''}`.trim() || null
}

// Preview comes from the post content, falling back to the excerpt field
const previewText = (doc: { content?: unknown; excerpt?: string | null }) =>
  richTextToPlainText(doc.content) || doc.excerpt?.trim() || ''

export const toInspoItem = (doc: Inspo): InspoItem => ({
  title: doc.title,
  text: previewText(doc),
  author: personName(doc.author) ?? undefined,
  image: media(doc.heroImage)?.url ?? undefined,
  href: doc.slug ? `/inspo-board/${doc.slug}` : '/inspo-board',
})

// "26 Nov"
export const formatKudosDate = (value: string) =>
  new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    timeZone: 'Europe/London',
  })

// Without picked recipients, fall back to initials from the title ("Tom & Kiane" → T, K)
const initialsFromTitle = (title: string) =>
  title
    .split(/\s*(?:&|,|\band\b)\s*/i)
    .map((part) => part.trim().charAt(0).toUpperCase())
    .filter(Boolean)

export const toKudosItem = (doc: Kudos): KudosItem => {
  const recipients = (doc.recipients ?? []).filter(
    (r): r is Person => typeof r === 'object' && r !== null,
  )

  const people = recipients.length
    ? recipients.map((person) => ({
        initials: (person.firstName?.charAt(0) ?? '?').toUpperCase(),
        image: media(person.headshot)?.url ?? undefined,
      }))
    : initialsFromTitle(doc.title).map((initials) => ({ initials }))

  return {
    names: doc.title,
    date: formatKudosDate(doc.publishedDate),
    message: previewText(doc),
    people,
    href: doc.slug ? `/kudos-board/${doc.slug}` : '/kudos-board',
  }
}
