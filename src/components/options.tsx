import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Layout } from '@/components/layout'
import 'unfonts.css'
import '@/styles/style.css'
import { Button } from './ui/button'
import ConnectWallet from './connectWalletPage'
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
const root = createRoot(document.getElementById('root') as HTMLElement)

const connectWallet = async () => {
  console.log('Freighter your looking good')
  const isIntalled = await isConnected()
  console.log(`connection status`, isIntalled)
  try {
    const isAppAllowed = await isAllowed()
    if (!isAppAllowed.isAllowed) {
      await setAllowed()
      const user = await requestAccess()

      if (user.error) {
        console.log('Something went wrong')
      } else {
        console.log('something went wrong')
      }
      // save user to DB / SESSION
    }

    const addressObj = await getAddress()

    if (addressObj.error) {
      console.log('Something went wrong')
    } else {
      console.log('sonmething went wrong')
    }
  } catch (error) {
    console.log('something went wrong')
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
root.render(
  <StrictMode>
    <div className="h-screen w-screen bg-red-600">
      <p>Extension Options</p>
      <Button>Connect Wallet</Button>

      <button onClick={handleConnect} className="text-green-600">
        Connect the wallet
      </button>
    </div>
  </StrictMode>,
)
