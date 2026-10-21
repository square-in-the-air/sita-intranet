import { ViewTransition } from 'react'

// Re-created on every navigation (unlike the layout), so the page body fades out
// and the new one fades in while the header and footer stay put. See the
// .page-fade rules in styles/base/_base.scss.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page-fade-in" exit="page-fade-out" default="none">
      {children}
    </ViewTransition>
  )
}
