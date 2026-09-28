import { addDays, toIsoDate } from './dates'
import type { ParcelDraft } from './parcel'
import type { useParcels } from './useParcels'

// Narzędzia widoczne tylko przy `npm run dev` – nie trafiają do wersji na GitHub Pages

function inDays(days: number): string {
  return toIsoDate(addDays(new Date(), days))
}

function sampleParcels(): (ParcelDraft & { delivered?: boolean })[] {
  return [
    {
      contents: 'Buty do biegania',
      source: 'Zalando',
      trackingUrl: 'https://inpost.pl/sledzenie-przesylek?number=520000012345678901234567',
      expectedFrom: inDays(0),
      note: 'rozmiar 38',
      carrier: 'InPost',
      toLocker: true,
    },
    {
      contents: 'Krem do rąk i szampon',
      source: 'Rossmann',
      trackingUrl: 'https://tracktrace.dpd.com.pl/parcelDetails?p1=1000123456789U',
      expectedFrom: inDays(1),
      expectedTo: inDays(3),
      carrier: 'DPD',
    },
    {
      contents: 'Etui na telefon',
      source: 'AliExpress',
      expectedFrom: inDays(-10),
      expectedTo: inDays(-3),
    },
    {
      contents: 'Sukienka na wesele',
      source: 'Reserved',
      expectedFrom: inDays(10),
    },
    {
      contents: 'Książka „Chłopki”',
      source: 'Allegro',
    },
    {
      contents: 'Świeczka zapachowa',
      source: 'Etsy',
      expectedFrom: inDays(-2),
      delivered: true,
    },
  ]
}

type Props = ReturnType<typeof useParcels> & {
  onShowWelcome: () => void
  onShowInstallGuide: () => void
}

export function DevTools({ parcels, addParcel, setStatus, removeParcel, onShowWelcome, onShowInstallGuide }: Props) {
  function seed() {
    for (const { delivered, ...draft } of sampleParcels()) {
      const id = addParcel(draft)
      if (delivered) setStatus(id, 'delivered')
    }
  }

  function clear() {
    parcels.forEach((p) => removeParcel(p.id))
  }

  return (
    <div className="dev-tools">
      <span>DEV</span>
      <button type="button" onClick={seed}>
        Dodaj przykładowe paczki
      </button>
      <button type="button" onClick={clear}>
        Wyczyść
      </button>
      <button type="button" onClick={onShowWelcome}>
        Powitanie
      </button>
      <button type="button" onClick={onShowInstallGuide}>
        Instalacja
      </button>
    </div>
  )
}
