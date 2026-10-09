import Link from 'next/link'
import React from 'react'

import { ReadMoreIcon } from '../icons'

type Props = {
  title: string
  href?: string
  linkLabel?: string
  children?: React.ReactNode
}

export function SectionHeader({ title, href, linkLabel, children }: Props) {
  return (
    <div className="section-header">
      <h2 className="section-header__title">{title}</h2>
      {href && linkLabel && (
        <Link href={href} className="section-header__link">
          {linkLabel}
          <ReadMoreIcon className="section-header__arrow" />
        </Link>
      )}
      {children}
    </div>
  )
}
