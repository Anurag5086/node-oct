import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { CartToast } from './components/CartToast'
import { ShoppingAssistant } from './components/ShoppingAssistant'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <App />
        <CartToast />
        <ShoppingAssistant />
      </CartProvider>
    </BrowserRouter>
  </StrictMode>,
)
