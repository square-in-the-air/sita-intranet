import Link from 'next/link'

import { ReadMoreIcon } from './icons'

type Props = { href: string; label?: string; align?: 'center' | 'start' }

export function ViewMore({ href, label = 'View more', align = 'center' }: Props) {
  return (
    <div className={`view-more${align === 'start' ? ' view-more--start' : ''}`}>
      <Link href={href} className="view-more__link" scroll={false}>
        {label}
        <span className="view-more__icon">
          <ReadMoreIcon />
        </span>
      </Link>
    </div>
  )
}
