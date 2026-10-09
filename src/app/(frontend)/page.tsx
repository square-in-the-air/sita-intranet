import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { getWhatsOnSummary } from './_lib/whatsOn'
import { Ticker } from './_components/Ticker'
import { CompanyObjective } from './_components/home/CompanyObjective'
import { FeedbackLink } from './_components/home/FeedbackLink'
import { FeedCard, type FeedCardItem } from './_components/home/FeedCard'
import { InspoCard } from './_components/home/InspoCard'
import { KudosCard } from './_components/home/KudosCard'
import { QuickLinks } from './_components/home/QuickLinks'
import { SearchBar } from './_components/home/SearchBar'
import { SectionHeader } from './_components/home/SectionHeader'
import { WhatsOn } from './_components/home/WhatsOn'
import {
  companyObjective,
  feedbackFormHref,
  inspoItems,
  kudosItems,
  quickLinks,
  socialLinks,
  whatsOnItems,
} from './_components/home/placeholderData'

export default async function HomePage() {
  const payload = await getPayload({ config: await config })

  const { user } = await payload.auth({ headers: await getHeaders() })
  let firstName: string | null = null

  if (user?.email) {
    const { docs } = await payload.find({
      collection: 'people',
      where: { workEmail: { equals: user.email } },
      limit: 1,
      depth: 0,
    })
    firstName = docs[0]?.firstName ?? null
  }

  const news = await payload.find({
    collection: 'news',
    where: { _status: { equals: 'published' } },
    sort: '-publishedDate',
    limit: 2,
    depth: 1,
  })

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/London',
  })

  // Falls back to the placeholder list until there are events/people to show
  const whatsOn = await getWhatsOnSummary(5)

  return (
    <div className="dashboard">
      <Ticker />

      <section className="welcome">
        <div className="welcome__inner container">
          <h1 className="welcome__title">Welcome{firstName ? `, ${firstName}` : ''}</h1>
          <p className="welcome__date">{today}</p>
        </div>
      </section>

      <div className="container">
        <SearchBar />

        <div className="dashboard__grid">
          <div className="dashboard__main">
            <section>
              <SectionHeader title="News feed" linkLabel="All news" href="/news" />
              {news.docs.length === 0 ? (
                <p className="dashboard__empty">No news posts yet. Add one in the admin panel.</p>
              ) : (
                <div className="feed">
                  {news.docs.map((doc) => (
                    <FeedCard key={doc.id} item={doc as unknown as FeedCardItem} />
                  ))}
                </div>
              )}
            </section>

            <section>
              <SectionHeader title="Inspo board" linkLabel="All inspo" href="/inspo-board" />
              <div className="inspo-list">
                {inspoItems.slice(0, 2).map((item, i) => (
                  <InspoCard key={i} item={item} />
                ))}
              </div>
            </section>

            <CompanyObjective text={companyObjective} href="/resources#objectives" />
          </div>

          <aside className="dashboard__aside">
            <section className="dashboard__quick-links">
              <QuickLinks links={quickLinks} socials={socialLinks} />
            </section>

            <section>
              <SectionHeader title="Kudos board" linkLabel="All kudos" href="/kudos-board" />
              <KudosCard item={kudosItems[0]} />
            </section>

            <section>
              <SectionHeader title={'What’s on'} linkLabel="All events" href="/whats-on" />
              <WhatsOn items={whatsOn.length ? whatsOn : whatsOnItems} />
              <FeedbackLink href={feedbackFormHref} />
            </section>
          </aside>
        </div>
      </div>
    </div>
  )
}
