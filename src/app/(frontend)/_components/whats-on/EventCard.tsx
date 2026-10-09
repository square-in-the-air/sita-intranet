import { EVENT_DESCRIPTION_WORDS, EVENT_TITLE_WORDS } from '@/collections/Events'
import { formatFullDate } from '../../_lib/dates'
import { truncateWords } from '../../_lib/excerpt'
import type { EventItem } from '../../_lib/whatsOn'

export function EventCard({ event }: { event: EventItem }) {
  return (
    <article className="event-card">
      <p className="event-card__date">{formatFullDate(event.day, event.dayTBC)}</p>
      {/* Caps are enforced in the CMS too; trimming here is just a safety net */}
      <h3 className="event-card__title">{truncateWords(event.title, EVENT_TITLE_WORDS)}</h3>
      {event.organiser && <p className="event-card__organiser">Organiser: {event.organiser}</p>}
      {event.description && (
        <p className="event-card__text">{truncateWords(event.description, EVENT_DESCRIPTION_WORDS)}</p>
      )}
    </article>
  )
}
