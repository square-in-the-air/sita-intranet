import Link from 'next/link'
import React from 'react'

import { SearchIcon } from '../_components/icons'
import { askCommsHref } from '../_components/home/placeholderData'
import { isSearchSection, search, searchSections, type SearchResult } from '../_lib/search'

export const metadata = { title: 'Search | SITA Intranet' }

const suggestions = ['Expenses', 'Holiday', 'Sickness', 'Invoice']

const isExternal = (href: string) => /^https?:\/\//.test(href)

const searchHref = (q: string, section?: string) =>
  `/search?q=${encodeURIComponent(q)}${section ? `&section=${section}` : ''}`

const sectionLabel = (value: string) => searchSections.find((s) => s.value === value)?.label ?? value

function ResultCard({ result }: { result: SearchResult }) {
  return (
    <li>
      <a
        href={result.href}
        className="search-result"
        {...(isExternal(result.href) ? { target: '_blank', rel: 'noreferrer' } : {})}
      >
        <span className="search-result__meta">
          <span className={`search-result__tag search-result__tag--${result.section}`}>
            {sectionLabel(result.section)}
          </span>
          <span className="search-result__type">{result.type}</span>
        </span>
        <h2 className="search-result__title">{result.title}</h2>
        {result.summary && <p className="search-result__summary">{result.summary}</p>}
        <p className="search-result__crumbs">{result.breadcrumb.join(' › ')}</p>
      </a>
    </li>
  )
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; section?: string }>
}) {
  const params = await searchParams
  const query = (params.q ?? '').trim()
  const section = isSearchSection(params.section) ? params.section : undefined

  const results = await search(query)
  const shown = section ? results.filter((r) => r.section === section) : results
  const countFor = (value: string) => results.filter((r) => r.section === value).length

  const tabs = [
    { value: undefined, label: 'All', count: results.length },
    ...searchSections
      .filter((s) => s.alwaysShow || countFor(s.value) > 0)
      .map((s) => ({ value: s.value, label: s.label, count: countFor(s.value) })),
  ]

  return (
    <>
      <section className="search-hero">
        <div className="search-hero__inner container">
          <h1 className="search-hero__title">Search</h1>
          <form className="search-hero__form" action="/search" role="search">
            <div className="search-hero__field">
              <SearchIcon className="search-hero__icon" />
              <input
                className="search-hero__input"
                type="search"
                name="q"
                defaultValue={query}
                placeholder="Search policies, forms, people..."
                aria-label="Search the intranet"
                autoFocus={!query}
              />
            </div>
            {query && (
              <Link href="/search" className="search-hero__clear">
                Clear
              </Link>
            )}
          </form>
        </div>
      </section>

      <div className="page container">
        <div className="search-page">
          <div className="search-page__main">
            {query ? (
              <>
                <nav className="search-tabs" aria-label="Filter results">
                  {tabs.map((tab) => {
                    const active = tab.value === section
                    return (
                      <Link
                        key={tab.label}
                        href={searchHref(query, tab.value)}
                        className={`search-tabs__tab${active ? ' search-tabs__tab--active' : ''}`}
                        aria-current={active ? 'page' : undefined}
                        scroll={false}
                      >
                        {tab.label}
                        <span className="search-tabs__count">{tab.count}</span>
                      </Link>
                    )
                  })}
                </nav>

                <p className="search-page__summary" aria-live="polite">
                  {shown.length} {shown.length === 1 ? 'result' : 'results'} for “{query}”
                  {section && ` in ${sectionLabel(section)}`}
                </p>

                {shown.length > 0 ? (
                  <ul className="search-page__results">
                    {shown.map((result) => (
                      <ResultCard key={result.id} result={result} />
                    ))}
                  </ul>
                ) : (
                  <p className="search-page__empty">
                    Nothing matched. Try a different word, or let Internal Comms know what you were
                    looking for.
                  </p>
                )}
              </>
            ) : (
              <div className="search-page__start">
                <p className="search-page__summary">Popular searches</p>
                <div className="search-tabs">
                  {suggestions.map((s) => (
                    <Link key={s} href={searchHref(s.toLowerCase())} className="search-tabs__tab">
                      {s}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="search-page__aside">
            <div className="cant-find">
              <h2 className="cant-find__title">Can’t find it?</h2>
              <p className="cant-find__text">
                Tell Internal Comms what you were looking for and we’ll add it to the Hub.
              </p>
              <a href={askCommsHref} className="cant-find__button">
                Ask Comms
              </a>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
