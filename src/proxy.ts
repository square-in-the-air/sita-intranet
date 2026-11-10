import { NextResponse } from 'next/server'

import { auth, authBypassed } from '@/auth'
import { isOpenPath } from '@/lib/authRules'

// Sends anyone who isn't signed in with a SITA Microsoft account to /sign-in.
// This is the quick, cookie only check. Next.js recommends keeping it light and
// doing the real checks next to the data (see the Data Access Layer in the Next.js auth guide).
export default auth((request) => {
  const { pathname, search } = request.nextUrl

  if (authBypassed || isOpenPath(pathname) || request.auth) return undefined

  const signInUrl = new URL('/sign-in', request.nextUrl.origin)
  if (pathname !== '/') signInUrl.searchParams.set('callbackUrl', `${pathname}${search}`)
  return NextResponse.redirect(signInUrl)
})

export const config = {
  // Skip Next.js internals and anything with a file extension (fonts, images, icon.svg).
  // /sign-in, /api and /admin are let through in code by isOpenPath.
  matcher: ['/((?!_next/static|_next/image|.*\\..*).*)'],
}
