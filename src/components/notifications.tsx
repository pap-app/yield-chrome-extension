import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Clock,
  Star,
} from 'lucide-react'
import Header from '@/components/header'
import BottomNavigation from '@/components/bottom-navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Notification {
  id: string
  type:
    | 'yield_update'
    | 'vault_follow'
    | 'deposit_success'
    | 'withdraw_success'
    | 'alert'
  title: string
  message: string
  timestamp: string
  isRead: boolean
  vaultName?: string
  amount?: string
}

// Mock notifications data
const mockNotifications: Notification[] = [
  /*{
    id: 'notif-1',
    type: 'yield_update',
    title: 'Yield Rate Increased',
    message: 'USDC Yield Optimizer APY increased from 7.8% to 8.1%',
    timestamp: '2 hours ago',
    isRead: false,
    vaultName: 'USDC Yield Optimizer',
  },
  {
    id: 'notif-2',
    type: 'deposit_success',
    title: 'Deposit Successful',
    message: 'Your deposit has been processed and is now earning yield',
    timestamp: '1 day ago',
    isRead: true,
    vaultName: 'ETH Staking Pool',
    amount: '$500.00',
  },
  {
    id: 'notif-3',
    type: 'vault_follow',
    title: 'Now Following Vault',
    message: "You'll receive updates about BTC Liquidity Pool opportunities",
    timestamp: '2 days ago',
    isRead: true,
    vaultName: 'BTC Liquidity Pool',
  },
  {
    id: 'notif-4',
    type: 'alert',
    title: 'Market Alert',
    message: 'High volatility detected in DeFi markets. Review your positions.',
    timestamp: '3 days ago',
    isRead: true,
  },*/
]

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      // Comment the line below to test empty state
      setNotifications(mockNotifications)
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'yield_update':
        return <TrendingUp className="h-5 w-5 text-green-600" />
      case 'deposit_success':
      case 'withdraw_success':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'vault_follow':
        return <Star className="h-5 w-5 text-yellow-600" />
      case 'alert':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />
      default:
        return <Bell className="h-5 w-5 text-gray-600" />
    }
  }

  const getNotificationBgColor = (type: string) => {
    switch (type) {
      case 'yield_update':
        return 'bg-green-100 dark:bg-green-900'
      case 'deposit_success':
      case 'withdraw_success':
        return 'bg-green-100 dark:bg-green-900'
      case 'vault_follow':
        return 'bg-yellow-100 dark:bg-yellow-900'
      case 'alert':
        return 'bg-orange-100 dark:bg-orange-900'
      default:
        return 'bg-gray-100 dark:bg-gray-800'
    }
  }

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif,
      ),
    )
  }

  const EmptyStateIcon = () => (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto opacity-60"
    >
      <circle
        cx="60"
        cy="60"
        r="50"
        fill="#F3F4F6"
        stroke="#E5E7EB"
        strokeWidth="2"
      />
      <path
        d="M40 45C40 38.3726 45.3726 33 52 33H68C74.6274 33 80 38.3726 80 45V65C80 71.6274 74.6274 77 68 77H52C45.3726 77 40 71.6274 40 65V45Z"
        fill="#E5E7EB"
      />
      <circle cx="60" cy="50" r="8" fill="#9CA3AF" />
      <path
        d="M50 85L60 90L70 85"
        stroke="#9CA3AF"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="75" cy="35" r="5" fill="#EF4444" className="animate-pulse" />
    </svg>
  )

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="flex-1 overflow-y-auto pb-20">
          <div className="p-4">
            <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
              Notifications
            </h1>

            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="animate-pulse rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800"
                >
                  <div className="flex items-start space-x-3">
                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
                      <div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
                      <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </main>
        <BottomNavigation />
      </>
    )
  }

  if (notifications.length === 0) {
    return (
      <>
        <Header />
        <main className="flex flex-1 items-center justify-center overflow-y-auto pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-8 py-12 text-center"
          >
            <EmptyStateIcon />
            <h2 className="mb-2 mt-6 text-xl font-semibold text-gray-900 dark:text-gray-100">
              No notifications yet
            </h2>
            <p className="mx-auto max-w-sm text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              You'll get updates from your vaults here. Follow vaults to stay
              informed about yield opportunities and important changes.
            </p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6"
            >
              <Button
                variant="outline"
                className="text-sm"
                onClick={() => window.history.back()}
              >
                <Bell className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </motion.div>
          </motion.div>
        </main>
        <BottomNavigation />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="flex-1 overflow-y-auto pb-20">
        <div className="p-4">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Notifications
            </h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setNotifications((prev) =>
                  prev.map((n) => ({ ...n, isRead: true })),
                )
              }
              className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              Mark all read
            </Button>
          </div>

          <div className="space-y-3">
            {notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() =>
                  !notification.isRead && markAsRead(notification.id)
                }
                className={`cursor-pointer rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 ${
                  !notification.isRead
                    ? 'ring-2 ring-blue-100 dark:ring-blue-900'
                    : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${getNotificationBgColor(notification.type)}`}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {notification.title}
                          </h3>
                          {!notification.isRead && (
                            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                          )}
                        </div>
                        <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                          {notification.message}
                        </p>
                        <div className="mt-2 flex items-center space-x-3">
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-500">
                            <Clock className="mr-1 h-3 w-3" />
                            {notification.timestamp}
                          </div>
                          {notification.vaultName && (
                            <Badge variant="outline" className="py-0 text-xs">
                              {notification.vaultName}
                            </Badge>
                          )}
                          {notification.amount && (
                            <Badge className="border-green-200 bg-green-100 py-0 text-xs text-green-800">
                              {notification.amount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
