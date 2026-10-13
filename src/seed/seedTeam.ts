// Adds the Square in the Air team (from squareintheair.com/our-team) to Employees,
// with their job title and team. Safe to re-run: anyone already there is skipped.
//
//   npm run payload run src/seed/seedTeam.ts

import { getPayload } from 'payload'

import config from '@/payload.config'

type Dept = 'b2b-pr' | 'consumer-pr' | 'creative' | 'design' | 'management' | 'social' | 'video'

// [first name, last name, job title, team]
// Where the site lists two teams, the specific team is used (e.g. a B2B Director is B2B PR).
const team: [string, string, string, Dept][] = [
  ['Ben', 'Cleminson', 'Chief Executive Officer', 'management'],
  ['Ollie', 'Drew', 'Chief Operating Officer', 'management'],
  ['Robin', 'Hutchison', 'Chief Commercial Officer', 'management'],
  ['Hugh', 'Johnson', 'Chief Client Officer', 'creative'],
  ['Nick', 'Withersby', 'Chief Creative Officer', 'creative'],
  ['Lewis', 'Phillips', 'B2B Director', 'b2b-pr'],
  ['Lina', 'Sennevall', 'B2B Director', 'b2b-pr'],
  ['Tom', 'Marriott', 'PR Director', 'consumer-pr'],
  ['Tom', 'Sweetman', 'Digital PR Director', 'consumer-pr'],
  ['Ellen', 'Kerbey', 'Creative Director', 'design'],
  ['Adam', 'Russell', 'Social Media Director', 'social'],
  ['Stewart', 'Darkin', 'Director', 'video'],
  ['Bill', 'Esdaile', 'Chairman', 'management'],
  ['Annette', 'Miller', 'Head of HR', 'management'],
  ['Sam', 'Gascoyne', 'Senior Affiliate PR Manager', 'b2b-pr'],
  ['Sam', 'Goodall', 'Account Director', 'b2b-pr'],
  ['Matt', 'Chambers', 'Senior Account Manager', 'b2b-pr'],
  ['Dan', 'Snook', 'Senior Account Manager', 'b2b-pr'],
  ['Sophie', 'Norris', 'Senior Account Manager', 'b2b-pr'],
  ['Jake', 'Rolfe', 'Senior Account Manager', 'b2b-pr'],
  ['Isabella', 'Aslam', 'Account Manager', 'b2b-pr'],
  ['Jasmine', 'Jones', 'Account Manager', 'b2b-pr'],
  ['Eli', 'Haidari', 'Senior Account Executive', 'b2b-pr'],
  ['Amber', 'Harwood', 'Account Executive', 'b2b-pr'],
  ['Inigo', 'Grose', 'Senior Account Manager', 'consumer-pr'],
  ['Ed', 'Culham', 'Account Manager', 'consumer-pr'],
  ['Charles', 'Orchard', 'Account Manager', 'consumer-pr'],
  ['Paddy', 'Crossan', 'Senior Account Executive', 'consumer-pr'],
  ['Joe', 'Clark', 'Senior Account Executive', 'consumer-pr'],
  ['Jamie', 'Woollen', 'Account Executive', 'consumer-pr'],
  ['Luke', 'Duffy', 'Account Executive', 'consumer-pr'],
  ['Alex', 'Day', 'Senior Brand Designer', 'design'],
  ['Gurdain', 'Bharj', 'Senior Multimedia Designer', 'design'],
  ['Thomas', 'Deveney', 'Mid-Weight Developer', 'design'],
  ['Armen', 'Olivar', 'Mid-weight Graphic Designer', 'design'],
  ['Jamie', 'Chitson', 'Mid-weight Graphic Designer', 'design'],
  ['Kiane', 'Gucher-Blackman', 'Developer', 'design'],
  ['Jess', 'Bennett', 'Graphic Designer', 'design'],
  ['Matt', 'Ogden', 'Graphic Designer', 'design'],
  ['Cameron', 'Brown', 'Senior Account Manager', 'social'],
  ['Phil', 'Webster', 'Account Manager', 'social'],
  ['Sienna', 'Parrish', 'Senior Account Executive', 'social'],
  ['Ross', 'Daggett', 'Account Executive', 'social'],
  ['Ellie', 'Lynch', 'Senior Videographer', 'video'],
  ['Hugh', 'Aitchison', 'Videographer', 'video'],
  ['Alice', 'Merriman', 'Editor', 'video'],
  ['Georgia', 'Lynch', 'Production Manager', 'video'],
]

async function run() {
  const payload = await getPayload({ config: await config })
  let added = 0
  let skipped = 0

  for (const [firstName, lastName, jobTitle, department] of team) {
    const existing = await payload.find({
      collection: 'people',
      where: { and: [{ firstName: { equals: firstName } }, { lastName: { equals: lastName } }] },
      limit: 1,
      depth: 0,
    })
    if (existing.totalDocs > 0) {
      skipped++
      continue
    }
    await payload.create({ collection: 'people', data: { firstName, lastName, jobTitle, department } })
    added++
  }

  console.log(`Employees: ${added} added, ${skipped} already there.`)
  process.exit(0)
}

await run()
