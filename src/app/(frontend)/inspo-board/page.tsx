import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { PageHero } from '../_components/PageHero'
import { ViewMore } from '../_components/ViewMore'
import { InspoCard } from '../_components/home/InspoCard'
import { toInspoItem } from '../_lib/posts'

const PAGE_SIZE = 4

export const metadata = { title: 'Inspo Board | SITA Intranet' }

export default async function InspoBoardPage({
  searchParams,
}: {
  searchParams: Promise<{ show?: string }>
}) {
  const { show } = await searchParams
  const count = Math.max(PAGE_SIZE, Number(show) || PAGE_SIZE)

  const payload = await getPayload({ config: await config })

  const inspo = await payload.find({
    collection: 'inspo',
    where: { _status: { equals: 'published' } },
    sort: '-publishedDate',
    limit: count,
    depth: 1,
  })

  return (
    <>
      <PageHero title="Inspo board" />
      <div className="page container">
        {inspo.docs.length === 0 ? (
          <p className="dashboard__empty">No inspo posts yet.</p>
        ) : (
          <div className="inspo-list inspo-list--board">
            {inspo.docs.map((doc) => (
              <InspoCard key={doc.id} item={toInspoItem(doc)} size="large" />
            ))}
          </div>
        )}
        {inspo.totalDocs > count && <ViewMore href={`/inspo-board?show=${count + PAGE_SIZE}`} />}
      </div>
    </>
  )
}
