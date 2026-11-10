import NextAuth from 'next-auth'
import MicrosoftEntraID from 'next-auth/providers/microsoft-entra-id'

import {
  isStaffAccount,
  parseAllowedDomains,
  parseTenantId,
  type EntraClaims,
} from '@/lib/authRules'

// Microsoft sign in for the whole front end. SITA staff only.
//
// Env vars (see .env.example):
//   AUTH_SECRET                      signs the session cookie
//   AUTH_MICROSOFT_ENTRA_ID_ID       app (client) ID from the Entra app registration
//   AUTH_MICROSOFT_ENTRA_ID_SECRET   client secret value
//   AUTH_MICROSOFT_ENTRA_ID_ISSUER   https://login.microsoftonline.com/<tenant-id>/v2.0
//   AUTH_ALLOWED_EMAIL_DOMAINS       optional, defaults to squareintheair.com
//   AUTH_BYPASS                      "true" skips sign in, and only when running `next dev`

const tenantId = parseTenantId(process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER)
const allowedDomains = parseAllowedDomains(process.env.AUTH_ALLOWED_EMAIL_DOMAINS)

// Honoured only by `next dev`. Vercel and `next start` run with NODE_ENV=production,
// so a stray AUTH_BYPASS value can never leave the live site open.
export const authBypassed =
  process.env.NODE_ENV === 'development' && process.env.AUTH_BYPASS === 'true'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    MicrosoftEntraID({
      // Rebuilt from the tenant GUID so a trailing slash in the env var can't break discovery.
      // If it isn't a real tenant ID we leave the env value alone and signIn() below refuses everyone.
      issuer: tenantId ? `https://login.microsoftonline.com/${tenantId}/v2.0` : undefined,
    }),
  ],
  // Only used when bypassing sign in locally, so `next dev` works before a real secret is set.
  secret: process.env.AUTH_SECRET ?? (authBypassed ? 'local-dev-only-not-a-secret' : undefined),
  session: { strategy: 'jwt', maxAge: 60 * 60 * 24 * 30 },
  pages: { signIn: '/sign-in', error: '/sign-in' },
  callbacks: {
    signIn({ profile }) {
      return isStaffAccount(profile as EntraClaims | undefined, { tenantId, allowedDomains })
    },
    jwt({ token, profile }) {
      if (profile) {
        const claims = profile as EntraClaims
        // Kept for phase 2: matching a login to a Payload user and a People record.
        token.oid = claims.oid
        token.tid = claims.tid
      }
      // Microsoft sends the profile photo as base64. Keep it out of the cookie.
      delete token.picture
      return token
    },
  },
})
