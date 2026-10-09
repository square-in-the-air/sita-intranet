import Link from 'next/link'
import React from 'react'

import { EXCERPT_LENGTH, truncate } from '../../_lib/excerpt'

export type InspoItem = {
  title: string
  text: string
  author?: string
  href?: string
  image?: string
}

type Props = {
  item: InspoItem
  size?: 'default' | 'large'
}

export function InspoCard({ item, size = 'default' }: Props) {
  const className = `inspo-card${size === 'large' ? ' inspo-card--large' : ''}`

  const content = (
    <>
      <div className="inspo-card__image">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {item.image && <img src={item.image} alt="" />}
      </div>
      <div className="inspo-card__body">
        {item.author && <p className="inspo-card__author">{item.author}</p>}
        <h3 className="inspo-card__title">{item.title}</h3>
        <p className="inspo-card__text">{truncate(item.text, size === 'large' ? EXCERPT_LENGTH : 90)}</p>
      </div>
    </>
  )

  return item.href ? (
    <Link href={item.href} className={className} aria-label={item.title}>
      {content}
    </Link>
  ) : (
    <article className={className}>{content}</article>
  )
}
