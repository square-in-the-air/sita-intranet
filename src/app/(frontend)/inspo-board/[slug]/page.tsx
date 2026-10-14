import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import React from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'

import config from '@/payload.config'
import { Article, formatArticleDate } from '../../_components/Article'

const getArticle = async (slug: string) => {
  const payload = await getPayload({ config: await config })
  const result = await payload.find({
    collection: 'inspo',
    where: {
      slug: { equals: slug },
      _status: { equals: 'published' },
    },
    limit: 1,
    depth: 1,
  })
  return result.docs[0] ?? null
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const article = await getArticle((await params).slug)
  return { title: article ? `${article.title} | SITA Intranet` : 'Inspo Board | SITA Intranet' }
}

export default async function InspoArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const article = await getArticle((await params).slug)
  if (!article) notFound()

  const image = article.heroImage && typeof article.heroImage === 'object' ? article.heroImage : null
  const author = article.author && typeof article.author === 'object' ? article.author.name : null

  return (
    <Article
      title={article.title}
      author={author}
      date={formatArticleDate(article.publishedDate)}
      image={image}
      backHref="/inspo-board"
      backLabel="Back to inspo board"
    >
      {article.content && <RichText data={article.content} />}
    </Article>
  )
}
