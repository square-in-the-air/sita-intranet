import React from 'react'
import { DefaultNav } from '@payloadcms/next/rsc'

import { groupRank } from './groupOrder'

// Payload always lists its default "Collections" and "Globals" groups first, and
// collection groups before global groups. This wraps the standard sidebar and
// re-sorts the groups into the order set in groupOrder.ts.
type Group = { label: unknown; entities: unknown[] }

// Finds the element holding the nav groups and swaps in a sorted copy
const sortGroups = (node: React.ReactNode): React.ReactNode => {
  if (!React.isValidElement(node)) return node
  const props = node.props as { groups?: Group[]; children?: React.ReactNode }

  if (Array.isArray(props.groups)) {
    const groups = [...props.groups].sort((a, b) => groupRank(a.label) - groupRank(b.label))
    return React.cloneElement(node as React.ReactElement<{ groups: Group[] }>, { groups })
  }
  if (props.children === undefined) return node

  return React.cloneElement(
    node as React.ReactElement<{ children: React.ReactNode }>,
    undefined,
    ...React.Children.map(props.children, sortGroups)!,
  )
}

export async function OrderedNav(props: React.ComponentProps<typeof DefaultNav>) {
  return sortGroups(await DefaultNav(props))
}
