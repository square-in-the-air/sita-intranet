import React from 'react'

import { PageHero } from '../_components/PageHero'
import { ViewMore } from '../_components/ViewMore'
import { KudosBoardCard } from '../_components/home/KudosBoardCard'
import { kudosItems } from '../_components/home/placeholderData'

const PAGE_SIZE = 4

export const metadata = { title: 'Kudos Board | SITA Intranet' }

export default async function KudosBoardPage({
  searchParams,
}: {
  searchParams: Promise<{ show?: string }>
}) {
  const { show } = await searchParams
  const count = Math.max(PAGE_SIZE, Number(show) || PAGE_SIZE)
  const items = kudosItems.slice(0, count)

  return (
    <>
      <PageHero title="Kudos board" />
      <div className="page container">
        <div className="inspo-list inspo-list--board">
          {items.map((item, i) => (
            <KudosBoardCard key={i} item={item} />
          ))}
        </div>
        {kudosItems.length > count && <ViewMore href={`/kudos-board?show=${count + PAGE_SIZE}`} />}
      </div>
    </>
  )
}
