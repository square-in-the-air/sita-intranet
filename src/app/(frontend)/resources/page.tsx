import React from 'react'

import { LinkPanels } from '../_components/LinkPanels'
import { Objectives } from '../_components/Objectives'
import { PageHero } from '../_components/PageHero'
import { objectives, objectivesHeading, resourcePanels } from '../_components/pageContent'
import { getObjectives, getPanels } from '../_lib/getPanels'

export const metadata = { title: 'Resources | SITA Intranet' }

export default async function ResourcesPage() {
  const [panelsFromAdmin, objectivesFromAdmin] = await Promise.all([getPanels('resources'), getObjectives()])
  const panels = panelsFromAdmin ?? resourcePanels
  const objectivesBlock = objectivesFromAdmin ?? {
    heading: objectivesHeading,
    label: 'Where we’re heading',
    items: objectives,
  }

  return (
    <>
      <PageHero title="Resources" />
      <div className="page container">
        <Objectives {...objectivesBlock} />
        <LinkPanels panels={panels} />
      </div>
    </>
  )
}
