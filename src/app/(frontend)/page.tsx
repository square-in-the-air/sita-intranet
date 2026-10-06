import { getPayload } from 'payload'
import Link from 'next/link'
import React from 'react'

import config from '@/payload.config'
import { NewsCard, type NewsCardItem } from './_components/NewsCard'
import { NewStarterCard, type NewStarterItem } from './_components/NewStarterCard'
import './styles.css'

export default async function HomePage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const latestNews = await payload.find({
    collection: 'news',
    where: {
      _status: {
        equals: 'published',
      },
    },
    sort: '-publishedDate',
    limit: 3,
    depth: 1,
  })

  const newStarters = await payload.find({
    collection: 'people',
    where: {
      startDate: {
        exists: true,
      },
    },
    sort: '-startDate',
    limit: 3,
    depth: 1,
  })

  return (
    <div className="home">
      <section className="news-section">
        <h1>Test</h1>
        <div className="news-section__header">
          <h2>Latest news</h2>
          <Link href="/news" className="button button--outline">
            View more
          </Link>
        </div>

        {latestNews.docs.length === 0 ? (
          <p className="news-empty">No news posts yet. Add one in the admin panel.</p>
        ) : (
          <div className="news-grid">
            {latestNews.docs.map((doc) => (
              <NewsCard key={doc.id} item={doc as unknown as NewsCardItem} />
            ))}
          </div>
        )}
      </section>

      <section className="new-starters-section">
        <div className="new-starters-section__header">
          <h2>Welcome to our new starters</h2>
        </div>

        {newStarters.docs.length === 0 ? (
          <p className="new-starters-empty">
            No new starters yet. Add someone to the People collection in the admin panel.
          </p>
        ) : (
          <div className="new-starters-grid">
            {newStarters.docs.map((doc) => (
              <NewStarterCard key={doc.id} item={doc as unknown as NewStarterItem} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
