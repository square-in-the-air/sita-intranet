// Fake What's On data so the page can be previewed. Dates are worked out from
// today, so re-running it always gives a populated current month.
//
//   npm run payload run src/seed/seedWhatsOn.ts          add / refresh demo data
//   npm run payload run src/seed/seedWhatsOn.ts -- clean remove demo data
//
// Demo people use @demo.invalid emails and demo events are organised by those
// people, so everything is easy to spot and remove.

import { getPayload } from 'payload'

import config from '@/payload.config'

const DAY = 24 * 60 * 60 * 1000
const DEMO_DOMAIN = '@demo.invalid'

const departments = ['activation', 'creative', 'design', 'pr', 'social', 'video'] as const
const monthValues = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

const iso = (ts: number) => new Date(ts + 12 * 60 * 60 * 1000).toISOString() // midday, like Payload day pickers

const now = new Date()
const todayTs = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
const year = now.getUTCFullYear()
const month = now.getUTCMonth()
const inThisMonth = (day: number, yearsAgo = 0) => Date.UTC(year - yearsAgo, month, day)

type DemoPerson = {
  first: string
  last: string
  dept: (typeof departments)[number]
  birthdayDay?: number
  startDate?: number
  newStarterIntro?: string
}

const people: DemoPerson[] = [
  // New starters (first day in the next couple of weeks)
  { first: 'Maya', last: 'Okafor', dept: 'video', startDate: todayTs + 3 * DAY, newStarterIntro: 'Joining the video team as a junior editor.' },
  { first: 'Jonah', last: 'Whitfield', dept: 'creative', startDate: todayTs + 10 * DAY },
  // Birthdays this month
  { first: 'Priya', last: 'Nair', dept: 'design', birthdayDay: 3, startDate: inThisMonth(20, 6) },
  { first: 'Callum', last: 'Reid', dept: 'social', birthdayDay: 3 },
  { first: 'Imogen', last: 'Hart', dept: 'pr', birthdayDay: 14 },
  { first: 'Tomasz', last: 'Kowalski', dept: 'activation', birthdayDay: 22 },
  { first: 'Aisha', last: 'Bello', dept: 'creative', birthdayDay: 22 },
  { first: 'Fergus', last: 'Doyle', dept: 'video', birthdayDay: 29 },
  // Work anniversaries this month
  { first: 'Lena', last: 'Fischer', dept: 'design', startDate: inThisMonth(5, 1) },
  { first: 'Marcus', last: 'Bell', dept: 'activation', startDate: inThisMonth(7, 3) },
  { first: 'Sofia', last: 'Alvarez', dept: 'pr', startDate: inThisMonth(15, 2) },
  { first: 'Ewan', last: 'Murray', dept: 'social', startDate: inThisMonth(26, 5) },
]

const events = [
  { offset: 5, title: 'Summer Social at the Rooftop Bar', organiser: 0, description: 'Drinks and food on the terrace to celebrate a brilliant quarter. Bring a plus one, and keep an eye on your email for the full details nearer the time.' },
  { offset: 12, title: 'Lunch and Learn: Pitching Better', organiser: 2, description: 'A relaxed session on structuring pitches that land. Lunch provided. Open to every department.' },
  { offset: 20, title: 'Quarterly All Hands', organiser: 4, description: 'Company update, wins from the last quarter and what is coming up next. Questions welcome at the end.' },
  { offset: 34, title: 'Christmas Party Save the Date', organiser: 3, description: 'Put it in your diary now. Venue and dress code to follow.', tbc: true },
  { offset: 45, title: 'Charity Fun Run', organiser: 1, description: 'A 5k loop round the park in aid of our charity partner. Walkers very welcome.' },
]

async function run() {
  const payload = await getPayload({ config: await config })
  const clean = process.argv.includes('clean')

  // Always clear the previous demo data first so the script can be re-run
  await payload.delete({ collection: 'events', where: { 'organiser.workEmail': { like: DEMO_DOMAIN } } })
  await payload.delete({ collection: 'people', where: { workEmail: { like: DEMO_DOMAIN } } })
  if (clean) {
    console.log('Demo What’s On data removed.')
    process.exit(0)
  }

  const created = []
  for (const p of people) {
    created.push(
      await payload.create({
        collection: 'people',
        data: {
          firstName: p.first,
          lastName: p.last,
          jobTitle: 'Demo role',
          department: p.dept,
          workEmail: `${p.first}.${p.last}${DEMO_DOMAIN}`.toLowerCase(),
          startDate: p.startDate ? iso(p.startDate) : undefined,
          birthdayDay: p.birthdayDay,
          birthdayMonth: p.birthdayDay ? (monthValues[month] as never) : undefined,
          newStarterIntro: p.newStarterIntro,
        },
      }),
    )
  }

  for (const e of events) {
    await payload.create({
      collection: 'events',
      data: {
        title: e.title,
        date: iso(todayTs + e.offset * DAY),
        dayToBeConfirmed: e.tbc ?? false,
        organiser: created[e.organiser].id,
        description: e.description,
      },
    })
  }

  console.log(`Seeded ${people.length} demo people and ${events.length} demo events.`)
  process.exit(0)
}

// payload run exits as soon as the module finishes loading, so wait here
try {
  await run()
} catch (err) {
  console.error(err)
  process.exit(1)
}
