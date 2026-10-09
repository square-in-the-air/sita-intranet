import { SearchIcon } from '../icons'

export function SearchBar() {
  return (
    <form className="search-bar" action="/search" role="search">
      <div className="search-bar__field">
        <SearchIcon className="search-bar__icon" />
        <input
          className="search-bar__input"
          type="search"
          name="q"
          placeholder={'What are you looking for? Try “expenses” or “holiday”'}
          aria-label="Search the intranet"
        />
      </div>
      <button className="search-bar__button" type="submit">
        Search
      </button>
    </form>
  )
}
