import { ArrowIcon } from './icons'

export type LinkPanel = {
  title: string
  intro?: string
  links: { label: string; href: string }[]
}

const isExternal = (href: string) => /^https?:\/\//.test(href)

// Cream panels with a list of white link rows (Resources + HR pages).
// Panels are dealt into two columns, each going into whichever column is
// shorter so tall panels don't leave big gaps. On mobile the columns collapse
// and the panels show in their original order.
export function LinkPanels({ panels }: { panels: LinkPanel[] }) {
  const columns: { panel: LinkPanel; index: number }[][] = [[], []]
  const heights = [0, 0]

  panels.forEach((panel, index) => {
    const col = heights[0] <= heights[1] ? 0 : 1
    columns[col].push({ panel, index })
    heights[col] += panel.links.length + 2 // +2 roughly accounts for title & intro
  })

  return (
    <div className="link-panels">
      {columns.map((column, c) => (
        <div className="link-panels__column" key={c}>
          {column.map(({ panel, index }) => (
            <section className="link-panel" key={panel.title} style={{ order: index }}>
              <h2 className="link-panel__title">{panel.title}</h2>
              {panel.intro && <p className="link-panel__intro">{panel.intro}</p>}
              <ul className="link-panel__list">
                {panel.links.map((link, i) => (
                  <li key={i}>
                    <a
                      href={link.href}
                      className="link-panel__link"
                      {...(isExternal(link.href) ? { target: '_blank', rel: 'noreferrer' } : {})}
                    >
                      {link.label}
                      <ArrowIcon />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      ))}
    </div>
  )
}
