import React from 'react'

import { PageHero } from '../_components/PageHero'
import { ViewMore } from '../_components/ViewMore'
import { InspoCard } from '../_components/home/InspoCard'
import { inspoItems } from '../_components/home/placeholderData'

const PAGE_SIZE = 4

export const metadata = { title: 'Inspo Board | SITA Intranet' }

export default async function InspoBoardPage({
  searchParams,
}: {
  searchParams: Promise<{ show?: string }>
}) {
  const { show } = await searchParams
  const count = Math.max(PAGE_SIZE, Number(show) || PAGE_SIZE)
  const items = inspoItems.slice(0, count)

  return (
    <>
      <PageHero title="Inspo board" />
      <div className="page container">
        <div className="inspo-list inspo-list--board">
          {items.map((item, i) => (
            <InspoCard key={i} item={item} size="large" />
          ))}
        </div>
        {inspoItems.length > count && <ViewMore href={`/inspo-board?show=${count + PAGE_SIZE}`} />}
      </div>
    </>
  )
}
