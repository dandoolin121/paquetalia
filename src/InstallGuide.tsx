import type { ReactNode } from 'react'
import { detectIosBrowser, type IosBrowser } from './platform'

interface Props {
  /** Tylko w trybie deweloperskim – w prawdziwej apce z tego ekranu nie da się wyjść bez instalacji */
  onClose?: () => void
}

function ShareIcon() {
  return (
    <svg className="inline-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3v12M8 7l4-4 4 4" />
      <path d="M8 10H6.5A1.5 1.5 0 0 0 5 11.5v8A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5v-8a1.5 1.5 0 0 0-1.5-1.5H16" />
    </svg>
  )
}

function AddIcon() {
  return (
    <svg className="inline-icon" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <path d="M12 8.5v7M8.5 12h7" />
    </svg>
  )
}

function Step({ n, children }: { n: number; children: ReactNode }) {
  return (
    <li>
      <span className="step-number">{n}</span>
      <span>{children}</span>
    </li>
  )
}

// Pierwszy krok zależy od przeglądarki, dalej jest już systemowe menu iOS – wszędzie takie samo
function ShareStep({ browser }: { browser: IosBrowser }) {
  if (browser === 'chrome') {
    return (
      <>
        Stuknij <strong>Udostępnij</strong> <ShareIcon />
        <small>Przy pasku adresu u góry albo w menu ⋯</small>
      </>
    )
  }
  if (browser === 'other') {
    return (
      <>
        Otwórz menu przeglądarki i wybierz <strong>Udostępnij</strong> <ShareIcon />
        <small>Menu to zwykle ⋯ albo ☰</small>
      </>
    )
  }
  return (
    <>
      Stuknij <strong>Udostępnij</strong> <ShareIcon />
      <small>Na dole ekranu, w nowszym iOS może być schowane pod ⋯</small>
    </>
  )
}

// Apka z ikonki ma na iPhonie osobną pamięć od przeglądarki, więc w przeglądarce tylko prowadzimy do instalacji,
// a powitanie i paczki zaczynają się dopiero w zainstalowanej apce
export function InstallGuide({ onClose }: Props) {
  const browser = detectIosBrowser()

  return (
    <div className="welcome install-guide">
      <div className="install-content">
        <img className="welcome-icon" src={`${import.meta.env.BASE_URL}icon.svg`} alt="" />
        <h1 className="welcome-title">Masz tu niespodziankę&nbsp;🎁</h1>

        {browser === 'in-app' ? (
          <>
            <p className="welcome-text">
              Ten link otworzył się w podglądzie innej aplikacji. Żeby odpakować niespodziankę, otwórz go
              w&nbsp;przeglądarce:
            </p>
            <ol className="install-steps">
              <Step n={1}>
                Stuknij <strong>⋯</strong>
                <small>Zwykle w prawym górnym albo dolnym rogu</small>
              </Step>
              <Step n={2}>
                Wybierz <strong>Otwórz w przeglądarce</strong>
                <small>Albo „Otwórz w Safari”</small>
              </Step>
              <Step n={3}>Tam zobaczysz, co dalej 💕</Step>
            </ol>
          </>
        ) : (
          <>
            <p className="welcome-text">Żeby ją otworzyć, dodaj Paquetalię do ekranu początkowego:</p>
            <ol className="install-steps">
              <Step n={1}>
                <ShareStep browser={browser} />
              </Step>
              <Step n={2}>
                Wybierz <strong>Do ekranu początkowego</strong> <AddIcon />
                <small>Jeśli nie widać, przewiń listę w dół</small>
              </Step>
              <Step n={3}>
                Stuknij <strong>Dodaj</strong>
                <small>Jeśli jest przełącznik otwierania jako aplikacja, zostaw go włączony</small>
              </Step>
            </ol>
            <p className="welcome-text">A potem otwórz Paquetalię z nowej ikonki 💕</p>
            <p className="install-note">
              Nie widzisz „Do ekranu początkowego”? Otwórz ten link bezpośrednio w&nbsp;Safari.
            </p>
          </>
        )}

        {onClose && (
          <button type="button" className="link-button" onClick={onClose}>
            Zamknij (tylko DEV)
          </button>
        )}
      </div>
    </div>
  )
}
