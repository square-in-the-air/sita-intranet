import Link from 'next/link'

import { truncate } from '../../_lib/excerpt'

export type KudosItem = {
  names: string
  date: string
  message: string
  people: { initials: string; image?: string }[]
  href?: string
}

export function KudosCard({ item }: { item: KudosItem }) {
  const content = (
    <>
      <div className="kudos-card__avatars">
        {item.people.map((person) => (
          <div className="kudos-card__avatar" key={person.initials}>
            {person.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={person.image} alt="" />
            ) : (
              <span>{person.initials}</span>
            )}
          </div>
        ))}
      </div>
      <div className="kudos-card__meta">
        <h3 className="kudos-card__names">{item.names}</h3>
        <span className="kudos-card__date">{item.date}</span>
      </div>
      <p className="kudos-card__message">{truncate(item.message)}</p>
    </>
  )

  return item.href ? (
    <Link href={item.href} className="kudos-card" aria-label={`Kudos: ${item.names}`}>
      {content}
    </Link>
  ) : (
    <article className="kudos-card">{content}</article>
  )
}
