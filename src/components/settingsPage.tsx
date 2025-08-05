import { useState } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/header'
import BottomNavigation from '@/components/bottom-navigation'
import {
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  MessageCircle,
  ExternalLink,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { getWalletAddress, logoutWallet } from '@/lib/wallet/connectors'
import { useConnectTelegram } from '@/lib/connectTelegram'
import { truncateMiddle } from '@/lib/utils'
import { useUser } from '@/hooks/useGetUser'
import { useNavigate } from 'react-router-dom'
import { useWallet } from './providers/walletProvider'
export default function Settings() {
  const [showTelegramModal, setShowTelegramModal] = useState(false)
  const { setWalletAddress } = useWallet()
  const navigate = useNavigate()
  const handleTelegramConnect = () => {
    setShowTelegramModal(true)
  }

  const { mutate, isPending, isSuccess, isError, data, error } =
    useConnectTelegram()
  const walletAddress = getWalletAddress()
  const handleTelegramRedirect = () => {
    // In a real app, this would redirect to Telegram authentication
    if (!walletAddress) {
      console.log('No wallet address')
      return
    }
    mutate(walletAddress, {
      onSuccess: (url: string) => {
        window.open(url, '_blank') // open Telegram link
        setShowTelegramModal(false)
      },
    })
  }

  const handleLogout = () => {
    setWalletAddress(null)
    logoutWallet()
    navigate('/') // or redirect to welcome/login
  }

  const settingsItems = [
    {
      icon: Bell,
      label: 'Notifications',
      description: 'Manage alerts and notifications',
      action: () => navigate('/notifications'),
    },
    {
      icon: MessageCircle,
      label: 'Connect Telegram',
      description: 'Link your Telegram for instant notifications',
      action: handleTelegramConnect,
      highlight: true,
    },
    /* {
      icon: Shield,
      label: 'Security',
      description: 'Two-factor authentication, passwords',
      action: () => console.log('Security'),
    },*/
    /*{
      icon: HelpCircle,
      label: 'Help & Support',
      description: 'FAQs, contact support',
      action: () => console.log('Help'),
    },*/
    {
      icon: LogOut,
      label: 'Sign Out',
      description: 'Log out of your account',
      action: () => handleLogout(),
      destructive: true,
    },
  ]

  const { data: user } = useUser(walletAddress!)

  console.log('user is', user)

  return (
    <>
      <Header />
      <main className="flex-1 overflow-y-auto pb-20">
        <div className="p-4">
          <h1 className="text-text-primary mb-6 text-2xl font-bold">
            Settings
          </h1>

          {/* Account Info */}
          <div className="bg-bg-secondary shadow-soft mb-6 rounded-xl p-4">
            <h2 className="text-text-primary mb-4 text-lg font-semibold">
              Account Information
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Wallet address</span>
                <span className="text-text-primary font-medium">
                  {walletAddress ? truncateMiddle(walletAddress, 10, 5) : '---'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Telgram Handle</span>
                <span className="text-text-primary font-medium">
                  {user?.user ? user.user.telegramUsername : '---'}
                </span>
              </div>
              <div className="flex hidden items-center justify-between">
                <span className="text-text-secondary">Membership</span>
                <span className="text-brand-green font-medium">Premium</span>
              </div>
            </div>
          </div>

          {/* Settings Items */}
          <div className="bg-bg-secondary shadow-soft overflow-hidden rounded-xl">
            {settingsItems.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.button
                  key={index}
                  onClick={item.action}
                  whileHover={{ scale: 1.005 }}
                  whileTap={{ scale: 0.995 }}
                  className={`flex w-full items-center justify-between p-4 transition-colors hover:bg-gray-50 ${
                    index < settingsItems.length - 1
                      ? 'border-b border-gray-100'
                      : ''
                  } ${item.highlight ? 'bg-gradient-to-r from-blue-50 to-purple-50' : ''}`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon
                      className={`h-5 w-5 ${
                        item.destructive
                          ? 'text-red-500'
                          : item.highlight
                            ? 'text-blue-500'
                            : 'text-text-secondary'
                      }`}
                    />
                    <div className="text-left">
                      <p
                        className={`font-medium ${
                          item.destructive
                            ? 'text-red-500'
                            : item.highlight
                              ? 'text-blue-600'
                              : 'text-text-primary'
                        }`}
                      >
                        {item.label}
                      </p>
                      <p className="text-text-tertiary text-xs">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="text-text-tertiary h-4 w-4" />
                </motion.button>
              )
            })}
          </div>

          {/* App Info */}
          <div className="mt-6 text-center">
            <p className="text-text-tertiary text-xs">
              Smart Yield Vault v1.0.0
            </p>
            <p className="text-text-tertiary mt-1 text-xs">© 2025 YieldYap.</p>
          </div>
        </div>
      </main>

      {/* Telegram Connection Modal */}
      <Dialog open={showTelegramModal} onOpenChange={setShowTelegramModal}>
        <DialogContent className="w-[350px] rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center space-x-2 text-center">
              <MessageCircle className="h-6 w-6 text-blue-500" />
              <span>Connect Telegram</span>
            </DialogTitle>
          </DialogHeader>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 text-center"
          >
            <div className="space-y-4">
              <div className="rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 p-6">
                <MessageCircle className="mx-auto mb-4 h-12 w-12 text-blue-500" />
                <h3 className="mb-2 font-semibold text-gray-900">
                  Get Instant Notifications
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  Connect your Telegram account to receive real-time
                  notifications about:
                </p>
                <ul className="mt-3 space-y-1 text-xs text-gray-500">
                  <li>• Yield opportunities and rate changes</li>
                  <li>• Deposit and withdrawal confirmations</li>
                  <li>• Important vault updates</li>
                  <li>• Portfolio performance alerts</li>
                </ul>
              </div>

              <p className="text-sm text-gray-600">
                You'll be redirected to Telegram to authorize the connection
                with our bot.
              </p>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowTelegramModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                disabled={isPending}
                onClick={handleTelegramRedirect}
                className="flex-1 bg-blue-500 text-white hover:bg-blue-600"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                {isPending ? 'LOading...' : 'Connect Now'}
              </Button>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  )
}
