import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // host: true wystawia serwer deweloperski w sieci lokalnej, żeby dało się go otworzyć na telefonie przez Wi-Fi
  server: { host: true },
})
