import Link from 'next/link'

import { getLogo } from '../_lib/getLogo'

export async function Footer() {
  const logo = await getLogo()

  return (
    <footer className="footer">
      <div className="footer__wrapper container">
        <Link href="/" className="footer__logo-link">
          {logo?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="footer__logo-img" src={logo.url} alt={logo.alt || 'SITA'} />
          ) : (
            <span className="footer__logo-text">SITA</span>
          )}
        </Link>
      </div>
    </footer>
  )
}
