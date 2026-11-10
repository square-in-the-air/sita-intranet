import { redirect } from 'next/navigation'

import { getLogo } from '@/app/(frontend)/_lib/getLogo'
import { auth, authBypassed, signIn } from '@/auth'
import { safeRedirectPath } from '@/lib/authRules'

type SearchParams = Promise<{ callbackUrl?: string; error?: string }>

const messages: Record<string, string> = {
  AccessDenied:
    'That Microsoft account can’t use the intranet. Sign in with your SITA work account.',
  Configuration: 'Sign in isn’t set up properly yet. Let the web team know.',
}

export default async function SignInPage({ searchParams }: { searchParams: SearchParams }) {
  const { callbackUrl, error } = await searchParams
  const redirectTo = safeRedirectPath(callbackUrl)

  // Already signed in (or running locally with the bypass on): nothing to do here.
  if (authBypassed || (await auth())) redirect(redirectTo)

  const logo = await getLogo()

  async function signInWithMicrosoft() {
    'use server'
    await signIn('microsoft-entra-id', { redirectTo })
  }

  return (
    <main className="sign-in">
      <div className="sign-in__card">
        {logo?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="sign-in__logo" src={logo.url} alt={logo.alt || 'SITA'} />
        ) : (
          <span className="sign-in__logo-text">SITA</span>
        )}

        <h1 className="sign-in__title">Welcome to the SITA intranet</h1>
        <p className="sign-in__text">Sign in with your SITA Microsoft account to carry on.</p>

        {error ? (
          <p className="sign-in__error" role="alert">
            {messages[error] ?? 'Something went wrong signing in. Please try again.'}
          </p>
        ) : null}

        <form action={signInWithMicrosoft}>
          <button type="submit" className="sign-in__button">
            Sign in with Microsoft
          </button>
        </form>
      </div>
    </main>
  )
}
