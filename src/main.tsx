import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App'
import '@fontsource-variable/bricolage-grotesque/opsz.css'
import '@fontsource/ibm-plex-sans/latin-400.css'
import '@fontsource/ibm-plex-sans/latin-500.css'
import '@fontsource/ibm-plex-sans/latin-600.css'
import '@fontsource/ibm-plex-mono/latin-400.css'
import '@fontsource/ibm-plex-mono/latin-500.css'
import '@fontsource/ibm-plex-mono/latin-600.css'
import './styles/mockup.css'
import './styles/overrides.css'
import './styles/index.css'

const el = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)
// the built page is prerendered (so it is fully readable without JS); in dev the root is empty
if (el.hasChildNodes()) hydrateRoot(el, app)
else createRoot(el).render(app)
