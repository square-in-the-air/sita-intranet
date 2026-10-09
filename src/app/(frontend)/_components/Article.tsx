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
  // Bold intro paragraph. Mentions of "Square In The Air" are picked out in coral.
  lead?: string | null
  backHref: string
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

// "Brighton SEO: 2026 takeaways" → the part up to the colon is coral
function Title({ text }: { text: string }) {
  const colon = text.indexOf(':')
  if (colon < 1) return <>{text}</>
  return (
    <>
      <span className="article__accent">{text.slice(0, colon + 1)}</span>
      {text.slice(colon + 1)}
    </>
  )
}

function Lead({ text }: { text: string }) {
  const parts = text.split(/(Square In The Air(?:[’']s)?)/i)
  return (
    <p className="article__lead">
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span className="article__accent" key={i}>
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </p>
  )
}

// Shared single-article template for News, Inspo board and Kudos board posts
export function Article({ title, author, date, image, lead, backHref, children }: Props) {
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

      {image?.url && (
        <div className="article__image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image.url} alt={image.alt || ''} />
        </div>
      )}

      <div className="article__content container">
        {lead && <Lead text={lead} />}
        {children && <div className="article__body">{children}</div>}

        <a href={askCommsHref} className="article__questions">
          <span className="article__questions-title">Any questions?</span>
          <span className="article__questions-text">Let us know, our door is always open.</span>
        </a>
      </div>
    </article>
  )
}
