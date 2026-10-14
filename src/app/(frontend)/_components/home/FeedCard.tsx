import Link from 'next/link'

import { richTextToPlainText, truncate } from '../../_lib/excerpt'
import { formatArticleDate } from '../Article'
import { ReadMoreIcon } from '../icons'

type MediaRef = string | number | { url?: string | null; alt?: string | null } | null | undefined
type PersonRef =
  | string
  | number
  | { name?: string | null; firstName?: string | null; lastName?: string | null }
  | null
  | undefined

export type FeedCardItem = {
  id: string | number
  title: string
  slug?: string | null
  content?: unknown
  heroImage?: MediaRef
  author?: PersonRef
  publishedDate?: string | null
}

const getAuthorName = (author: PersonRef) => {
  if (!author || typeof author !== 'object') return null
  return author.name || `${author.firstName ?? ''} ${author.lastName ?? ''}`.trim() || null
}

type Props = {
  item: FeedCardItem
  // 'large' = image left, text right (used on the News feed page)
  size?: 'default' | 'large'
}

export function FeedCard({ item, size = 'default' }: Props) {
  const isLarge = size === 'large'
  const image = item.heroImage && typeof item.heroImage === 'object' ? item.heroImage : null
  const author = getAuthorName(item.author)
  const date = item.publishedDate ? formatArticleDate(item.publishedDate) : null
  // Preview comes from the post content
  const preview = truncate(richTextToPlainText(item.content))
  const href = item.slug ? `/news/${item.slug}` : '/news'

  return (
    <Link
      href={href}
      className={`feed-card${isLarge ? ' feed-card--large' : ''}`}
      aria-label={item.title}
    >
      {/* Large cards always show the image panel, grey until an image is added */}
      {(image?.url || isLarge) && (
        <div className="feed-card__image">
          {image?.url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image.url} alt={image.alt || ''} />
          )}
        </div>
      )}
      <div className="feed-card__body">
        {(author || date) && (
          <p className="feed-card__author">
            {author}
            {author && date && <span className="feed-card__author-sep"> · </span>}
            {date && <span className="feed-card__date">{date}</span>}
          </p>
        )}
        <h3 className="feed-card__title">{item.title}</h3>
        {preview && <p className="feed-card__excerpt">{preview}</p>}
        <span className="feed-card__more" aria-hidden="true">
          Read more
          <span className="feed-card__more-icon">
            <ReadMoreIcon />
          </span>
        </span>
      </div>
    </Link>
  )
}
