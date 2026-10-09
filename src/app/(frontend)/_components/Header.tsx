import Link from 'next/link'

import { getLogo } from '../_lib/getLogo'
import { HeaderNav } from './HeaderNav'
import { HeaderSearch } from './HeaderSearch'

export async function Header() {
  const logo = await getLogo()

  return (
    <header className="header">
      <div className="header__wrapper header-container">
        <div className="header__logo">
          <Link href="/" className="header__logo-link">
            {logo?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="header__logo-img" src={logo.url} alt={logo.alt || 'SITA'} />
            ) : (
              <span className="header__logo-text">SITA</span>
            )}
          </Link>
        </div>

        <HeaderNav />

        <HeaderSearch />
      </div>
    </header>
  )
}
