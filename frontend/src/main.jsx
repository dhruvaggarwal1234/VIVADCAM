import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Router from './Router.jsx'
import { BrowserRouter } from 'react-router-dom'
import { MediaProvider } from './context/MediaContext.jsx'


createRoot(document.getElementById('root')).render(
 
  <BrowserRouter>
  <MediaProvider>

    <Router />
  </MediaProvider>
  </BrowserRouter>
 
)
