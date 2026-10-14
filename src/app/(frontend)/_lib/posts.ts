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

// Preview comes from the post content
const previewText = (doc: { content?: unknown }) => richTextToPlainText(doc.content)

export const toInspoItem = (doc: Inspo): InspoItem => ({
  title: doc.title,
  text: previewText(doc),
  author: personName(doc.author) ?? undefined,
  image: media(doc.heroImage)?.url ?? undefined,
  // Inspo cards have no page of their own: they go to the link set in the admin
  href: doc.link || undefined,
})

// "26 Nov"
export const formatKudosDate = (value: string) =>
  new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    timeZone: 'Europe/London',
  })

// Initials from the title ("Tom & Kiane" → T, K)
const initialsFromTitle = (title: string) =>
  title
    .split(/\s*(?:&|,|\band\b)\s*/i)
    .map((part) => part.trim().charAt(0).toUpperCase())
    .filter(Boolean)

export const toKudosItem = (doc: Kudos): KudosItem => {
  // One square per image in the post, falling back to initials from the title
  const photos = (doc.gallery ?? []).flatMap(({ image }) => {
    const url = media(image)?.url
    return url ? [url] : []
  })
  const people = photos.length
    ? photos.map((image, i) => ({ initials: String(i), image }))
    : initialsFromTitle(doc.title).map((initials) => ({ initials }))

  return {
    // First of the post's images
    image: media(doc.gallery?.[0]?.image)?.url ?? undefined,
    names: doc.title,
    date: formatKudosDate(doc.publishedDate),
    message: previewText(doc),
    people,
    href: doc.slug ? `/kudos-board/${doc.slug}` : '/kudos-board',
  }
}
