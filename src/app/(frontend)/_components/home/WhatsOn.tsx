export type WhatsOnItem = {
  date: string
  title: string
}

export function WhatsOn({ items }: { items: WhatsOnItem[] }) {
  return (
    <ul className="whats-on">
      {items.length === 0 && (
        <li className="whats-on__item">
          <span className="whats-on__title">Nothing coming up yet</span>
        </li>
      )}
      {items.map((item) => (
        <li className="whats-on__item" key={`${item.date}-${item.title}`}>
          <span className="whats-on__date">{item.date}</span>
          <span className="whats-on__title" title={item.title}>
            {item.title}
          </span>
        </li>
      ))}
    </ul>
  )
}
