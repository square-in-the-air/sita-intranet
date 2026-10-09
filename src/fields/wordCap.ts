// Validation helper for text/textarea fields that need a word limit.
// Keeps the What's On cards (and anything else that uses it) an even length.

export const countWords = (value: unknown): number =>
  typeof value === 'string' ? value.trim().split(/\s+/).filter(Boolean).length : 0

export const wordCap =
  (max: number) =>
  (value: unknown): true | string => {
    const words = countWords(value)
    return words <= max ? true : `Keep this to ${max} words or fewer (currently ${words}).`
  }
