import Link from 'next/link'

export type NewsCardItem = {
  id: string
  title: string
  slug?: string | null
  excerpt?: string | null
  publishedDate: string
  department?: 'all' | 'activation' | 'creative' | 'design' | 'pr' | 'social' | 'video' | null
  heroImage?:
    | string
    | {
        url?: string | null
        alt?: string | null
      }
    | null
}

const departmentLabels: Record<string, string> = {
  all: 'All departments',
  activation: 'Activation',
  creative: 'Creative',
  design: 'Design',
  pr: 'PR',
  social: 'Social',
  video: 'Video',
}

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

export function NewsCard({ item }: { item: NewsCardItem }) {
  const image = typeof item.heroImage === 'object' ? item.heroImage : null
  const href = item.slug ? `/news/${item.slug}` : `/news`

  return (
    <Link href={href} className="news-card">
      <div className="news-card__image">
        {image?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image.url} alt={image.alt || ''} />
        ) : (
          <div className="news-card__image-placeholder" />
        )}
      </div>
      <div className="news-card__body">
        {item.department && (
          <span className="news-card__tag">{departmentLabels[item.department]}</span>
        )}
        <h3 className="news-card__title">{item.title}</h3>
        {item.excerpt && <p className="news-card__excerpt">{item.excerpt}</p>}
        <span className="news-card__date">{formatDate(item.publishedDate)}</span>
      </div>
    </Link>
  )
}
