'use client'

import { useEffect, useRef, useState } from 'react'

import { SearchIcon } from './icons'

// Search icon that slides the search bar open sideways when clicked
export function HeaderSearch() {
  const [open, setOpen] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const close = () => {
    if (inputRef.current) inputRef.current.value = ''
    setOpen(false)
  }

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  return (
    <form
      ref={formRef}
      className={`header__search${open ? ' header__search--open' : ''}`}
      action="/search"
      role="search"
      onKeyDown={(e) => {
        if (e.key === 'Escape') close()
      }}
      onBlur={(e) => {
        // Tuck the bar away again when focus leaves it empty
        if (!formRef.current?.contains(e.relatedTarget) && !inputRef.current?.value) setOpen(false)
      }}
    >
      <input
        ref={inputRef}
        className="header__search-input"
        type="search"
        name="q"
        placeholder="Search policies, forms, people..."
        aria-label="Search the intranet"
        tabIndex={open ? 0 : -1}
      />
      <button
        type="submit"
        className="header__search-button"
        aria-label={open ? 'Search' : 'Open search'}
        aria-expanded={open}
        onClick={(e) => {
          // Closed or empty: just toggle. With text in the box it submits.
          if (!open) {
            e.preventDefault()
            setOpen(true)
          } else if (!inputRef.current?.value) {
            e.preventDefault()
            setOpen(false)
          }
        }}
      >
        <SearchIcon className="header__search-icon" />
      </button>
    </form>
  )
}
