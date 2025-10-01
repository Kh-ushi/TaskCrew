import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { OrgRefreshProvider } from './context/OrgRefreshContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <OrgRefreshProvider>
      <App />
    </OrgRefreshProvider>
  </StrictMode>
)
