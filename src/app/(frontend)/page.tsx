import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { defaultCallouts } from '@/globals/Callouts'
import { defaultSocialLinks } from '@/globals/SocialLinks'
import { getWhatsOnSummary } from './_lib/whatsOn'
import { Ticker } from './_components/Ticker'
import { CompanyObjective } from './_components/home/CompanyObjective'
import { FeedbackLink } from './_components/home/FeedbackLink'
import { FeedCard, type FeedCardItem } from './_components/home/FeedCard'
import { InspoCard } from './_components/home/InspoCard'
import { KudosCard } from './_components/home/KudosCard'
import { QuickLinks } from './_components/home/QuickLinks'
import { SearchBar } from './_components/home/SearchBar'
import { toInspoItem, toKudosItem } from './_lib/posts'
import { SectionHeader } from './_components/home/SectionHeader'
import { WhatsOn } from './_components/home/WhatsOn'
import {
  companyObjective,
  quickLinks as placeholderQuickLinks,
} from './_components/home/placeholderData'

export default async function HomePage() {
  const payload = await getPayload({ config: await config })

  // Edited in Payload (Globals → Quick links); placeholder list if it's empty
  const quickLinksGlobal = await payload.findGlobal({ slug: 'quick-links', depth: 0 })
  const quickLinks = quickLinksGlobal.items?.length
    ? quickLinksGlobal.items.map(({ label, link, style }) => ({
        label,
        href: link,
        variant: style === 'highlight' || style === 'dark' ? style : undefined,
      }))
    : placeholderQuickLinks

  // Edited in Payload (Options → Call-out boxes)
  const callouts = await payload.findGlobal({ slug: 'callouts', depth: 0 })
  const feedback = { ...defaultCallouts.feedback, ...callouts.feedback }
  const itProblem = { ...defaultCallouts.itProblem, ...callouts.itProblem }

  // Edited in Payload (Options → Social links); any blank link falls back to the default profile
  const socialGlobal = await payload.findGlobal({ slug: 'social-links', depth: 0 })
  const socialLinks = {
    linkedin: socialGlobal.linkedin || defaultSocialLinks.linkedin,
    x: socialGlobal.x || defaultSocialLinks.x,
    instagram: socialGlobal.instagram || defaultSocialLinks.instagram,
  }

  const news = await payload.find({
    collection: 'news',
    where: { _status: { equals: 'published' } },
    sort: '-publishedDate',
    limit: 2,
    depth: 1,
  })

  const inspo = await payload.find({
    collection: 'inspo',
    where: { _status: { equals: 'published' } },
    sort: '-publishedDate',
    limit: 2,
    depth: 1,
  })

  const kudos = await payload.find({
    collection: 'kudos',
    where: { _status: { equals: 'published' } },
    sort: '-publishedDate',
    limit: 1,
    depth: 2,
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
          <h1 className="welcome__title">Welcome</h1>
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
              {inspo.docs.length === 0 ? (
                <p className="dashboard__empty">No inspo posts yet. Add one in the admin panel.</p>
              ) : (
                <div className="inspo-list">
                  {inspo.docs.map((doc) => (
                    <InspoCard key={doc.id} item={toInspoItem(doc)} />
                  ))}
                </div>
              )}
            </section>

            <CompanyObjective text={companyObjective} href="/resources#objectives" />
          </div>

          <aside className="dashboard__aside">
            <section className="dashboard__quick-links">
              <QuickLinks links={quickLinks} socials={socialLinks} />
            </section>

            <section>
              <SectionHeader title="Kudos board" linkLabel="All kudos" href="/kudos-board" />
              {kudos.docs.length === 0 ? (
                <p className="dashboard__empty">No kudos posts yet. Add one in the admin panel.</p>
              ) : (
                <KudosCard item={toKudosItem(kudos.docs[0])} />
              )}
            </section>

            <section>
              <SectionHeader title={'What’s on'} linkLabel="All events" href="/whats-on" />
              <WhatsOn items={whatsOn} />
              <FeedbackLink href={feedback.link} title={feedback.title} text={feedback.text} />
              <FeedbackLink
                href={`mailto:${itProblem.email}?subject=${encodeURIComponent('IT problem')}`}
                title={itProblem.title}
                text={itProblem.text}
                variant="orange"
              />
            </section>
          </aside>
        </div>
      </div>
    </div>
  )
}
