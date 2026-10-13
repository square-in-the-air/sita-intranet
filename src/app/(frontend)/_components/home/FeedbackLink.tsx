import { ArrowIcon } from '../icons'

const isExternal = (href: string) => /^https?:\/\//.test(href)

// Yellow call-out under What's On (anonymous feedback form, report an IT problem)
export function FeedbackLink({
  href,
  title,
  text,
}: {
  href: string
  title: string
  text: string
}) {
  return (
    <a
      href={href}
      className="feedback-link"
      {...(isExternal(href) ? { target: '_blank', rel: 'noreferrer' } : {})}
    >
      <span className="feedback-link__title">{title}</span>
      <ArrowIcon className="feedback-link__arrow" />
      <span className="feedback-link__text">{text}</span>
    </a>
  )
}
