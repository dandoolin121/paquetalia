/** Otwarta z ikonki na ekranie początkowym, a nie w zwykłej karcie przeglądarki */
export function isStandalone(): boolean {
  const iosStandalone = (navigator as Navigator & { standalone?: boolean }).standalone === true
  return iosStandalone || window.matchMedia('(display-mode: standalone)').matches
}

export function isIos(): boolean {
  const ua = navigator.userAgent
  // iPadOS przedstawia się jak Mac, ale w przeciwieństwie do Maca ma ekran dotykowy
  return /iPhone|iPad|iPod/.test(ua) || (ua.includes('Macintosh') && navigator.maxTouchPoints > 1)
}

export type IosBrowser = 'safari' | 'chrome' | 'other' | 'in-app'

export function detectIosBrowser(): IosBrowser {
  const ua = navigator.userAgent
  // Podglądy linków w apkach (Messenger, Instagram, Facebook, TikTok, apka Google…) nie pozwalają dodać strony do ekranu początkowego
  if (/FBAN|FBAV|FBIOS|Instagram|LinkedInApp|Snapchat|BytedanceWebview|musical_ly|GSA\//.test(ua)) return 'in-app'
  if (/CriOS/.test(ua)) return 'chrome'
  if (/FxiOS|EdgiOS|OPiOS|OPT\/|YaBrowser|DuckDuckGo/.test(ua)) return 'other'
  return 'safari'
}
