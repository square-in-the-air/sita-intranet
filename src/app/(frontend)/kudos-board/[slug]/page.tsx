import { notFound } from 'next/navigation'
import React from 'react'

import { Article } from '../../_components/Article'
import { kudosItems } from '../../_components/home/placeholderData'

export const metadata = { title: 'Kudos Board | SITA Intranet' }

// TODO: swap the placeholder lookup for a Kudos collection in Payload
export default async function KudosArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const item = kudosItems.find((k) => k.href === `/kudos-board/${slug}`)
  if (!item) notFound()

  return (
    <Article
      title={`Kudos: ${item.names}`}
      date={item.date}
      lead={item.message}
      backHref="/kudos-board"
    />
  )
}
