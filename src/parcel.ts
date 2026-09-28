export type ParcelStatus = 'in_transit' | 'delivered'

export interface Parcel {
  id: string
  /** Co w środku – jedyne wymagane pole */
  contents: string
  /** Skąd idzie: sklep albo nadawca */
  source?: string
  trackingUrl?: string
  /** Przewidywana dostawa jako YYYY-MM-DD; expectedTo tylko gdy sklep podał przedział */
  expectedFrom?: string
  expectedTo?: string
  note?: string
  /** Dostawca wybrany ręcznie – starsze paczki go nie mają, wtedy rozpoznajemy go z linku */
  carrier?: string
  /** Odbiór w paczkomacie; brak pola = nie zaznaczono */
  toLocker?: boolean
  status: ParcelStatus
  createdAt: string
  deliveredAt?: string
}

/** Pola wypełniane w formularzu */
export type ParcelDraft = Pick<
  Parcel,
  'contents' | 'source' | 'trackingUrl' | 'expectedFrom' | 'expectedTo' | 'note' | 'carrier' | 'toLocker'
>

export function newId(): string {
  // crypto.randomUUID działa tylko na https i localhost, a przy testach na telefonie przez Wi-Fi jest zwykłe http
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}
