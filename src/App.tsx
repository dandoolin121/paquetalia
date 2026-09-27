import { useState } from 'react'
import { DevTools } from './DevTools'
import type { ParcelDraft, ParcelStatus } from './parcel'
import { ParcelForm } from './ParcelForm'
import { DeliveredList, InTransitList } from './ParcelLists'
import { useParcels } from './useParcels'

type Screen = { name: 'list' } | { name: 'add' }

function App() {
  const parcelsApi = useParcels()
  const { parcels, addParcel } = parcelsApi
  const [tab, setTab] = useState<ParcelStatus>('in_transit')
  const [screen, setScreen] = useState<Screen>({ name: 'list' })
  const today = new Date()
  const inTransitCount = parcels.filter((p) => p.status === 'in_transit').length

  function handleAdd(draft: ParcelDraft) {
    addParcel(draft)
    setTab('in_transit')
    setScreen({ name: 'list' })
  }

  return (
    <main className="app">
      <header className="app-header">
        <h1>Paquetalia</h1>
        <div className="segmented" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'in_transit'}
            onClick={() => setTab('in_transit')}
          >
            W drodze{inTransitCount > 0 && ` (${inTransitCount})`}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'delivered'}
            onClick={() => setTab('delivered')}
          >
            Odebrane
          </button>
        </div>
      </header>

      {tab === 'in_transit' ? (
        <InTransitList parcels={parcels} today={today} />
      ) : (
        <DeliveredList parcels={parcels} today={today} />
      )}

      {import.meta.env.DEV && <DevTools {...parcelsApi} />}

      <button
        type="button"
        className="fab"
        aria-label="Dodaj paczkę"
        onClick={() => setScreen({ name: 'add' })}
      >
        <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </button>

      {screen.name === 'add' && (
        <ParcelForm title="Nowa paczka" onSave={handleAdd} onCancel={() => setScreen({ name: 'list' })} />
      )}
    </main>
  )
}

export default App
