import React from 'react'
import type { ServerProps } from 'payload'

import { getAdminLogo } from './getAdminLogo'

// Site logo above the "Dashboard" link in the sidebar.
export async function SidebarLogo({ payload }: ServerProps) {
  const logo = await getAdminLogo(payload)

  return (
    <div className="admin-logo admin-logo--sidebar">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logo.url} alt={logo.alt} />
    </div>
  )
}
