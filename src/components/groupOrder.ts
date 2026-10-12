// Order of the groups in the admin sidebar and on the dashboard. Anything not listed goes last.
const GROUP_ORDER = ['Posts', 'Pages', 'Users', 'Options']

export const groupRank = (label: unknown) => {
  const i = GROUP_ORDER.indexOf(String(label))
  return i === -1 ? GROUP_ORDER.length : i
}
