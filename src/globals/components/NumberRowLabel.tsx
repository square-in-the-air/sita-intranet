'use client'

import { useRowLabel } from '@payloadcms/ui'

// Labels a row with just its position: 01, 02, 03 (matches the numbers on the site)
export function NumberRowLabel() {
  const { rowNumber } = useRowLabel()
  return <span>{String((rowNumber ?? 0) + 1).padStart(2, '0')}</span>
}
