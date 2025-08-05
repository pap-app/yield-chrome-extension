import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from '@/components/app'
import { BrowserRouter } from 'react-router-dom'
import 'unfonts.css'
import '@/styles/style.css'
import { Toaster } from './ui/toaster'
import { WalletProvider } from './providers/walletProvider'

const root = createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <StrictMode>
    <WalletProvider>
      <BrowserRouter>
        <App />
        <Toaster />
      </BrowserRouter>
    </WalletProvider>
  </StrictMode>,
)
