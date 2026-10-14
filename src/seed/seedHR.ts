// Sets the HR page sections to the placeholder panels from the design
// (Employer branding, Training & development, Probation docs). Replace the
// items with real documents in Payload afterwards.
//
//   npm run payload run src/seed/seedHR.ts

import { getPayload } from 'payload'

import config from '@/payload.config'

const intro =
  'If AI has changed anything, it’s the value of originality. When any brand or agency can now generate mass.'

// [title, number of items]
const sections: [string, number][] = [
  ['Employer branding', 6],
  ['Training & development', 3],
  ['Probation docs', 3],
]

const payload = await getPayload({ config: await config })

await payload.updateGlobal({
  slug: 'hr',
  data: {
    sections: sections.map(([title, count]) => ({
      title,
      intro,
      documents: Array.from({ length: count }, (_, i) => ({
        label: `Item ${(i % 3) + 1}`,
        link: '#',
      })),
    })),
  },
})

console.log('HR sections updated.')
process.exit(0)
