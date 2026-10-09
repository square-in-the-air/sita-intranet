import React from 'react'
import localFont from 'next/font/local'

import '@/styles/main.scss'
import { Footer } from './_components/Footer'
import { Header } from './_components/Header'

// Heading font: LutzHeadline (file in src/fonts)
const displayFont = localFont({
  src: '../../fonts/LutzHeadline-Regular.ttf',
  weight: '400',
  style: 'normal',
  variable: '--font-display',
  display: 'swap',
})

// Body font: Atkinson Hyperlegible (files in src/fonts)
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
  description: 'The SITA intranet.',
  title: 'SITA Intranet',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
