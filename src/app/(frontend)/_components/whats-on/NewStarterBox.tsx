import { formatFullDate } from '../../_lib/dates'
import type { NewStarter } from '../../_lib/whatsOn'
import { ArrowIcon } from '../icons'

// Dark box per new starter. Links to their intro slide when one's uploaded.
export function NewStarterBox({ starter }: { starter: NewStarter }) {
  const content = (
    <>
      <p className="new-starter-box__date">{formatFullDate(starter.day)}</p>
      <h3 className="new-starter-box__title">{starter.name}’s first day</h3>
      <p className="new-starter-box__intro">{starter.intro}</p>
      {starter.slideUrl && <ArrowIcon className="new-starter-box__arrow" />}
    </>
  )

  return starter.slideUrl ? (
    <a
      href={starter.slideUrl}
      className="new-starter-box new-starter-box--link"
      target="_blank"
      rel="noreferrer"
      aria-label={`${starter.name}’s first day – view their intro slide`}
    >
      {content}
    </a>
  ) : (
    <div className="new-starter-box">{content}</div>
  )
}
