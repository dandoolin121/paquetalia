import { useState } from 'react'
import { DevTools } from './DevTools'
import type { ParcelDraft, ParcelStatus } from './parcel'
import { ParcelDetails } from './ParcelDetails'
import { ParcelForm } from './ParcelForm'
import { DeliveredList, InTransitList } from './ParcelLists'
import { useParcels } from './useParcels'

type Screen =
  | { name: 'list' }
  | { name: 'add' }
  | { name: 'details'; id: string }
  | { name: 'edit'; id: string }

function App() {
  const parcelsApi = useParcels()
  const { parcels, addParcel, updateParcel, setStatus, removeParcel } = parcelsApi
  const [tab, setTab] = useState<ParcelStatus>('in_transit')
  const [screen, setScreen] = useState<Screen>({ name: 'list' })
  const today = new Date()
  const inTransitCount = parcels.filter((p) => p.status === 'in_transit').length
  // Szczegóły zostają pod spodem także podczas edycji, żeby po zamknięciu formularza nie wjeżdżały od nowa
  const opened =
    screen.name === 'details' || screen.name === 'edit'
      ? parcels.find((p) => p.id === screen.id)
      : undefined

  function showList() {
    setScreen({ name: 'list' })
  }

  function openDetails(id: string) {
    setScreen({ name: 'details', id })
  }

  function handleAdd(draft: ParcelDraft) {
    addParcel(draft)
    setTab('in_transit')
    showList()
  }

  function handleEdit(id: string, draft: ParcelDraft) {
    updateParcel(id, draft)
    openDetails(id)
  }

  function handleSetStatus(id: string, status: ParcelStatus) {
    setStatus(id, status)
    showList()
  }

  function handleDelete(id: string) {
    removeParcel(id)
    showList()
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
        <InTransitList parcels={parcels} today={today} onOpen={openDetails} />
      ) : (
        <DeliveredList parcels={parcels} today={today} onOpen={openDetails} />
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

      {opened && (
        <ParcelDetails
          parcel={opened}
          today={today}
          onBack={showList}
          onEdit={() => setScreen({ name: 'edit', id: opened.id })}
          onSetStatus={(status) => handleSetStatus(opened.id, status)}
          onDelete={() => handleDelete(opened.id)}
        />
      )}

      {screen.name === 'add' && (
        <ParcelForm title="Nowa paczka" onSave={handleAdd} onCancel={showList} />
      )}

      {screen.name === 'edit' && opened && (
        <ParcelForm
          title="Edytuj paczkę"
          initial={opened}
          onSave={(draft) => handleEdit(opened.id, draft)}
          onCancel={() => openDetails(opened.id)}
        />
      )}
    </main>
  )
}

export default App
