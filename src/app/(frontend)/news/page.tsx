import { getPayload } from 'payload'
import Link from 'next/link'
import React from 'react'

import config from '@/payload.config'
import { NewsCard, type NewsCardItem } from '../_components/NewsCard'
import '../styles.css'

const PAGE_SIZE = 12

export default async function NewsIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageParam } = await searchParams
  const page = Number(pageParam) > 0 ? Number(pageParam) : 1

  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const news = await payload.find({
    collection: 'news',
    where: {
      _status: {
        equals: 'published',
      },
    },
    sort: '-publishedDate',
    limit: PAGE_SIZE,
    page,
    depth: 1,
  })

  return (
    <div className="home">
      <section className="news-section">
        <div className="news-section__header">
          <h2>News</h2>
        </div>

        {news.docs.length === 0 ? (
          <p className="news-empty">No news posts yet.</p>
        ) : (
          <div className="news-grid">
            {news.docs.map((doc) => (
              <NewsCard key={doc.id} item={doc as unknown as NewsCardItem} />
            ))}
          </div>
        )}

        <div className="news-pagination">
          {news.hasPrevPage && (
            <Link href={`/news?page=${news.prevPage}`} className="button button--outline">
              Newer
            </Link>
          )}
          {news.hasNextPage && (
            <Link href={`/news?page=${news.nextPage}`} className="button button--outline">
              Older
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}
