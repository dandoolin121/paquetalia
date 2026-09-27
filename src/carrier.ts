// Fragment domeny z linku do śledzenia → nazwa przewoźnika
const CARRIERS: [domainPart: string, name: string][] = [
  ['inpost', 'InPost'],
  ['dpd', 'DPD'],
  ['dhl', 'DHL'],
  ['gls', 'GLS'],
  ['ups', 'UPS'],
  ['fedex', 'FedEx'],
  ['poczta-polska', 'Poczta Polska'],
  ['orlen', 'Orlen Paczka'],
]

export function carrierFromUrl(url: string | undefined): string | undefined {
  if (!url) return undefined
  try {
    const host = new URL(url).hostname
    return CARRIERS.find(([domainPart]) => host.includes(domainPart))?.[1]
  } catch {
    return undefined
  }
}
