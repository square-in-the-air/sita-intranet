import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { PageHero } from '../_components/PageHero'
import { ViewMore } from '../_components/ViewMore'
import { FeedCard, type FeedCardItem } from '../_components/home/FeedCard'

const PAGE_SIZE = 4

export const metadata = { title: 'News Feed | SITA Intranet' }

export default async function NewsIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ show?: string }>
}) {
  const { show } = await searchParams
  const count = Math.max(PAGE_SIZE, Number(show) || PAGE_SIZE)

  const payload = await getPayload({ config: await config })

  const news = await payload.find({
    collection: 'news',
    where: {
      _status: {
        equals: 'published',
      },
    },
    sort: '-publishedDate',
    limit: count,
    depth: 1,
  })

  return (
    <>
      <PageHero title="News feed" />
      <div className="page container">
        {news.docs.length === 0 ? (
          <p className="dashboard__empty">No news posts yet.</p>
        ) : (
          <div className="feed feed--board">
            {news.docs.map((doc) => (
              <FeedCard key={doc.id} item={doc as unknown as FeedCardItem} size="large" />
            ))}
          </div>
        )}
        {news.totalDocs > count && <ViewMore href={`/news?show=${count + PAGE_SIZE}`} />}
      </div>
    </>
  )
}
