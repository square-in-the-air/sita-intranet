export type Objective = {
  title: string
  text: string
}

export function Objectives({
  heading,
  label,
  items,
}: {
  heading: string
  label?: string
  items: Objective[]
}) {
  return (
    <section className="objectives" id="objectives">
      <div className="objectives__header">
        <h2 className="objectives__heading">{heading}</h2>
        {label && <p className="objectives__label">{label}</p>}
      </div>
      <ol className="objectives__list">
        {items.map((item, i) => (
          <li className="objective" key={i}>
            <span className="objective__number">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="objective__title">{item.title}</h3>
            <p className="objective__text">{item.text}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
