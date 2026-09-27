import { carrierFromUrl } from './carrier'
import { formatDay, formatExpected, toIsoDate } from './dates'
import { isOverdue } from './grouping'
import type { Parcel, ParcelStatus } from './parcel'

interface Props {
  parcel: Parcel
  today: Date
  onBack: () => void
  onEdit: () => void
  onSetStatus: (status: ParcelStatus) => void
  onDelete: () => void
}

export function ParcelDetails({ parcel, today, onBack, onEdit, onSetStatus, onDelete }: Props) {
  const expected = formatExpected(parcel.expectedFrom, parcel.expectedTo, today)
  const carrier = carrierFromUrl(parcel.trackingUrl)
  // Link bez http(s) przeglądarka potraktowałaby jako adres wewnątrz apki
  const trackingHref = parcel.trackingUrl?.match(/^https?:\/\//) ? parcel.trackingUrl : undefined
  const delivered = parcel.status === 'delivered'
  const deliveredLabel = parcel.deliveredAt ? formatDay(toIsoDate(new Date(parcel.deliveredAt)), today) : ''

  function handleDelete() {
    if (window.confirm(`Usunąć paczkę?\n\n${parcel.contents}`)) onDelete()
  }

  return (
    <div className="sheet push">
      <nav className="nav-bar">
        <button type="button" className="nav-button back" onClick={onBack}>
          <svg viewBox="0 0 12 20" width="12" height="20" aria-hidden="true">
            <path d="M10 2 2 10l8 8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Wróć
        </button>
        <span />
        <button type="button" className="nav-button" onClick={onEdit}>
          Edytuj
        </button>
      </nav>

      <div className="details">
        <div>
          <h2 className="details-title">{parcel.contents}</h2>
          {parcel.source && <p className="details-subtitle">z {parcel.source}</p>}
        </div>

        <dl className="info-group">
          <div className="info-row">
            <dt>Status</dt>
            <dd>{delivered ? `Odebrana ${deliveredLabel}` : 'W drodze'}</dd>
          </div>
          {expected && (
            <div className="info-row">
              <dt>Kiedy</dt>
              <dd className={isOverdue(parcel, today) ? 'overdue' : undefined}>{expected}</dd>
            </div>
          )}
          {carrier && (
            <div className="info-row">
              <dt>Przewoźnik</dt>
              <dd>{carrier}</dd>
            </div>
          )}
        </dl>

        {parcel.note && (
          <div className="info-group note">
            <span className="field-label">Notatka</span>
            <p>{parcel.note}</p>
          </div>
        )}

        <div className="actions">
          {trackingHref && (
            <a className="action-button primary" href={trackingHref} target="_blank" rel="noreferrer">
              Otwórz śledzenie
            </a>
          )}
          {delivered ? (
            <button type="button" className="action-button" onClick={() => onSetStatus('in_transit')}>
              Przywróć do „W drodze”
            </button>
          ) : (
            <button type="button" className="action-button" onClick={() => onSetStatus('delivered')}>
              Oznacz jako odebraną
            </button>
          )}
          <button type="button" className="action-button danger" onClick={handleDelete}>
            Usuń paczkę
          </button>
        </div>
      </div>
    </div>
  )
}
