import { ArrowIcon, InstagramIcon, LinkedInIcon, XIcon } from '../icons'
import { SectionHeader } from './SectionHeader'

export type QuickLink = {
  label: string
  href: string
  variant?: 'highlight' | 'dark'
}

export type SocialLinks = {
  linkedin: string
  x: string
  instagram: string
}

const isExternal = (href: string) => /^https?:\/\//.test(href)

export function QuickLinks({ links, socials }: { links: QuickLink[]; socials: SocialLinks }) {
  return (
    <>
      <SectionHeader title="Quick links">
        <div className="socials">
          <a className="socials__link" href={socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <LinkedInIcon />
          </a>
          <a className="socials__link" href={socials.x} target="_blank" rel="noreferrer" aria-label="X">
            <XIcon />
          </a>
          <a className="socials__link" href={socials.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
            <InstagramIcon />
          </a>
        </div>
      </SectionHeader>

      <ul className="quick-links">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className={`quick-links__link${link.variant ? ` quick-links__link--${link.variant}` : ''}`}
              {...(isExternal(link.href) ? { target: '_blank', rel: 'noreferrer' } : {})}
            >
              {link.label}
              <ArrowIcon />
            </a>
          </li>
        ))}
      </ul>
    </>
  )
}
