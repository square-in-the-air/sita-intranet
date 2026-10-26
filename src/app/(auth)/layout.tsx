import React from 'react'
import localFont from 'next/font/local'

import '@/styles/main.scss'

// The sign in page sits outside the (frontend) layout on purpose, so signed out
// visitors don't get the header, navigation or search. Same fonts as the site.
const displayFont = localFont({
  src: '../../fonts/LutzHeadline-Regular.ttf',
  weight: '400',
  style: 'normal',
  variable: '--font-display',
  display: 'swap',
})

const bodyFont = localFont({
  src: [
    { path: '../../fonts/AtkinsonHyperlegible-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../../fonts/AtkinsonHyperlegible-Italic.ttf', weight: '400', style: 'italic' },
    { path: '../../fonts/AtkinsonHyperlegible-Bold.ttf', weight: '700', style: 'normal' },
    { path: '../../fonts/AtkinsonHyperlegible-BoldItalic.ttf', weight: '700', style: 'italic' },
  ],
  variable: '--font-body',
  display: 'swap',
})

export const metadata = {
  description: 'Sign in to the SITA intranet.',
  title: 'Sign in | SITA Intranet',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body>{children}</body>
    </html>
  )
}
