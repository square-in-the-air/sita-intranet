'use client'

import { useRowLabel } from '@payloadcms/ui'

// Shows the row's own name (a label or section title, e.g. "News") instead of "Item 01"
export function NavRowLabel() {
  const { data, rowNumber } = useRowLabel<{ label?: string; title?: string }>()
  return (
    <span>{data?.label || data?.title || `Item ${String((rowNumber ?? 0) + 1).padStart(2, '0')}`}</span>
  )
}
