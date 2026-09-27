/** Data jako YYYY-MM-DD w lokalnej strefie (toISOString dałby UTC i koło północy przesunął dzień) */
export function toIsoDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export function parseIsoDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** Koniec tygodnia to niedziela (getDay() === 0) */
export function endOfWeek(date: Date): Date {
  return addDays(date, (7 - date.getDay()) % 7)
}

const weekdayFormat = new Intl.DateTimeFormat('pl-PL', { weekday: 'short' })

function dayMonth(date: Date): string {
  return `${date.getDate()}.${String(date.getMonth() + 1).padStart(2, '0')}`
}

/** „dziś”, „jutro”, „wczoraj” albo np. „pt. 3.10” */
export function formatDay(iso: string, today: Date): string {
  if (iso === toIsoDate(today)) return 'dziś'
  if (iso === toIsoDate(addDays(today, 1))) return 'jutro'
  if (iso === toIsoDate(addDays(today, -1))) return 'wczoraj'
  const date = parseIsoDate(iso)
  return `${weekdayFormat.format(date)} ${dayMonth(date)}`
}

/** Pojedynczy dzień jak w formatDay albo przedział „1–3.10” / „30.09–2.10” */
export function formatExpected(from: string | undefined, to: string | undefined, today: Date): string | undefined {
  if (!from) return undefined
  if (!to || to === from) return formatDay(from, today)
  const start = parseIsoDate(from)
  const end = parseIsoDate(to)
  const startLabel = start.getMonth() === end.getMonth() ? String(start.getDate()) : dayMonth(start)
  return `${startLabel}–${dayMonth(end)}`
}
