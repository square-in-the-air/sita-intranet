import Link from 'next/link'
import React from 'react'

import { ArrowIcon } from './icons'
import { askCommsHref } from './home/placeholderData'

type Props = {
  title: string
  author?: string | null
  // Already formatted, e.g. "23.07.25"
  date?: string | null
  image?: { url?: string | null; alt?: string | null } | null
  // Extra images: with these, the hero area is split equally between all the images
  gallery?: { url?: string | null; alt?: string | null }[]
  backHref: string
  // Shown on the button at the bottom, e.g. "Back to news"
  backLabel?: string
  children?: React.ReactNode
}

// "23.07.25"
export const formatArticleDate = (value: string) =>
  new Date(value).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    timeZone: 'Europe/London',
  }).replace(/\//g, '.')

// The first half of the title (by words) is coral, rounded up for odd counts
function Title({ text }: { text: string }) {
  const words = text.trim().split(/\s+/)
  const split = Math.ceil(words.length / 2)
  return (
    <>
      <span className="article__accent">{words.slice(0, split).join(' ')}</span>
      {words.length > split && ` ${words.slice(split).join(' ')}`}
    </>
  )
}

// Shared single-article template for News, Inspo board and Kudos board posts
export function Article({ title, author, date, image, gallery = [], backHref, backLabel = 'Back', children }: Props) {
  // The hero image first, then any extra images, all shown side by side in the hero area
  const heroImages = [image, ...gallery].filter((img): img is { url: string; alt?: string | null } => Boolean(img?.url))

  return (
    <article className="article">
      <header className="article__header container">
        <div className="article__heading">
          {author && <p className="article__author">{author}</p>}
          <h1 className="article__title">
            <Title text={title} />
          </h1>
          {date && <p className="article__date">{date}</p>}
        </div>
        <Link href={backHref} className="page-hero__back article__back">
          Back
          <ArrowIcon />
        </Link>
      </header>

      {heroImages.length > 0 && (
        <div className={`article__image${heroImages.length > 1 ? ' article__image--split' : ''}`}>
          {heroImages.map((img, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={img.url ?? ''} alt={img.alt || ''} />
          ))}
        </div>
      )}

      <div className="article__content container">
        {children && <div className="article__body">{children}</div>}

        <a href={askCommsHref} className="article__questions">
          <span className="article__questions-title">Any questions?</span>
          <span className="article__questions-text">Let us know, our door is always open.</span>
        </a>

        <div className="article__back-bottom">
          <Link href={backHref} className="page-hero__back">
            {backLabel}
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </article>
  )
}
