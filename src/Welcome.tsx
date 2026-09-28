import { useState, type CSSProperties } from 'react'

interface Props {
  onDone: () => void
}

// Serduszka unoszące się w tle: pozycja w poziomie (%), rozmiar (px), opóźnienie i czas lotu (s)
const HEARTS = [
  [6, 18, 0, 9],
  [18, 26, 3.5, 11],
  [31, 14, 1.2, 8],
  [44, 22, 5, 12],
  [57, 16, 2.4, 9],
  [69, 28, 0.6, 13],
  [81, 18, 4.2, 10],
  [92, 22, 1.8, 11],
]

export function Welcome({ onDone }: Props) {
  const [leaving, setLeaving] = useState(false)

  return (
    <div
      className={leaving ? 'welcome leaving' : 'welcome'}
      onAnimationEnd={(e) => {
        if (leaving && e.target === e.currentTarget) onDone()
      }}
    >
      <div className="welcome-hearts" aria-hidden="true">
        {HEARTS.map(([x, size, delay, duration]) => (
          <span
            key={x}
            style={
              {
                '--x': `${x}%`,
                '--size': `${size}px`,
                '--delay': `${delay}s`,
                '--duration': `${duration}s`,
              } as CSSProperties
            }
          >
            ♥
          </span>
        ))}
      </div>

      <img className="welcome-icon" src={`${import.meta.env.BASE_URL}icon.svg`} alt="" />
      <h1 className="welcome-title">Hej Natalia! 💕</h1>
      <p className="welcome-text">
        To jest <strong>Paquetalia</strong> – od hiszpańskiego „paquete”, czyli paczka, i&nbsp;od&nbsp;Ciebie.
      </p>
      <p className="welcome-text">
        Zapisuj tu wszystkie paczki w&nbsp;drodze, a&nbsp;od razu zobaczysz, co przychodzi dziś, a&nbsp;co się spóźnia.
      </p>
      <button type="button" className="action-button primary welcome-button" onClick={() => setLeaving(true)}>
        Zaczynamy 📦
      </button>
    </div>
  )
}
