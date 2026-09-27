import { carrierFromUrl } from './carrier'
import type { Parcel } from './parcel'

interface Props {
  parcel: Parcel
  dateLabel?: string
  overdue?: boolean
}

export function ParcelCard({ parcel, dateLabel, overdue = false }: Props) {
  const meta = [parcel.source, carrierFromUrl(parcel.trackingUrl)].filter(Boolean).join(' · ')

  return (
    <div className="card">
      <div className="card-row">
        <span className="card-title">{parcel.contents}</span>
        {dateLabel && <span className={overdue ? 'card-date overdue' : 'card-date'}>{dateLabel}</span>}
      </div>
      {meta && <div className="card-meta">{meta}</div>}
    </div>
  )
}
