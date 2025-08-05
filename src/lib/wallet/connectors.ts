// walletConnect.ts
import { SignClient } from '@walletconnect/sign-client'
import { WalletConnectModal } from '@walletconnect/modal'
const PROJECT_ID = '0cb1834cf7acc23871acf6ccdcbdc0b3' // from https://cloud.walletconnect.com
const STELLAR_METHOD = 'stellar_signXDR' // or 'stellar_signAndSubmitXDR'
const STELLAR_CHAIN = 'stellar:testnet' // or 'stellar:pubnet'

let signClient: SignClient
let modal: WalletConnectModal

export async function initWalletConnect() {
  if (signClient) return { signClient, modal }

  signClient = await SignClient.init({
    projectId: PROJECT_ID,
    metadata: {
      name: 'Your DApp Name',
      description: 'Your dapp description',
      url: 'https://your-dapp.xyz',
      icons: ['https://your-dapp.xyz/logo.png'],
    },
  })

  modal = new WalletConnectModal({ projectId: PROJECT_ID })
  return { signClient, modal }
}

export async function connectStellarWallet(): Promise<{
  session: any
  publicKey: string
}> {
  const { signClient, modal } = await initWalletConnect()

  const { uri, approval } = await signClient.connect({
    requiredNamespaces: {
      stellar: {
        methods: [STELLAR_METHOD],
        chains: [STELLAR_CHAIN],
        events: [],
      },
    },
  })

  if (uri) modal.openModal({ uri })

  const session = await approval()
  modal.closeModal()

  const publicKey = session.namespaces.stellar.accounts[0].split(':')[2]

  localStorage.setItem('steller_wallet_address', publicKey)
  localStorage.setItem('walletconnect_session', session.id)

  return { session, publicKey }
}

export function getWalletAddress(): string | null {
  return localStorage.getItem('steller_wallet_address')
}

export function logoutWallet() {
  localStorage.removeItem('steller_wallet_address')
  localStorage.removeItem('walletconnect_session')
  // Clear anything else like JWT, user profile, etc. if needed
}
