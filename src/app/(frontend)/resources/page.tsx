import React from 'react'

import { LinkPanels } from '../_components/LinkPanels'
import { Objectives } from '../_components/Objectives'
import { PageHero } from '../_components/PageHero'
import { objectives, objectivesHeading, resourcePanels } from '../_components/pageContent'

export const metadata = { title: 'Resources | SITA Intranet' }

export default function ResourcesPage() {
  return (
    <>
      <PageHero title="Resources" />
      <div className="page container">
        <Objectives heading={objectivesHeading} label={'Where we’re heading'} items={objectives} />
        <LinkPanels panels={resourcePanels} />
      </div>
    </>
  )
}
