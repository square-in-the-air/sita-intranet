import { describe, expect, it } from 'vitest'

import {
  isOpenPath,
  isStaffAccount,
  parseAllowedDomains,
  parseTenantId,
  safeRedirectPath,
} from '@/lib/authRules'

const TENANT = '11111111-2222-3333-4444-555555555555'
const rules = { tenantId: TENANT, allowedDomains: ['squareintheair.com'] }
const iss = `https://login.microsoftonline.com/${TENANT}/v2.0`

describe('parseTenantId', () => {
  it('reads the tenant GUID from the issuer', () => {
    expect(parseTenantId(iss)).toBe(TENANT)
    expect(parseTenantId(`${iss}/`)).toBe(TENANT)
  })

  it('refuses anything that is not a real tenant', () => {
    expect(parseTenantId(undefined)).toBeUndefined()
    expect(parseTenantId('https://login.microsoftonline.com/common/v2.0')).toBeUndefined()
    expect(parseTenantId('https://login.microsoftonline.com/organizations/v2.0')).toBeUndefined()
    expect(parseTenantId('https://example.com/11111111-2222-3333-4444-555555555555/v2.0')).toBeUndefined()
  })
})

describe('parseAllowedDomains', () => {
  it('defaults to the company domain', () => {
    expect(parseAllowedDomains(undefined)).toEqual(['squareintheair.com'])
    expect(parseAllowedDomains('  ,  ')).toEqual(['squareintheair.com'])
  })

  it('splits, trims and lowercases', () => {
    expect(parseAllowedDomains('SquareInTheAir.com, Example.com')).toEqual([
      'squareintheair.com',
      'example.com',
    ])
  })
})

describe('isStaffAccount', () => {
  const staff = { tid: TENANT, iss, email: 'design@squareintheair.com' }

  it('lets a staff account in', () => {
    expect(isStaffAccount(staff, rules)).toBe(true)
    expect(isStaffAccount({ ...staff, email: 'Design@SquareInTheAir.com' }, rules)).toBe(true)
  })

  it('falls back to the sign in name when there is no email claim', () => {
    expect(
      isStaffAccount({ tid: TENANT, iss, preferred_username: 'design@squareintheair.com' }, rules),
    ).toBe(true)
  })

  it('refuses another tenant', () => {
    expect(isStaffAccount({ ...staff, tid: '99999999-2222-3333-4444-555555555555' }, rules)).toBe(false)
  })

  it('refuses a guest from another organisation', () => {
    expect(isStaffAccount({ ...staff, idp: 'https://sts.windows.net/other/' }, rules)).toBe(false)
  })

  it('refuses the wrong domain, look alike domains and missing addresses', () => {
    expect(isStaffAccount({ ...staff, email: 'someone@gmail.com' }, rules)).toBe(false)
    expect(isStaffAccount({ ...staff, email: 'a@squareintheair.com.evil.com' }, rules)).toBe(false)
    expect(isStaffAccount({ ...staff, email: 'a@evil.com@squareintheair.com' }, rules)).toBe(false)
    expect(isStaffAccount({ tid: TENANT, iss }, rules)).toBe(false)
  })

  it('refuses everyone when the tenant is not configured', () => {
    expect(isStaffAccount(staff, { ...rules, tenantId: undefined })).toBe(false)
    expect(isStaffAccount(undefined, rules)).toBe(false)
  })
})

describe('safeRedirectPath', () => {
  it('keeps paths on this site', () => {
    expect(safeRedirectPath('/news/my-post?x=1')).toBe('/news/my-post?x=1')
  })

  it('falls back to the home page for anything else', () => {
    expect(safeRedirectPath(undefined)).toBe('/')
    expect(safeRedirectPath('https://evil.com')).toBe('/')
    expect(safeRedirectPath('//evil.com')).toBe('/')
    expect(safeRedirectPath('/\\evil.com')).toBe('/')
    expect(safeRedirectPath('/sign-in')).toBe('/')
    expect(safeRedirectPath('/sign-in?error=AccessDenied')).toBe('/')
  })
})

describe('isOpenPath', () => {
  it('leaves the sign in page, Payload admin and the API alone', () => {
    expect(isOpenPath('/sign-in')).toBe(true)
    expect(isOpenPath('/admin/collections/news')).toBe(true)
    expect(isOpenPath('/api/auth/callback/microsoft-entra-id')).toBe(true)
  })

  it('gates every page of the site', () => {
    expect(isOpenPath('/')).toBe(false)
    expect(isOpenPath('/news/a-post')).toBe(false)
    expect(isOpenPath('/administration')).toBe(false)
    expect(isOpenPath('/sign-in-help')).toBe(false)
  })
})
