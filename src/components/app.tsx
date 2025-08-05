import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import WelcomePage from './welcomePage'
import { Layout } from './layout'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import Dashboard from './homePage'
import Portfolio from './portfolioPage'
import Yields from './yieldsPage'
import Settings from './settingsPage'
import ConnectWallet from './connectWalletPage'
import OnboardingFlow from './onboardingFlow'
import { getWalletAddress } from '@/lib/wallet/connectors'
import VaultDetails from './vaultPage'
import Notifications from './notifications'
import { useWallet } from './providers/walletProvider'

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  // const walletAddress = getWalletAddress()
  const { walletAddress } = useWallet()

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        {!walletAddress ? (
          <>
            <Route path="/" element={<WelcomePage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          <>
            {/* Vault Page: Outside Layout */}
            <Route path="/vault/:vaultId" element={<VaultDetails />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="home" />} />
              <Route path="home" element={<Dashboard />} />
              <Route path="portfolio" element={<Portfolio />} />
              <Route path="yields" element={<Yields />} />
              <Route path="settings" element={<Settings />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="*" element={<Navigate to="/home" />} />
            </Route>
          </>
        )}
      </Routes>
    </QueryClientProvider>
  )
}
