'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export const navLinks = [
  { label: 'News', href: '/news' },
  { label: 'Resources', href: '/resources' },
  { label: 'HR', href: '/hr' },
  { label: 'Inspo board', href: '/inspo-board' },
  { label: 'Kudos board', href: '/kudos-board' },
  { label: 'What’s on', href: '/whats-on' },
]

// Client component so it can highlight the page you're on
export function HeaderNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Close the mobile menu after navigating
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)

  return (
    <>
      <button
        type="button"
        className={`header__toggle${open ? ' header__toggle--open' : ''}`}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="header-nav"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="header__toggle-bar" />
        <span className="header__toggle-bar" />
        <span className="header__toggle-bar" />
      </button>
      <nav
        id="header-nav"
        className={`header__nav${open ? ' header__nav--open' : ''}`}
        aria-label="Main"
      >
      {navLinks.map((link) => {
        const active = isActive(link.href)
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`header__link${active ? ' header__link--active' : ''}`}
            aria-current={active ? 'page' : undefined}
          >
            {link.label}
          </Link>
        )
      })}
      </nav>
    </>
  )
}
