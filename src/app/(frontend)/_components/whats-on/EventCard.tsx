import { formatFullDate } from '../../_lib/dates'
import type { EventItem } from '../../_lib/whatsOn'

export function EventCard({ event }: { event: EventItem }) {
  return (
    <article className="event-card">
      <p className="event-card__date">{formatFullDate(event.day, event.dayTBC)}</p>
      <h3 className="event-card__title">{event.title}</h3>
      {event.organiser && <p className="event-card__organiser">Organiser: {event.organiser}</p>}
      {event.description && (
        <p className="event-card__text">{event.description}</p>
      )}
    </article>
  )
}
