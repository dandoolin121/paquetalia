import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command, isPreview }) => ({
  plugins: [react()],
  // Na GitHub Pages apka leży pod /paquetalia/ (vite preview udaje GitHub Pages), a npm run dev zostaje pod /
  base: command === 'build' || isPreview ? '/paquetalia/' : '/',
  // host: true wystawia serwer deweloperski w sieci lokalnej, żeby dało się go otworzyć na telefonie przez Wi-Fi
  server: { host: true },
}))
