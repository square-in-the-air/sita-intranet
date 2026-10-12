'use client'

import { Link, useConfig } from '@payloadcms/ui'
import { usePathname } from 'next/navigation.js'
import React from 'react'

// "Dashboard" link above the first sidebar group
export function DashboardLink() {
  const pathname = usePathname()
  const { config } = useConfig()
  const href = config.routes.admin

  const label = <span className="nav__link-label">Dashboard</span>

  return (
    <div style={{ marginBottom: 'calc(var(--base) * 0.5)' }}>
      {pathname === href ? (
        <div className="nav__link" id="nav-dashboard">
          {label}
        </div>
      ) : (
        <Link className="nav__link" href={href} id="nav-dashboard" prefetch={false}>
          {label}
        </Link>
      )}
    </div>
  )
}
