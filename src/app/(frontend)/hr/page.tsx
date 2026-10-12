import React from 'react'

import { LinkPanels } from '../_components/LinkPanels'
import { PageHero } from '../_components/PageHero'
import { hrPanels } from '../_components/pageContent'
import { getPanels } from '../_lib/getPanels'

export const metadata = { title: 'HR | SITA Intranet' }

export default async function HRPage() {
  const panels = (await getPanels('hr')) ?? hrPanels

  return (
    <>
      <PageHero title="HR" />
      <div className="page page--panels container">
        <LinkPanels panels={panels} />
      </div>
    </>
  )
}
