import type { Parcel } from './parcel'

const STORAGE_KEY = 'paquetalia'
const BROKEN_DATA_KEY = 'paquetalia.broken'

// Wersja formatu zapisanych danych. Przy zmianie struktury Parcel podbijamy ją i dopisujemy migrację w loadParcels.
const DATA_VERSION = 1

interface StoredData {
  version: number
  parcels: Parcel[]
}

export function loadParcels(): Parcel[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw === null) return []
  try {
    const data = JSON.parse(raw) as StoredData
    return data.parcels
  } catch (error) {
    // Danych, których nie umiemy odczytać, nie nadpisujemy w ciemno – odkładamy je na bok, żeby dało się je uratować
    console.error('Nie udało się odczytać paczek', error)
    localStorage.setItem(BROKEN_DATA_KEY, raw)
    return []
  }
}

export function saveParcels(parcels: Parcel[]): void {
  const data: StoredData = { version: DATA_VERSION, parcels }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

const WELCOMED_KEY = 'paquetalia.welcomed'

export function loadWelcomed(): boolean {
  return localStorage.getItem(WELCOMED_KEY) !== null
}

export function saveWelcomed(): void {
  localStorage.setItem(WELCOMED_KEY, new Date().toISOString())
}
