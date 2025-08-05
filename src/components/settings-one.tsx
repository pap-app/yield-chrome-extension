import Header from '@/components/header'
import BottomNavigation from '@/components/bottom-navigation'
import { Bell, Shield, HelpCircle, LogOut, ChevronRight } from 'lucide-react'
import { getWalletAddress, logoutWallet } from '@/lib/wallet/connectors'
import { useNavigate } from 'react-router-dom'
import { useConnectTelegram } from '@/lib/connectTelegram'

export default function Settings() {
  const navigate = useNavigate()
  const { mutate, isPending, isSuccess, isError, data, error } =
    useConnectTelegram()

  console.log(
    `telegram connection status, loading : ${isPending}, error : ${isError}, data : ${data}`,
  )
  const handleLogout = () => {
    logoutWallet()
    navigate('/') // or redirect to welcome/login
  }

  const walletAddress = getWalletAddress()

  const handleConnectTg = () => {
    if (!walletAddress) {
      console.log('No wallet address')
      return
    }
    mutate(walletAddress, {
      onSuccess: (url: string) => {
        window.open(url, '_blank') // open Telegram link
      },
    })
  }
  const settingsItems = [
    {
      icon: Bell,
      label: 'Notifications',
      description: 'Manage alerts and notifications',
      action: () => console.log('Notifications'),
    },
    {
      icon: Shield,
      label: 'Security',
      description: 'Two-factor authentication, passwords',
      action: () => console.log('Security'),
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      description: 'FAQs, contact support',
      action: () => console.log('Help'),
    },
    {
      icon: LogOut,
      label: 'Connect Telgram',
      description: 'Log out of your account',
      action: () => handleConnectTg(),
      destructive: false,
    },
    {
      icon: LogOut,
      label: 'Sign Out',
      description: 'Log out of your account',
      action: () => handleLogout(),
      destructive: true,
    },
  ]

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
                <span className="text-text-secondary">Name</span>
                <span className="text-text-primary font-medium">Alex Chen</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Email</span>
                <span className="text-text-primary font-medium">
                  alex@example.com
                </span>
              </div>
              <div className="flex items-center justify-between">
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
                <button
                  key={index}
                  onClick={item.action}
                  className={`flex w-full items-center justify-between p-4 transition-colors hover:bg-gray-50 ${
                    index < settingsItems.length - 1
                      ? 'border-b border-gray-100'
                      : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon
                      className={`h-5 w-5 ${item.destructive ? 'text-red-500' : 'text-text-secondary'}`}
                    />
                    <div className="text-left">
                      <p
                        className={`font-medium ${item.destructive ? 'text-red-500' : 'text-text-primary'}`}
                      >
                        {item.label}
                      </p>
                      <p className="text-text-tertiary text-xs">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="text-text-tertiary h-4 w-4" />
                </button>
              )
            })}
          </div>

          {/* App Info */}
          <div className="mt-6 text-center">
            <p className="text-text-tertiary text-xs">
              Smart Yield Vault v1.0.0
            </p>
            <p className="text-text-tertiary mt-1 text-xs">
              © 2024 Yield Technologies Inc.
            </p>
          </div>
        </div>
      </main>
    </>
  )
}
