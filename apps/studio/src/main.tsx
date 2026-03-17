import React from 'react'
import ReactDOM from 'react-dom/client'
import { MelonyClient } from 'melony/client'
import { MelonyProvider } from '@melony/react'
import App from './App'
import './index.css'

const client = new MelonyClient({
  url: 'http://localhost:3000/chat', // Default URL
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MelonyProvider client={client}>
      <App />
    </MelonyProvider>
  </React.StrictMode>,
)
