import React from 'react'
import { createRoot } from 'react-dom/client'
import JPRBusApp from './jpr-bus-app.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <JPRBusApp />
  </React.StrictMode>
)
