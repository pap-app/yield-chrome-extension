import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Loader2, CheckCircle, XCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '@/hooks/use-toast'
import {
  isConnected,
  getAddress,
  signAuthEntry,
  signTransaction,
  signBlob,
  addToken,
  isAllowed,
  setAllowed,
  requestAccess,
} from '@stellar/freighter-api'
import { connectStellarWallet } from '@/lib/wallet/connectors'
interface ConnectWalletProps {
  onComplete: () => void
  onBack?: () => void
}

interface WalletOption {
  id: string
  name: string
  icon: string
  description: string
  color: string
}

interface ConnectionModal {
  type: 'success' | 'failure'
  wallet: string
}

const walletOptions: WalletOption[] = [
  {
    id: 'freighter',
    name: 'Freighter',
    icon: '🦊',
    description: 'Most popular Ethereum wallet',
    color: 'from-orange-400 to-orange-600',
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    icon: '🔷',
    description: 'Easy-to-use wallet from Coinbase',
    color: 'from-blue-400 to-blue-600',
  },
  {
    id: 'trust',
    name: 'Trust Wallet',
    icon: '🛡️',
    description: 'Secure multi-coin wallet',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    icon: '🔗',
    description: 'Connect with 100+ wallets',
    color: 'from-purple-400 to-purple-600',
  },
]

export default function ConnectWallet({
  onComplete,
  onBack,
}: ConnectWalletProps) {
  const [connecting, setConnecting] = useState<string | null>(null)
  const [showModal, setShowModal] = useState<ConnectionModal | null>(null)
  const { toast } = useToast()

  const handleWalletConnect = async (wallet: WalletOption) => {
    setConnecting(wallet.id)

    // Simulate wallet connection process
    /* setTimeout(() => {
      setConnecting(null)

      // Simulate random success/failure (80% success rate)
      const success = Math.random() > 0.2

      if (success) {
        setShowModal({ type: 'success', wallet: wallet.name })
        setTimeout(() => {
          setShowModal(null)
          onComplete()
        }, 2000)
      } else {
        setShowModal({ type: 'failure', wallet: wallet.name })
        setTimeout(() => {
          setShowModal(null)
        }, 3000)
      }
    }, 2500)*/

    // Connecting Freight wallet
    if (wallet.id === 'freighter') {
      console.log('Freighter your looking good')
      const isIntalled = await isConnected()
      console.log(`connection status`, isIntalled)
      try {
        const isAppAllowed = await isAllowed()
        if (!isAppAllowed.isAllowed) {
          await setAllowed()
          const user = await requestAccess()

          if (user.error) {
            setShowModal({ type: 'failure', wallet: wallet.name })
            setTimeout(() => {
              setShowModal(null)
            }, 3000)
          } else {
            setShowModal({ type: 'success', wallet: wallet.name })
            setTimeout(() => {
              setShowModal(null)
              onComplete()
            }, 2000)
          }
          // save user to DB / SESSION
        }

        const addressObj = await getAddress()

        if (addressObj.error) {
          setShowModal({ type: 'failure', wallet: wallet.name })
          setTimeout(() => {
            setShowModal(null)
          }, 3000)
        } else {
          setShowModal({ type: 'success', wallet: wallet.name })
          setTimeout(() => {
            setShowModal(null)
            onComplete()
          }, 2000)
        }
      } catch (error) {
        setShowModal({ type: 'failure', wallet: wallet.name })
        setTimeout(() => {
          setShowModal(null)
        }, 3000)
      }
    }
  }

  const connectMetamask = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        })
        console.log('Connected account:', accounts[0])
        alert(`Connected: ${accounts[0]}`)
      } catch (error) {
        console.error('User rejected connection', error)
      }
    } else {
      alert('MetaMask is not installed.')
    }
  }

  async function handleConnect() {
    try {
      const { publicKey } = await connectStellarWallet()
      console.log('Connected address:', publicKey)
    } catch (err) {
      console.error('WalletConnect error', err)
    }
  }

  const handleCreateWallet = () => {
    toast({
      title: 'External Link',
      description: 'This would open a wallet creation guide in a new tab.',
    })
  }

  return (
    <div className="h-full space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center space-x-3">
        {onBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2 hover:bg-gray-100"
            disabled={!!connecting}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 rounded-full bg-primary"></div>
          <h1 className="text-lg font-medium text-muted-foreground">
            Select Wallet
          </h1>
        </div>
      </div>

      {/* Main Title */}
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold text-foreground">Connect wallet</h2>
      </div>

      {/* Wallet Options */}
      <div className="space-y-3">
        {walletOptions.map((wallet) => (
          <motion.div
            key={wallet.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className={`hover:border-primary/20 cursor-pointer border-2 transition-all duration-200 hover:shadow-md ${
                connecting === wallet.id
                  ? 'bg-primary/5 border-primary'
                  : 'border-gray-200'
              }`}
              onClick={handleConnect}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`h-12 w-12 rounded-xl bg-gradient-to-br ${wallet.color} flex items-center justify-center text-2xl`}
                    >
                      {wallet.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {wallet.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {wallet.description}
                      </p>
                    </div>
                  </div>
                  {connecting === wallet.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Create Wallet Link */}
      <div className="space-y-2 pt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Don't you have any wallet?
        </p>
        <Button
          variant="link"
          className="hover:text-primary/80 h-auto p-0 font-medium text-primary"
          onClick={handleCreateWallet}
          disabled={!!connecting}
        >
          Create a free wallet!
        </Button>
      </div>

      {/* Connection Modals */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={() => setShowModal(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="mx-4 w-full max-w-sm rounded-2xl bg-white p-6 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              {showModal.type === 'success' ? (
                <div className="space-y-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  >
                    <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">
                      Connected!
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      {showModal.wallet} has been connected successfully
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  >
                    <XCircle className="mx-auto h-16 w-16 text-red-500" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">
                      Connection Failed
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      Could not connect to {showModal.wallet}. Please try again.
                    </p>
                  </div>
                  <Button
                    onClick={() => setShowModal(null)}
                    className="hover:bg-primary/90 w-full bg-primary"
                  >
                    Try Again
                  </Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
