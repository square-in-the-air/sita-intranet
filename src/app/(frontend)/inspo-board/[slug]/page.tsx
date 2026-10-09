import { notFound } from 'next/navigation'
import React from 'react'

import { Article } from '../../_components/Article'
import { PlaceholderArticleBody } from '../../_components/PlaceholderArticleBody'
import { inspoItems, placeholderArticle } from '../../_components/home/placeholderData'

export const metadata = { title: 'Inspo Board | SITA Intranet' }

// TODO: swap the placeholder lookup for an Inspo collection in Payload
export default async function InspoArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const item = inspoItems.find((i) => i.href === `/inspo-board/${slug}`)
  if (!item) notFound()

  return (
    <Article
      title={item.title}
      author={item.author}
      date={placeholderArticle.date}
      image={item.image ? { url: item.image } : null}
      lead={placeholderArticle.lead}
      backHref="/inspo-board"
    >
      <PlaceholderArticleBody />
    </Article>
  )
}
