import Link from 'next/link'

import { ReadMoreIcon } from '../icons'

// Mint box at the foot of the homepage linking to the full objectives
export function CompanyObjective({ text, href }: { text: string; href: string }) {
  return (
    <Link href={href} className="company-objective">
      <p className="company-objective__label">Company objective</p>
      <h2 className="company-objective__title">{text}</h2>
      <span className="company-objective__more">
        Read all
        <span className="company-objective__icon">
          <ReadMoreIcon />
        </span>
      </span>
    </Link>
  )
}
