import { getPayload } from 'payload'

import config from '@/payload.config'
import { tickerPlaceholder } from './home/placeholderData'

type Message = { text: string; link?: string | null }

const isExternal = (href: string) => /^https?:\/\//.test(href)

// Roughly how wide one copy of the messages needs to be to fill a big screen
const MIN_TRACK_CHARS = 160

// Scrolling orange banner. Messages are edited in Payload (Globals → Ticker).
export async function Ticker() {
  const payload = await getPayload({ config: await config })
  const ticker = await payload.findGlobal({ slug: 'ticker', depth: 0 })

  if (ticker.enabled === false) return null
  const messages: Message[] = ticker.messages?.length ? ticker.messages : tickerPlaceholder

  // Repeat short messages so one copy is always wider than the screen
  const chars = messages.reduce((n, m) => n + m.text.length + 2, 0)
  const repeat = Math.max(1, Math.ceil(MIN_TRACK_CHARS / chars))
  const items = Array.from({ length: repeat }, () => messages).flat()
  // Keep the speed the same however much text there is
  const duration = `${Math.round(chars * repeat * 0.22)}s`

  const renderList = (copy: number) => (
    <ul className="ticker__list" key={copy} aria-hidden={copy > 0 || undefined}>
      {items.map((message, i) => (
        <li className="ticker__item" key={i}>
          {message.link ? (
            <a
              href={message.link}
              tabIndex={copy > 0 || i >= messages.length ? -1 : undefined}
              {...(isExternal(message.link) ? { target: '_blank', rel: 'noreferrer' } : {})}
            >
              {message.text}
            </a>
          ) : (
            message.text
          )}
        </li>
      ))}
    </ul>
  )

  return (
    <div className="ticker" role="region" aria-label="Announcements">
      {/* Two identical copies side by side make the loop seamless */}
      <div className="ticker__track" style={{ '--ticker-duration': duration } as React.CSSProperties}>
        {renderList(0)}
        {renderList(1)}
      </div>
    </div>
  )
}
