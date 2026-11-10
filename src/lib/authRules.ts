// Pure rules for the Microsoft sign in. No imports, so they can be tested on their own.

const GUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** The claims we read from the Microsoft ID token. */
export type EntraClaims = {
  tid?: string
  iss?: string
  idp?: string
  oid?: string
  email?: string
  preferred_username?: string
}

/**
 * Pulls the tenant GUID out of the issuer URL
 * (https://login.microsoftonline.com/<tenant-id>/v2.0).
 * Anything that isn't a real tenant GUID, such as "common" or "organizations",
 * returns undefined so the site fails closed rather than accepting any Microsoft account.
 */
export function parseTenantId(issuer: string | undefined): string | undefined {
  const match = issuer?.trim().match(/^https:\/\/login\.microsoftonline\.com\/([^/]+)\/v2\.0\/?$/i)
  const tenant = match?.[1]?.toLowerCase()
  return tenant && GUID.test(tenant) ? tenant : undefined
}

/** "squareintheair.com, example.com" becomes ['squareintheair.com', 'example.com']. */
export function parseAllowedDomains(value: string | undefined): string[] {
  const domains = (value ?? 'squareintheair.com')
    .split(',')
    .map((domain) => domain.trim().toLowerCase())
    .filter(Boolean)
  return domains.length ? domains : ['squareintheair.com']
}

/**
 * Decides whether a Microsoft account may use the intranet. All three must hold:
 * 1. the token was issued by our own tenant,
 * 2. it is a member account, not a guest invited from another organisation,
 * 3. the address is on an allowed company domain.
 */
export function isStaffAccount(
  claims: EntraClaims | undefined,
  rules: { tenantId: string | undefined; allowedDomains: string[] },
): boolean {
  if (!claims || !rules.tenantId) return false
  if (claims.tid?.toLowerCase() !== rules.tenantId) return false

  // Guests carry an idp claim that differs from the issuer. Staff accounts don't.
  if (claims.idp && claims.idp !== claims.iss) return false

  // Microsoft only sends `email` for some accounts, so fall back to the sign in name.
  const address = (claims.email || claims.preferred_username || '').toLowerCase()
  if (address.split('@').length !== 2) return false

  const domain = address.slice(address.lastIndexOf('@') + 1)
  return rules.allowedDomains.includes(domain)
}

/** Only send people back to a page on this site, never to another address. */
export function safeRedirectPath(value: string | undefined): string {
  if (!value) return '/'
  if (!value.startsWith('/') || value.startsWith('//')) return '/'
  if (value.includes('\\') || /[\u0000-\u001f]/.test(value)) return '/'
  if (value === '/sign-in' || /^\/sign-in[/?#]/.test(value)) return '/'
  return value
}

// Payload has its own login for /admin and its own access rules for /api,
// and the sign in page itself has to be reachable when signed out.
const OPEN_PREFIXES = ['/sign-in', '/api', '/admin']

export function isOpenPath(pathname: string): boolean {
  return OPEN_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
}
