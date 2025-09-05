import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { NotificationProvider } from './components/Notifications/NotificationsProvider.jsx'
import { getAccessToken } from './utils/auth.js'

const token = getAccessToken();
const NOTIF_URL = import.meta.env.VITE_NOTIFICATION_URL;
const path = "/ws"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {token ? (
      <NotificationProvider token={token} url={NOTIF_URL} path={path}>
        <App />
      </NotificationProvider>
    ) : (
      <App />
    )}
  </StrictMode>,
)
