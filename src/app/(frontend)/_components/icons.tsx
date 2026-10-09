type IconProps = { className?: string }

// Arrow for the back, panel and quick links. Stroke follows currentColor.
export function ArrowIcon({ className }: IconProps) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M12.6453 13.2007V0.645386H0.645264M12.6453 0.645386L0.645264 13.2007"
        stroke="currentColor"
        strokeWidth="1.29069"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// Arrow used inside the yellow "Read more" / "View more" squares.
// Stroke follows currentColor so the hover state can invert it.
export function ReadMoreIcon({ className }: IconProps) {
  return (
    <svg className={className} width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
      <path
        d="M7.09896 7.09884V0.645386H0.645508M7.09896 0.645386L0.645508 7.09884"
        stroke="currentColor"
        strokeWidth="1.29069"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function SearchIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="6.75" cy="6.75" r="5" />
      <path d="m10.5 10.5 4 4" />
    </svg>
  )
}

export function LinkedInIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="2.5" y="8.5" width="4.25" height="13" />
      <circle cx="4.6" cy="4.4" r="2.4" />
      <path d="M9.5 8.5h4.1v1.8c.6-1.1 2-2.2 4.1-2.2 4.3 0 5.1 2.8 5.1 6.5v6.9h-4.2v-6.1c0-1.5 0-3.3-2-3.3s-2.4 1.6-2.4 3.2v6.2H9.5z" />
    </svg>
  )
}

export function XIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  )
}
