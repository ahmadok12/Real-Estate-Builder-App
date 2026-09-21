import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: './', // Ensures assets load correctly on GitHub Pages, Vercel, or local preview
  plugins: [react()],
})
