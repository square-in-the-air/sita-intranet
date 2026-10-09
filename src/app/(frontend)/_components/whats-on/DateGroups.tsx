import type { DateGroup } from '../../_lib/whatsOn'

type Props = {
  groups: DateGroup[]
  formatLabel: (group: DateGroup) => string
  empty: string
  variant: 'yellow' | 'cream'
}

// Date label with a list of names under it (birthdays, work anniversaries)
export function DateGroups({ groups, formatLabel, empty, variant }: Props) {
  return (
    <div className={`date-groups date-groups--${variant}`}>
      {groups.length === 0 ? (
        <p className="date-groups__empty">{empty}</p>
      ) : (
        groups.map((group) => (
          <div className="date-groups__group" key={group.key}>
            <p className="date-groups__label">{formatLabel(group)}</p>
            <ul className="date-groups__names">
              {group.names.map((name, i) => (
                <li key={i}>{name}</li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  )
}
