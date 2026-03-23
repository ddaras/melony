import React from 'react'
import ReactDOM from 'react-dom/client'
import { MelonyClient } from 'melony/client'
import { MelonyProvider } from '@melony/react'
import App from './App'
import './index.css'

const client = new MelonyClient({
  url: 'http://localhost:7777', // Default Melony Server URL
})

const getEventRole = (event: { type?: string }): 'user' | 'assistant' | 'error' => {
  if (event.type?.startsWith('user:')) {
    return 'user'
  }

  if (event.type?.startsWith('error:')) {
    return 'error'
  }

  return 'assistant'
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MelonyProvider client={client} aggregationOptions={{ getRole: getEventRole }}>
      <App />
    </MelonyProvider>
  </React.StrictMode>,
)
