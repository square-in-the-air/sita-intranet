import Link from 'next/link'

import { ArrowIcon } from './icons'

type Props = {
  title: string
  backHref?: string
  backLabel?: string
}

// Mint title band used at the top of inner pages
export function PageHero({ title, backHref = '/', backLabel = 'Back' }: Props) {
  return (
    <section className="page-hero">
      <div className="page-hero__inner container">
        <h1 className="page-hero__title">{title}</h1>
        <Link href={backHref} className="page-hero__back">
          {backLabel}
          <ArrowIcon />
        </Link>
      </div>
    </section>
  )
}
