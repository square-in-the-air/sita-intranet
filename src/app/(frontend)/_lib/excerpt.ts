// Plain-text previews for cards

export const EXCERPT_LENGTH = 250

type LexicalNode = { text?: string; children?: LexicalNode[]; type?: string }

// Flattens a Lexical rich text value into plain text, one space between blocks
export function richTextToPlainText(value: unknown): string {
  const root = (value as { root?: LexicalNode } | null | undefined)?.root
  if (!root) return ''

  const walk = (node: LexicalNode): string => {
    if (typeof node.text === 'string') return node.text
    if (node.type === 'linebreak') return ' '
    const text = (node.children ?? []).map(walk).join('')
    return node.type === 'paragraph' || node.type === 'heading' || node.type === 'listitem'
      ? `${text} `
      : text
  }

  return walk(root).replace(/\s+/g, ' ').trim()
}

// Cuts at `limit` characters (backing up to the last whole word) and adds an ellipsis
export function truncate(text: string, limit = EXCERPT_LENGTH): string {
  if (text.length <= limit) return text
  const cut = text.slice(0, limit)
  const atWordEnd = /\s/.test(text[limit])
  const trimmed = atWordEnd ? cut : cut.slice(0, Math.max(cut.lastIndexOf(' '), 0) || limit)
  return `${trimmed.trimEnd()}…`
}

// Cuts at `limit` words and adds an ellipsis
export function truncateWords(text: string, limit: number): string {
  const words = text.trim().split(/\s+/).filter(Boolean)
  return words.length <= limit ? text.trim() : `${words.slice(0, limit).join(' ')}…`
}
