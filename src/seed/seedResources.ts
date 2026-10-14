// Sets the Resources page sections to the four placeholder panels from the design
// (Behaviours, Job descriptions, Driving for work, Finance), each with an intro and
// three items. Replace the items with real documents in Payload afterwards.
//
//   npm run payload run src/seed/seedResources.ts

import { getPayload } from 'payload'

import config from '@/payload.config'

const intro =
  'If AI has changed anything, it’s the value of originality. When any brand or agency can now generate mass.'

const titles = ['Behaviours', 'Job descriptions', 'Driving for work', 'Finance']

const run = async () => {
  const payload = await getPayload({ config: await config })

  const current = await payload.findGlobal({ slug: 'resources', depth: 0 })
  console.log('Replacing sections:', JSON.stringify(current.sections?.map((s) => ({ title: s.title, docs: s.documents?.length })), null, 2))

  await payload.updateGlobal({
    slug: 'resources',
    data: {
      sections: titles.map((title) => ({
        title,
        intro,
        documents: [1, 2, 3].map((n) => ({ label: `Item ${n}`, link: '#' })),
      })),
    },
  })
  console.log('Resources sections updated.')
  process.exit(0)
}

await run()
