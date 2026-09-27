import { DevTools } from './DevTools'
import { useParcels } from './useParcels'

function App() {
  const parcelsApi = useParcels()
  const { parcels } = parcelsApi

  return (
    <main className="app">
      <header className="app-header">
        <h1>Paquetalia</h1>
      </header>

      {parcels.length === 0 ? (
        <p className="empty">Tu pojawią się Twoje paczki 📦</p>
      ) : (
        // Tymczasowy podgląd danych – w kroku 3 zastąpią go karty pogrupowane po dacie
        <ul>
          {parcels.map((p) => (
            <li key={p.id}>
              {p.contents}
              {p.source && ` · ${p.source}`}
              {p.expectedFrom && ` · ${p.expectedFrom}`}
              {p.expectedTo && ` – ${p.expectedTo}`}
              {p.status === 'delivered' && ' · odebrana'}
            </li>
          ))}
        </ul>
      )}

      {import.meta.env.DEV && <DevTools {...parcelsApi} />}
    </main>
  )
}

export default App
