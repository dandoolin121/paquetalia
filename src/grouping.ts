import { addDays, endOfWeek, toIsoDate } from './dates'
import type { Parcel } from './parcel'

export type GroupKey = 'overdue' | 'today' | 'tomorrow' | 'this_week' | 'later' | 'no_date'

export interface ParcelGroup {
  key: GroupKey
  title: string
  parcels: Parcel[]
}

const GROUPS: { key: GroupKey; title: string }[] = [
  { key: 'overdue', title: 'Spóźnione' },
  { key: 'today', title: 'Dziś' },
  { key: 'tomorrow', title: 'Jutro' },
  { key: 'this_week', title: 'W tym tygodniu' },
  { key: 'later', title: 'Później' },
  { key: 'no_date', title: 'Bez daty' },
]

function groupOf(parcel: Parcel, today: Date): GroupKey {
  const { expectedFrom, expectedTo } = parcel
  if (!expectedFrom) return 'no_date'
  const todayIso = toIsoDate(today)
  // Spóźniona dopiero wtedy, gdy minął ostatni możliwy dzień dostawy
  if ((expectedTo ?? expectedFrom) < todayIso) return 'overdue'
  if (expectedFrom <= todayIso) return 'today'
  if (expectedFrom === toIsoDate(addDays(today, 1))) return 'tomorrow'
  if (expectedFrom <= toIsoDate(endOfWeek(today))) return 'this_week'
  return 'later'
}

function byExpectedDate(a: Parcel, b: Parcel): number {
  return (a.expectedFrom ?? '').localeCompare(b.expectedFrom ?? '') || a.createdAt.localeCompare(b.createdAt)
}

/** Paczki w drodze pogrupowane wg przewidywanej dostawy; puste grupy pomijamy */
export function groupInTransit(parcels: Parcel[], today: Date): ParcelGroup[] {
  const inTransit = parcels.filter((p) => p.status === 'in_transit').sort(byExpectedDate)
  return GROUPS.map((group) => ({
    ...group,
    parcels: inTransit.filter((p) => groupOf(p, today) === group.key),
  })).filter((group) => group.parcels.length > 0)
}

/** Odebrane paczki, najświeższe na górze */
export function sortDelivered(parcels: Parcel[]): Parcel[] {
  return parcels
    .filter((p) => p.status === 'delivered')
    .sort((a, b) => (b.deliveredAt ?? '').localeCompare(a.deliveredAt ?? ''))
}
