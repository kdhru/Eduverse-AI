import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import { PointsProvider } from './lib/points'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <PointsProvider>
        <App />
      </PointsProvider>
    </BrowserRouter>
  </StrictMode>,
)
