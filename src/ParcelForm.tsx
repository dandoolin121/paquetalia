import { useState, type FormEvent } from 'react'
import { CARRIER_NAMES } from './carrier'
import type { ParcelDraft } from './parcel'

interface Props {
  title: string
  initial?: ParcelDraft
  onSave: (draft: ParcelDraft) => void
  onCancel: () => void
}

type Fields = Record<keyof ParcelDraft, string>

function toFields(draft?: ParcelDraft): Fields {
  return {
    contents: draft?.contents ?? '',
    source: draft?.source ?? '',
    trackingUrl: draft?.trackingUrl ?? '',
    expectedFrom: draft?.expectedFrom ?? '',
    expectedTo: draft?.expectedTo ?? '',
    note: draft?.note ?? '',
    carrier: draft?.carrier ?? '',
    destination: draft?.destination ?? '',
  }
}

// Link wklejony z SMS-a albo maila często siedzi w środku zdania – wyciągamy sam adres
function extractUrl(text: string): string | undefined {
  const trimmed = text.trim()
  return trimmed.match(/https?:\/\/\S+/)?.[0] ?? (trimmed || undefined)
}

function toDraft(fields: Fields): ParcelDraft {
  const optional = (value: string) => value.trim() || undefined
  const expectedFrom = optional(fields.expectedFrom)
  const expectedTo = optional(fields.expectedTo)
  return {
    contents: fields.contents.trim(),
    source: optional(fields.source),
    trackingUrl: extractUrl(fields.trackingUrl),
    expectedFrom,
    // „do” ma sens tylko jako koniec przedziału
    expectedTo: expectedFrom && expectedTo !== expectedFrom ? expectedTo : undefined,
    note: optional(fields.note),
    carrier: optional(fields.carrier),
    destination: optional(fields.destination),
  }
}

interface DateInputProps {
  label: string
  placeholder: string
  value: string
  min?: string
  disabled?: boolean
  onChange: (value: string) => void
}

// Puste pole daty na iPhonie jest po prostu puste, a Safari na Macu pokazuje w nim dzisiejszą datę –
// w obu przypadkach chowamy tekst pola i pokazujemy własny napis
function DateInput({ label, placeholder, value, min, disabled, onChange }: DateInputProps) {
  return (
    <span className="date-pill">
      <input
        type="date"
        aria-label={label}
        className={value ? undefined : 'empty'}
        value={value}
        min={min}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      />
      {!value && <span className="date-placeholder">{placeholder}</span>}
    </span>
  )
}

export function ParcelForm({ title, initial, onSave, onCancel }: Props) {
  const [fields, setFields] = useState(() => toFields(initial))

  function update(name: keyof Fields, value: string) {
    setFields((prev) => ({ ...prev, [name]: value }))
  }

  const rangeInvalid =
    fields.expectedFrom !== '' && fields.expectedTo !== '' && fields.expectedTo < fields.expectedFrom
  const canSave = fields.contents.trim() !== '' && !rangeInvalid

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (canSave) onSave(toDraft(fields))
  }

  return (
    <div className="sheet">
      <nav className="nav-bar">
        <button type="button" className="nav-button" onClick={onCancel}>
          Anuluj
        </button>
        <span className="nav-title">{title}</span>
        <button type="submit" form="parcel-form" className="nav-button strong" disabled={!canSave}>
          Zapisz
        </button>
      </nav>

      <form id="parcel-form" className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="field">
            <span className="field-label">Co w środku</span>
            <input
              value={fields.contents}
              onChange={(e) => update('contents', e.target.value)}
              placeholder="np. Buty do biegania"
            />
          </label>
          <label className="field">
            <span className="field-label">Skąd</span>
            <input
              value={fields.source}
              onChange={(e) => update('source', e.target.value)}
              placeholder="np. Zalando"
            />
          </label>
        </div>

        <div className="form-group">
          <label className="field">
            <span className="field-label">Link do śledzenia</span>
            <input
              value={fields.trackingUrl}
              onChange={(e) => update('trackingUrl', e.target.value)}
              onBlur={(e) => update('trackingUrl', extractUrl(e.target.value) ?? '')}
              placeholder="https://…"
              inputMode="url"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
            />
          </label>
          <label className="field">
            <span className="field-label">Dostawca</span>
            <select value={fields.carrier} onChange={(e) => update('carrier', e.target.value)}>
              <option value="">Nie wybrano</option>
              {CARRIER_NAMES.map((name) => (
                <option key={name}>{name}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span className="field-label">Dokąd</span>
            <input
              value={fields.destination}
              onChange={(e) => update('destination', e.target.value)}
              placeholder="np. Żabka, paczkomat, dom"
            />
          </label>
        </div>

        <div className="form-group">
          <div className="field">
            <div className="field-label-row">
              <span className="field-label">Kiedy może być</span>
              {(fields.expectedFrom || fields.expectedTo) && (
                <button
                  type="button"
                  className="link-button"
                  onClick={() => setFields((prev) => ({ ...prev, expectedFrom: '', expectedTo: '' }))}
                >
                  Wyczyść
                </button>
              )}
            </div>
            <div className="date-range">
              <DateInput
                label="Od"
                placeholder="wybierz"
                value={fields.expectedFrom}
                onChange={(value) => update('expectedFrom', value)}
              />
              <span>do</span>
              <DateInput
                label="Do (opcjonalnie)"
                placeholder="opcjonalnie"
                value={fields.expectedTo}
                min={fields.expectedFrom}
                disabled={!fields.expectedFrom}
                onChange={(value) => update('expectedTo', value)}
              />
            </div>
            {rangeInvalid && <span className="field-error">Data „do” jest wcześniejsza niż „od”</span>}
          </div>
        </div>

        <div className="form-group">
          <label className="field">
            <span className="field-label">Notatka</span>
            <textarea
              rows={3}
              value={fields.note}
              onChange={(e) => update('note', e.target.value)}
              placeholder="np. rozmiar 38"
            />
          </label>
        </div>
      </form>
    </div>
  )
}
