// Date helpers for the What's On features.
// Everything works in whole days (UTC midnight timestamps) so day-only dates
// from Payload compare cleanly, and "today" is worked out in UK time.

export const DAY = 24 * 60 * 60 * 1000

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const shortMonth = (month: number) => MONTHS[month].slice(0, 3)

// Today's date in London, as a UTC-midnight timestamp
export function today(): number {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(new Date())
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value)
  return Date.UTC(get('year'), get('month') - 1, get('day'))
}

// Payload stores day-only dates around midday, so the UTC date is the picked date
export function toDay(value: string | Date): number {
  const d = new Date(value)
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
}

// "12 Nov" (or "XX Nov" when the day isn't confirmed)
export function formatDayMonth(day: number, dayTBC = false): string {
  const d = new Date(day)
  return `${dayTBC ? 'XX' : d.getUTCDate()} ${shortMonth(d.getUTCMonth())}`
}

// "12 Nov 2026" (or "XX Nov 2026")
export function formatFullDate(day: number, dayTBC = false): string {
  return `${formatDayMonth(day, dayTBC)} ${new Date(day).getUTCFullYear()}`
}

// Monday of the week the day falls in
export function weekCommencing(day: number): number {
  const weekday = (new Date(day).getUTCDay() + 6) % 7 // Mon = 0
  return day - weekday * DAY
}
