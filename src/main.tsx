import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/tokens.css'
import './styles/global.css'

// Initialize theme before paint to prevent flash
const saved = localStorage.getItem('lifex-theme')
const prefersDark = !window.matchMedia?.('(prefers-color-scheme: light)').matches
document.documentElement.setAttribute('data-theme', saved || (prefersDark ? 'dark' : 'light'))

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
