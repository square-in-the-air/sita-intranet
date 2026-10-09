import { placeholderArticle } from './home/placeholderData'

// Stand-in body for Inspo / Kudos articles until they come from Payload
export function PlaceholderArticleBody() {
  return (
    <>
      {placeholderArticle.sections.map((section) => (
        <section key={section.heading}>
          <h2>{section.heading}</h2>
          {section.text.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </section>
      ))}
    </>
  )
}
