import { formatDay, formatExpected, toIsoDate } from './dates'
import { groupInTransit, sortDelivered } from './grouping'
import type { Parcel } from './parcel'
import { ParcelCard } from './ParcelCard'

interface Props {
  parcels: Parcel[]
  today: Date
}

export function InTransitList({ parcels, today }: Props) {
  const groups = groupInTransit(parcels, today)
  if (groups.length === 0) return <p className="empty-state">Tu pojawią się Twoje paczki 📦</p>

  return groups.map((group) => {
    const overdue = group.key === 'overdue'
    return (
      <section key={group.key} className="group">
        <h2 className={overdue ? 'group-title overdue' : 'group-title'}>{group.title}</h2>
        {group.parcels.map((p) => (
          <ParcelCard
            key={p.id}
            parcel={p}
            dateLabel={formatExpected(p.expectedFrom, p.expectedTo, today)}
            overdue={overdue}
          />
        ))}
      </section>
    )
  })
}

export function DeliveredList({ parcels, today }: Props) {
  const delivered = sortDelivered(parcels)
  if (delivered.length === 0) return <p className="empty-state">Nie ma jeszcze odebranych paczek</p>

  return (
    <section className="group">
      {delivered.map((p) => (
        <ParcelCard
          key={p.id}
          parcel={p}
          dateLabel={p.deliveredAt && `odebrana ${formatDay(toIsoDate(new Date(p.deliveredAt)), today)}`}
        />
      ))}
    </section>
  )
}
