import React, { createContext, useContext, useState, useEffect } from 'react'

// Define the shape of the context
interface WalletContextType {
  walletAddress: string | null
  setWalletAddress: (address: string | null) => void
}

// Create the context
const WalletContext = createContext<WalletContextType | undefined>(undefined)

// Export a hook to use the context easily
export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext)
  if (!context) throw new Error('useWallet must be used within WalletProvider')
  return context
}

// WalletProvider component
export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('steller_wallet_address')
    if (stored) setWalletAddress(stored)
  }, [])

  return (
    <WalletContext.Provider value={{ walletAddress, setWalletAddress }}>
      {children}
    </WalletContext.Provider>
  )
}
