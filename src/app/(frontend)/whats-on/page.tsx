import React from 'react'

import { PageHero } from '../_components/PageHero'
import { ViewMore } from '../_components/ViewMore'
import { SectionHeader } from '../_components/home/SectionHeader'
import { DateGroups } from '../_components/whats-on/DateGroups'
import { EventCard } from '../_components/whats-on/EventCard'
import { NewStarterBox } from '../_components/whats-on/NewStarterBox'
import { formatDayMonth } from '../_lib/dates'
import { getMonthCelebrations, getNewStarters, getUpcomingEvents } from '../_lib/whatsOn'

const PAGE_SIZE = 3

export const metadata = { title: 'What’s On | SITA Intranet' }

export default async function WhatsOnPage({
  searchParams,
}: {
  searchParams: Promise<{ show?: string }>
}) {
  const { show } = await searchParams
  const count = Math.max(PAGE_SIZE, Number(show) || PAGE_SIZE)

  const [{ events, hasMore }, starters, { monthName, birthdays, anniversaries }] = await Promise.all([
    getUpcomingEvents(count),
    getNewStarters(),
    getMonthCelebrations(),
  ])

  return (
    <>
      <PageHero title="What’s on?" />
      <div className="page container">
        <div className="whats-on-page">
          <section className="whats-on-page__events">
            <SectionHeader title="Upcoming events" />
            {events.length === 0 ? (
              <p className="whats-on-page__empty">No upcoming events yet. Add one in the admin panel.</p>
            ) : (
              <div className="whats-on-page__list">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
            {hasMore && <ViewMore href={`/whats-on?show=${count + PAGE_SIZE}`} align="start" />}
          </section>

          <div className="whats-on-page__aside">
            <section>
              <SectionHeader title="New starters" />
              {starters.length === 0 ? (
                <p className="whats-on-page__empty">No new starters coming up.</p>
              ) : (
                <div className="whats-on-page__list">
                  {starters.map((starter) => (
                    <NewStarterBox key={starter.id} starter={starter} />
                  ))}
                </div>
              )}
            </section>

            <section>
              <SectionHeader title={`${monthName} birthdays`} />
              <DateGroups
                variant="yellow"
                groups={birthdays}
                formatLabel={(g) => formatDayMonth(g.day)}
                empty="No birthdays this month."
              />
            </section>

            <section>
              <SectionHeader title={`${monthName} work anniversaries`} />
              <DateGroups
                variant="cream"
                groups={anniversaries}
                formatLabel={(g) => `w/c ${formatDayMonth(g.day)}`}
                empty="No work anniversaries this month."
              />
            </section>
          </div>
        </div>
      </div>
    </>
  )
}
