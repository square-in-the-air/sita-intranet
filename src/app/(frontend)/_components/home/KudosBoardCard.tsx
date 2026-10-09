import Link from 'next/link'

import { truncate } from '../../_lib/excerpt'
import type { KudosItem } from './KudosCard'

// Kudos in the same large horizontal layout as the Inspo board cards.
// Left panel shows the people's photos (or initials until photos are added).
export function KudosBoardCard({ item }: { item: KudosItem }) {
  const content = (
    <>
      <div className="inspo-card__image kudos-people">
        {item.people.map((person) => (
          <div className="kudos-people__person" key={person.initials}>
            {person.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={person.image} alt="" />
            ) : (
              <span>{person.initials}</span>
            )}
          </div>
        ))}
      </div>
      <div className="inspo-card__body">
        <p className="inspo-card__author">{item.date}</p>
        <h3 className="inspo-card__title">{item.names}</h3>
        <p className="inspo-card__text">{truncate(item.message)}</p>
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
