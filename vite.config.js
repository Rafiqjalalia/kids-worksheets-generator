import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use relative asset paths so the built site works from any sub-path
  // (e.g. GitHub Pages at /kids-worksheets-generator/). The app uses hash
  // routing, so a relative base is safe here.
  base: './',
})
