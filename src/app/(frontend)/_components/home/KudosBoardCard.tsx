import Link from 'next/link'

import { truncate } from '../../_lib/excerpt'
import { POST_PLACEHOLDER_IMAGE } from '../../_lib/placeholders'
import { ArrowIcon } from '../icons'
import type { KudosItem } from './KudosCard'

// Kudos in the same large horizontal layout as the Inspo board cards,
// with the post's hero image (or the placeholder) on the left.
export function KudosBoardCard({ item }: { item: KudosItem }) {
  // Every image in the post shares the image panel equally; placeholder when there are none
  const photos = item.people.flatMap((person) => (person.image ? [person.image] : []))
  const images = photos.length ? photos : [item.image || POST_PLACEHOLDER_IMAGE]

  const content = (
    <>
      <div className={`inspo-card__image${images.length > 1 ? ' inspo-card__image--split' : ''}`}>
        {images.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} src={src} alt="" />
        ))}
      </div>
      <div className="inspo-card__body">
        <p className="inspo-card__author">{item.date}</p>
        <h3 className="inspo-card__title">{item.names}</h3>
        <p className="inspo-card__text">{truncate(item.message)}</p>
        <ArrowIcon className="inspo-card__arrow" />
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
