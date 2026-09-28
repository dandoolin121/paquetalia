import type { Parcel } from './parcel'

interface Props {
  parcel: Parcel
  dateLabel?: string
  overdue?: boolean
  onClick: () => void
}

export function ParcelCard({ parcel, dateLabel, overdue = false, onClick }: Props) {
  const meta = [parcel.source, parcel.carrier, parcel.destination]
    .filter(Boolean)
    .join(' · ')

  return (
    <button type="button" className="card" onClick={onClick}>
      <span className="card-row">
        <span className="card-title">{parcel.contents}</span>
        {dateLabel && <span className={overdue ? 'card-date overdue' : 'card-date'}>{dateLabel}</span>}
      </span>
      {meta && <span className="card-meta">{meta}</span>}
    </button>
  )
}
