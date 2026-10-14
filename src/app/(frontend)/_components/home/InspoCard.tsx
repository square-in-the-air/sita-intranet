import Link from 'next/link'
import React from 'react'

import { EXCERPT_LENGTH, truncate } from '../../_lib/excerpt'
import { POST_PLACEHOLDER_IMAGE } from '../../_lib/placeholders'
import { ReadMoreIcon } from '../icons'

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
        <img src={item.image || POST_PLACEHOLDER_IMAGE} alt="" />
      </div>
      <div className="inspo-card__body">
        {item.author && <p className="inspo-card__author">{item.author}</p>}
        <h3 className="inspo-card__title">{item.title}</h3>
        <p className="inspo-card__text">{truncate(item.text, size === 'large' ? EXCERPT_LENGTH : 90)}</p>
        <span className="inspo-card__more" aria-hidden="true">
          Read more
          <span className="inspo-card__more-icon">
            <ReadMoreIcon />
          </span>
        </span>
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
