import { ArrowIcon } from '../icons'

const isExternal = (href: string) => /^https?:\/\//.test(href)

// Yellow call-out under What's On linking to the anonymous feedback form
export function FeedbackLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      className="feedback-link"
      {...(isExternal(href) ? { target: '_blank', rel: 'noreferrer' } : {})}
    >
      <span className="feedback-link__title">Anonymous company feedback link</span>
      <ArrowIcon className="feedback-link__arrow" />
      <span className="feedback-link__text">
        Think we could improve in an area? Let us know anonymously!
      </span>
    </a>
  )
}
