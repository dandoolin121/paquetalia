import { useEffect, useState } from 'react'
import { newId, type Parcel, type ParcelDraft, type ParcelStatus } from './parcel'
import { loadParcels, saveParcels } from './storage'

export function useParcels() {
  const [parcels, setParcels] = useState<Parcel[]>(loadParcels)

  useEffect(() => {
    saveParcels(parcels)
  }, [parcels])

  function addParcel(draft: ParcelDraft): string {
    const parcel: Parcel = {
      ...draft,
      id: newId(),
      status: 'in_transit',
      createdAt: new Date().toISOString(),
    }
    setParcels((prev) => [...prev, parcel])
    return parcel.id
  }

  function updateParcel(id: string, draft: ParcelDraft) {
    setParcels((prev) => prev.map((p) => (p.id === id ? { ...p, ...draft } : p)))
  }

  function setStatus(id: string, status: ParcelStatus) {
    const deliveredAt = status === 'delivered' ? new Date().toISOString() : undefined
    setParcels((prev) => prev.map((p) => (p.id === id ? { ...p, status, deliveredAt } : p)))
  }

  function removeParcel(id: string) {
    setParcels((prev) => prev.filter((p) => p.id !== id))
  }

  return { parcels, addParcel, updateParcel, setStatus, removeParcel }
}
