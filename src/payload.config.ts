import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { News } from './collections/News'
import { People } from './collections/People'
import { Events } from './collections/Events'
import { Inspo } from './collections/Inspo'
import { Kudos } from './collections/Kudos'
import { Ticker } from './globals/Ticker'
import { Navigation } from './globals/Navigation'
import { HR } from './globals/HR'
import { Resources } from './globals/Resources'
import { Logo } from './globals/Logo'
import { QuickLinks } from './globals/QuickLinks'
import { Callouts } from './globals/Callouts'
import { SocialLinks } from './globals/SocialLinks'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    components: {
      Nav: '/components/OrderedNav#OrderedNav',
      beforeNavLinks: [
        '/components/SidebarLogo#SidebarLogo',
        '/components/DashboardLink#DashboardLink',
      ],
    },
    dashboard: {
      widgets: [
        {
          slug: 'ordered-collections',
          Component: '/components/OrderedCollectionCards#OrderedCollectionCards',
          minWidth: 'full',
        },
      ],
      defaultLayout: [{ widgetSlug: 'ordered-collections', width: 'full' }],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Events, News, Inspo, Kudos, Users, Media, People],
  globals: [HR, Resources, Logo, Navigation, QuickLinks, SocialLinks, Ticker, Callouts],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [
    s3Storage({
      collections: {
        media: true,
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        },
        region: process.env.AWS_REGION || 'eu-central-1',
        endpoint: process.env.AWS_ENDPOINT_URL_S3 || '',
        forcePathStyle: true,
      },
    }),
  ],
})
