// Sets the Resources page objectives to the 2025/26 goals and objectives.
//
//   npm run payload run src/seed/seedObjectives.ts

import { getPayload } from 'payload'

import config from '@/payload.config'

const payload = await getPayload({ config: await config })

await payload.updateGlobal({
  slug: 'resources',
  data: {
    objectivesHeading: 'Objectives 2025/26',
    objectives: [
      {
        title: 'Efficiency',
        text: 'Reviewing processes, including the implementation of AI, and resource allocation to maximise efficiency.',
      },
      {
        title: 'Profitability',
        text: 'Reviewing retained fees and operational spend to maximise profitability.',
      },
      {
        title: 'Opportunity',
        text: 'Pushing the boundaries by pitching outside our comfort zone via new services or sectors.',
      },
      {
        title: 'Agility',
        text: 'Adapting our offering in real-time by responding to market trends and demands.',
      },
    ],
  },
})

console.log('Objectives updated.')
process.exit(0)
