import React from 'react'

import { LinkPanels } from '../_components/LinkPanels'
import { PageHero } from '../_components/PageHero'
import { hrPanels } from '../_components/pageContent'

export const metadata = { title: 'HR | SITA Intranet' }

export default function HRPage() {
  return (
    <>
      <PageHero title="HR" />
      <div className="page page--panels container">
        <LinkPanels panels={hrPanels} />
      </div>
    </>
  )
}
