// Data for the What's On page and the What's On box on the homepage.
// Events come from the Events collection. New starters, birthdays and work
// anniversaries are worked out from the People directory, so they update
// themselves as people are added.

import { getPayload } from 'payload'
import { cache } from 'react'

import config from '@/payload.config'
import type { Event, Media, Person } from '@/payload-types'
import { DAY, MONTHS, formatDayMonth, toDay, today } from './dates'
import { departmentLabels } from './departments'

// New starters show from 2 weeks before their first day until a week after
const NEW_STARTER_BEFORE = 14 * DAY
const NEW_STARTER_AFTER = 7 * DAY
// How far ahead the homepage box looks for birthdays and anniversaries
const SUMMARY_WINDOW = 60 * DAY

const getClient = async () => getPayload({ config: await config })

// One People lookup per request, shared by everything below
const getPeople = cache(async (): Promise<Person[]> => {
  const payload = await getClient()
  const { docs } = await payload.find({
    collection: 'people',
    pagination: false,
    depth: 1,
    sort: 'firstName',
  })
  return docs
})

/* ---------- Events ---------- */

export type EventItem = {
  id: Event['id']
  title: string
  day: number
  dayTBC: boolean
  organiser: string | null
  description: string | null
}

const toEventItem = (event: Event): EventItem => ({
  id: event.id,
  title: event.title,
  day: toDay(event.date),
  dayTBC: Boolean(event.dayToBeConfirmed),
  organiser: event.organiser && typeof event.organiser === 'object' ? event.organiser.name ?? null : null,
  description: event.description ?? null,
})

// TBC events are dated somewhere in their month, so they stay upcoming until the month is over
const isUpcoming = (e: EventItem) => {
  const now = today()
  if (!e.dayTBC) return e.day >= now
  const d = new Date(e.day)
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1) > now
}

export async function getUpcomingEvents(limit: number) {
  const payload = await getClient()
  const result = await payload.find({
    collection: 'events',
    // TBC events are dated somewhere in their month, so keep them until the month is over
    where: { date: { greater_than_equal: new Date(today() - 31 * DAY).toISOString() } },
    sort: 'date',
    limit: 100,
    depth: 1,
  })

  const upcoming = result.docs.map(toEventItem).filter(isUpcoming)

  return { events: upcoming.slice(0, limit), hasMore: upcoming.length > limit }
}

// Events that have already happened, most recent first
export async function getPastEvents(limit = 20) {
  const payload = await getClient()
  const result = await payload.find({
    collection: 'events',
    // Anything that could be past: TBC events dated up to a month ahead may already be over
    where: { date: { less_than: new Date(today() + 31 * DAY).toISOString() } },
    sort: '-date',
    limit: 100,
    depth: 1,
  })

  return result.docs
    .map(toEventItem)
    .filter((e) => !isUpcoming(e))
    .slice(0, limit)
}

/* ---------- New starters ---------- */

export type NewStarter = {
  id: Person['id']
  name: string
  day: number
  intro: string
  slideUrl: string | null
}

export async function getNewStarters(): Promise<NewStarter[]> {
  const people = await getPeople()
  const now = today()

  return people
    .filter((p) => p.startDate)
    .map((p) => {
      const slide = p.newStarterSlide && typeof p.newStarterSlide === 'object' ? (p.newStarterSlide as Media) : null
      const dept = p.department ? departmentLabels[p.department] : null
      return {
        id: p.id,
        name: p.name || `${p.firstName} ${p.lastName}`,
        day: toDay(p.startDate as string),
        intro: p.newStarterIntro || (dept ? `Joining the ${dept.toLowerCase()} team.` : 'Joining the team.'),
        slideUrl: slide?.url ?? null,
      }
    })
    .filter((s) => s.day >= now - NEW_STARTER_AFTER && s.day <= now + NEW_STARTER_BEFORE)
    .sort((a, b) => a.day - b.day)
}

/* ---------- Birthdays & anniversaries ---------- */

export type DateGroup = { key: number; day: number; names: string[] }

