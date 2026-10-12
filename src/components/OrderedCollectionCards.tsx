import React from 'react'
import { Button, Card } from '@payloadcms/ui'
import { getTranslation } from '@payloadcms/translations'
import type { WidgetServerProps } from 'payload'

import { groupRank } from './groupOrder'

type Entity = { slug: string; type: 'collections' | 'globals'; label: string; group: string }

// Dashboard cards grouped and ordered like the sidebar. Payload's own collections
// widget always puts its default Collections and Globals groups first.
export async function OrderedCollectionCards({ req, permissions }: WidgetServerProps) {
  const { i18n, payload } = req
  const adminRoute = payload.config.routes.admin
  const defaultGroups = { collections: 'Collections', globals: 'Globals' }

  const entities: Entity[] = [
    ...payload.config.collections
      .filter((c) => permissions?.collections?.[c.slug]?.read && !c.admin?.hidden)
      .map((c) => ({
        slug: c.slug,
        type: 'collections' as const,
        label: getTranslation(c.labels.plural, i18n),
        group: c.admin?.group ? getTranslation(c.admin.group as string, i18n) : defaultGroups.collections,
      })),
    ...payload.config.globals
      .filter((g) => permissions?.globals?.[g.slug]?.read && !g.admin?.hidden)
      .map((g) => ({
        slug: g.slug,
        type: 'globals' as const,
        label: getTranslation(g.label as string, i18n),
        group: g.admin?.group ? getTranslation(g.admin.group as string, i18n) : defaultGroups.globals,
      })),
  ]

  const groups = new Map<string, Entity[]>()
  for (const entity of entities) groups.set(entity.group, [...(groups.get(entity.group) ?? []), entity])
  const ordered = [...groups.entries()].sort(([a], [b]) => groupRank(a) - groupRank(b))

  return (
    <div className="dashboard-groups">
      {ordered.map(([label, items]) => (
        <div className="dashboard-groups__group" key={label}>
          <h2 className="dashboard-groups__label">{label}</h2>
          <ul className="dashboard-groups__list">
            {items.map(({ slug, type, label: title }) => (
              <li key={`${type}-${slug}`}>
                <Card
                  id={`card-${slug}`}
                  title={title}
                  titleAs="h3"
                  href={`${adminRoute}/${type}/${slug}`}
                  actions={
                    type === 'collections' && permissions?.collections?.[slug]?.create ? (
                      <Button
                        aria-label={`Create new ${title}`}
                        buttonStyle="icon-label"
                        el="link"
                        icon="plus"
                        iconStyle="with-border"
                        round
                        to={`${adminRoute}/collections/${slug}/create`}
                      />
                    ) : undefined
                  }
                />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
