import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Project site on GitHub Pages: https://ebrahimtahirr.github.io/ap-agent-site/
export default defineConfig({
  base: '/ap-agent-site/',
  plugins: [react()],
})
