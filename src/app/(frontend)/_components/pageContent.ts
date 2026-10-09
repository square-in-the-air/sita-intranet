// Placeholder content for the Resources and HR pages. Swap for a Payload
// collection/global once the real content is ready.

import type { LinkPanel } from './LinkPanels'
import type { Objective } from './Objectives'

const intro =
  'If AI has changed anything, it’s the value of originality. When any brand or agency can now generate mass.'

// TODO: replace '#' with the real document/page links
const items = (n: number) =>
  Array.from({ length: n }, (_, i) => ({ label: `Item ${(i % 3) + 1}`, href: '#' }))

export const objectivesHeading = 'Objectives [year]'

export const objectives: Objective[] = [
  { title: '[Objective one]', text: '[What it means and how we’ll measure it.]' },
  { title: '[Objective two]', text: '[What it means and how we’ll measure it.]' },
  { title: '[Objective three]', text: '[What it means and how we’ll measure it.]' },
]

export const resourcePanels: LinkPanel[] = [
  { title: 'Branded templates', intro, links: items(3) },
  { title: 'Training & development', intro, links: items(3) },
  { title: 'How to guides', intro, links: items(3) },
  { title: 'Office resources', intro, links: items(3) },
]

export const hrPanels: LinkPanel[] = [
  { title: 'Employer branding', intro, links: items(6) },
  { title: 'Training & development', intro, links: items(3) },
  { title: 'Probation docs', intro, links: items(3) },
]
