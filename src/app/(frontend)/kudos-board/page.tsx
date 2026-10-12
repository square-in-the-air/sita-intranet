import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { PageHero } from '../_components/PageHero'
import { ViewMore } from '../_components/ViewMore'
import { KudosBoardCard } from '../_components/home/KudosBoardCard'
import { toKudosItem } from '../_lib/posts'

const PAGE_SIZE = 4

export const metadata = { title: 'Kudos Board | SITA Intranet' }

export default async function KudosBoardPage({
  searchParams,
}: {
  searchParams: Promise<{ show?: string }>
}) {
  const { show } = await searchParams
  const count = Math.max(PAGE_SIZE, Number(show) || PAGE_SIZE)

  const payload = await getPayload({ config: await config })

  const kudos = await payload.find({
    collection: 'kudos',
    where: { _status: { equals: 'published' } },
    sort: '-publishedDate',
    limit: count,
    depth: 2,
  })

  return (
    <>
      <PageHero title="Kudos board" />
      <div className="page container">
        {kudos.docs.length === 0 ? (
          <p className="dashboard__empty">No kudos posts yet.</p>
        ) : (
          <div className="inspo-list inspo-list--board">
            {kudos.docs.map((doc) => (
              <KudosBoardCard key={doc.id} item={toKudosItem(doc)} />
            ))}
          </div>
        )}
        {kudos.totalDocs > count && <ViewMore href={`/kudos-board?show=${count + PAGE_SIZE}`} />}
      </div>
    </>
  )
}
