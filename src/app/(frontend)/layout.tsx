import React from 'react'
import localFont from 'next/font/local'

import { getPayload } from 'payload'

import config from '@/payload.config'
import { getAdminLogo } from '@/components/getAdminLogo'
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

// The favicon is the dark alternative logo (Globals → Logo), which reads on light browser tabs
export async function generateMetadata() {
  const payload = await getPayload({ config: await config })
  const { url } = await getAdminLogo(payload)

  return {
    description: 'The SITA intranet.',
    title: 'SITA Intranet',
    icons: { icon: url },
  }
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
