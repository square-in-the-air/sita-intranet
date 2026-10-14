import Link from 'next/link'

import { truncate } from '../../_lib/excerpt'
import { POST_PLACEHOLDER_IMAGE } from '../../_lib/placeholders'
import { ReadMoreIcon } from '../icons'
import type { KudosItem } from './KudosCard'

// Kudos in the same large horizontal layout as the Inspo board cards,
// with the post's hero image (or the placeholder) on the left.
export function KudosBoardCard({ item }: { item: KudosItem }) {
  const content = (
    <>
      <div className="inspo-card__image">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.image || POST_PLACEHOLDER_IMAGE} alt="" />
      </div>
      <div className="inspo-card__body">
        <p className="inspo-card__author">{item.date}</p>
        <h3 className="inspo-card__title">{item.names}</h3>
        <p className="inspo-card__text">{truncate(item.message)}</p>
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
    <Link href={item.href} className="inspo-card inspo-card--large" aria-label={`Kudos: ${item.names}`}>
      {content}
    </Link>
  ) : (
    <article className="inspo-card inspo-card--large">{content}</article>
  )
}
