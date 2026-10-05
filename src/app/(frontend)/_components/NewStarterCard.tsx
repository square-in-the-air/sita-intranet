export type NewStarterItem = {
  id: string
  name: string
  jobTitle: string
  department?: 'activation' | 'creative' | 'design' | 'pr' | 'social' | 'video' | null
  startDate?: string | null
  headshot?:
    | string
    | {
        url?: string | null
        alt?: string | null
      }
    | null
}

const departmentLabels: Record<string, string> = {
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

const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

export function NewStarterCard({ item }: { item: NewStarterItem }) {
  const image = typeof item.headshot === 'object' ? item.headshot : null

  return (
    <div className="new-starter-card">
      <div className="new-starter-card__image">
        {image?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image.url} alt={image.alt || item.name} />
        ) : (
          <div className="new-starter-card__image-placeholder">{initials(item.name)}</div>
        )}
      </div>
      <div className="new-starter-card__body">
        {item.department && (
          <span className="new-starter-card__tag">{departmentLabels[item.department]}</span>
        )}
        <h3 className="new-starter-card__name">{item.name}</h3>
        <p className="new-starter-card__role">{item.jobTitle}</p>
        {item.startDate && (
          <span className="new-starter-card__date">Joined {formatDate(item.startDate)}</span>
        )}
      </div>
    </div>
  )
}
