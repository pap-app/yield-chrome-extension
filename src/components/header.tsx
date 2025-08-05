import { Bell } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { User } from '@/shared/schema'
import { useNavigate } from 'react-router-dom'
import { use } from 'react'
import { getWalletAddress } from '@/lib/wallet/connectors'
import { truncateMiddle } from '@/lib/utils'
import { useWallet } from './providers/walletProvider'
export default function Header() {
  const { walletAddress } = useWallet()
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['/api/user'],
  })

  const navigate = useNavigate()
  //const walletAddress = getWalletAddress()
  if (isLoading) {
    return (
      <header className="bg-bg-secondary flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200"></div>
          <div>
            <div className="mb-1 h-4 w-20 animate-pulse rounded bg-gray-200"></div>
            <div className="h-3 w-24 animate-pulse rounded bg-gray-200"></div>
          </div>
        </div>
        <div className="h-6 w-6 animate-pulse rounded bg-gray-200"></div>
      </header>
    )
  }

  return (
    <header className="bg-bg-secondary flex items-center justify-between border-b border-gray-100 px-4 py-3">
      <div className="flex items-center space-x-3">
        <img
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=32&h=32"
          alt="User profile"
          className="h-8 w-8 rounded-full object-cover"
        />
        <div>
          <p className="text-text-primary text-sm font-medium">
            {user?.name || 'Wallet'}
          </p>
          <p className="text-text-tertiary text-xs">
            {walletAddress && truncateMiddle(walletAddress, 8, 5)}
          </p>
        </div>
      </div>

      <button
        className="text-text-secondary hover:text-text-primary relative p-2 transition-colors duration-200"
        onClick={() => navigate('/notifications')}
      >
        <Bell className="h-5 w-5" />
        <span className="absolute -right-1 -top-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500">
          <span className="text-xs font-bold text-white">0</span>
        </span>
      </button>
    </header>
  )
}
