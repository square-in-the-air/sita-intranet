import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import React from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'

import config from '@/payload.config'
import '../../styles.css'

const departmentLabels: Record<string, string> = {
  all: 'All departments',
  activation: 'Activation',
  creative: 'Creative',
  design: 'Design',
  pr: 'PR',
  social: 'Social',
  video: 'Video',
}

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const result = await payload.find({
    collection: 'news',
    where: {
      slug: { equals: slug },
      _status: { equals: 'published' },
    },
    limit: 1,
    depth: 1,
  })

  const article = result.docs[0]

  if (!article) {
    notFound()
  }

  const image = typeof article.heroImage === 'object' ? article.heroImage : null

  return (
    <div className="home">
      <article className="news-article">
        <Link href="/news" className="news-article__back">
          ← Back to news
        </Link>

        <h1>{article.title}</h1>

        <p className="news-article__meta">
          {article.department && (
            <span className="news-article__tag">{departmentLabels[article.department]}</span>
          )}
          <span className="news-article__date">{formatDate(article.publishedDate)}</span>
        </p>

        {image?.url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image.url} alt={image.alt || ''} className="news-article__image" />
        )}

        {article.content && <RichText data={article.content} />}
      </article>
    </div>
  )
}
