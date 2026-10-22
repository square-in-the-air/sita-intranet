import React from 'react'

import { LinkPanels } from '../_components/LinkPanels'
import { PageHero } from '../_components/PageHero'
import { getPanels } from '../_lib/getPanels'

export const metadata = { title: 'Finance | SITA Intranet' }

export default async function FinancePage() {
  const panels = (await getPanels('finance')) ?? []

  return (
    <>
      <PageHero title="Finance" />
      <div className="page page--panels container">
        <LinkPanels panels={panels} />
      </div>
    </>
  )
}