const addToGroup = (groups: Map<number, DateGroup>, day: number, name: string) => {
  const group = groups.get(day) ?? { key: day, day, names: [] }
  group.names.push(name)
  groups.set(day, group)
}

const sortedGroups = (groups: Map<number, DateGroup>) =>
  [...groups.values()].sort((a, b) => a.day - b.day)

// This occurrence of a recurring day/month in the given year
const dayInYear = (year: number, month: number, date: number) => {
  // 29 Feb falls back to 28 Feb in non-leap years
  const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
  return Date.UTC(year, month, Math.min(date, lastDay))
}

type Occasion = { day: number; name: string; years?: number }

function birthdaysIn(people: Person[], year: number): Occasion[] {
  return people.flatMap((p) => {
    if (!p.birthday) return []
    const born = new Date(toDay(p.birthday))
    return [{ day: dayInYear(year, born.getUTCMonth(), born.getUTCDate()), name: p.name || p.firstName }]
  })
}

function anniversariesIn(people: Person[], year: number): Occasion[] {
  return people.flatMap((p) => {
    if (!p.startDate) return []
    const start = new Date(toDay(p.startDate))
    const years = year - start.getUTCFullYear()
    if (years < 1) return []
    return [{
      day: dayInYear(year, start.getUTCMonth(), start.getUTCDate()),
      name: p.name || p.firstName,
      years,
    }]
  })
}

const inMonth = (day: number, year: number, month: number) => {
  const d = new Date(day)
  return d.getUTCFullYear() === year && d.getUTCMonth() === month
}

export async function getMonthCelebrations() {
  const people = await getPeople()
  const now = new Date(today())
  const year = now.getUTCFullYear()
  const month = now.getUTCMonth()

  const birthdays = new Map<number, DateGroup>()
  birthdaysIn(people, year)
    .filter((o) => inMonth(o.day, year, month))
    .forEach((o) => addToGroup(birthdays, o.day, o.name))

  // Anniversaries are grouped by the exact day, with the number of years
  const anniversaries = new Map<number, DateGroup>()
  anniversariesIn(people, year)
    .filter((o) => inMonth(o.day, year, month))
    .forEach((o) => addToGroup(anniversaries, o.day, `${o.name} (${o.years}yr)`))

  return {
    monthName: MONTHS[month],
    birthdays: sortedGroups(birthdays),
    anniversaries: sortedGroups(anniversaries),
  }
}

/* ---------- Homepage summary ---------- */

export type WhatsOnSummaryItem = { date: string; title: string }

export async function getWhatsOnSummary(limit = 5): Promise<WhatsOnSummaryItem[]> {
  const [{ events }, starters, people] = await Promise.all([
    getUpcomingEvents(limit),
    getNewStarters(),
    getPeople(),
  ])
  const now = today()
  const year = new Date(now).getUTCFullYear()
  const soon = (day: number) => day >= now && day <= now + SUMMARY_WINDOW
  const firstName = (name: string) => name.split(' ')[0]

  const items: { day: number; date: string; title: string }[] = [
    ...events.map((e) => ({ day: e.day, date: formatDayMonth(e.day, e.dayTBC), title: e.title })),
    ...starters
      .filter((s) => s.day >= now)
      .map((s) => ({ day: s.day, date: formatDayMonth(s.day), title: `${firstName(s.name)}’s first day` })),
    // Look at this year and next so December → January works
    ...[year, year + 1].flatMap((y) => [
      ...birthdaysIn(people, y)
        .filter((o) => soon(o.day))
        .map((o) => ({ day: o.day, date: formatDayMonth(o.day), title: `${firstName(o.name)}’s birthday` })),
      ...anniversariesIn(people, y)
        .filter((o) => soon(o.day))
        .map((o) => ({
          day: o.day,
          date: formatDayMonth(o.day),
          title: `${firstName(o.name)}’s ${o.years}yr work anniversary`,
        })),
    ]),
  ]

  return items
    .sort((a, b) => a.day - b.day)
    .slice(0, limit)
    .map(({ date, title }) => ({ date, title }))
}
