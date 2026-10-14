import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import React from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'

import config from '@/payload.config'
import { Article, formatArticleDate } from '../../_components/Article'

const getArticle = async (slug: string) => {
  const payload = await getPayload({ config: await config })
  const result = await payload.find({
    collection: 'kudos',
    where: {
      slug: { equals: slug },
      _status: { equals: 'published' },
    },
    limit: 1,
    depth: 2,
  })
  return result.docs[0] ?? null
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const article = await getArticle((await params).slug)
  return { title: article ? `${article.title} | SITA Intranet` : 'Kudos Board | SITA Intranet' }
}

export default async function KudosArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const article = await getArticle((await params).slug)
  if (!article) notFound()

  const author = article.author && typeof article.author === 'object' ? article.author.name : null

  const gallery = (article.gallery ?? []).flatMap(({ image: img }) =>
    img && typeof img === 'object' && img.url ? [img] : [],
  )

  return (
    <Article
      title={article.title}
      author={author}
      date={formatArticleDate(article.publishedDate)}
      gallery={gallery}
      backHref="/kudos-board"
      backLabel="Back to kudos board"
    >
      {article.content && <RichText data={article.content} />}
    </Article>
  )
}
