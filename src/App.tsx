import { useState } from 'react'
import { DevTools } from './DevTools'
import type { ParcelStatus } from './parcel'
import { DeliveredList, InTransitList } from './ParcelLists'
import { useParcels } from './useParcels'

function App() {
  const parcelsApi = useParcels()
  const { parcels } = parcelsApi
  const [tab, setTab] = useState<ParcelStatus>('in_transit')
  const today = new Date()
  const inTransitCount = parcels.filter((p) => p.status === 'in_transit').length

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
    </main>
  )
}

export default App
