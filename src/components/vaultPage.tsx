import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Star,
  TrendingUp,
  Shield,
  DollarSign,
  Wallet,
  Check,
  X,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetVaultById } from '@/hooks/useGetVaults'
import { truncateMiddle } from '@/lib/utils'
import { getSmartBalance, useFetchBalance } from '@/hooks/useGetBlance'

interface VaultData {
  id: string
  name: string
  tvl: string
  apy: string
  status: 'active' | 'new' | 'high-yield'
  description: string
  address: string
  type: string
  metrics: {
    apy24h: string
    apy7d: string
    apy30d: string
  }
}

// Mock vault data - in a real app this would come from API/props
const vaultData: VaultData = {
  id: 'vault-1',
  name: 'USDC Yield Optimizer',
  tvl: '$2.4M',
  apy: '8.1%',
  status: 'high-yield',
  description:
    'Our flagship vault automatically finds the best yield opportunities for USDC across multiple DeFi protocols. Your funds are continuously rebalanced to maximize returns while maintaining security.',
  address: '0x742d35Cc6aB5632168C2f7b05F5c4Ed4D65E8A4D',
  type: 'Automated Yield Strategy',
  metrics: {
    apy24h: '0.3%',
    apy7d: '2.9%',
    apy30d: '1.1%',
  },
}

export default function VaultDetails() {
  // const params = useParams();
  const navigate = useNavigate()
  const { vaultId } = useParams()
  const [isFollowing, setIsFollowing] = useState(false)
  const [showFollowModal, setShowFollowModal] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)
  const [depositLoading, setDepositLoading] = useState(false)
  const [withdrawLoading, setWithdrawLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [depositAmount, setDepositAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [lastAction, setLastAction] = useState<'deposit' | 'withdraw' | null>(
    null,
  )
  const { toast } = useToast()

  const { data, isLoading } = useGetVaultById(vaultId!)

  // For example: asset might be from vault.asset or vault.assetType or vault.name
  const asset = data?.asset?.toLowerCase() ?? undefined

  const { data: balances } = useFetchBalance(asset!, {
    enabled: !!asset,
  })

  console.log('balances', balances)

  // Mock user balance
  //const userBalance = 0
  const userBalance = getSmartBalance(balances?.balance)
  const userVaultBalance = 0

  const handleBack = () => {
    navigate('/yields')
  }

  const handleStarClick = () => {
    setShowFollowModal(true)
  }

  const handleFollow = async () => {
    setFollowLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setFollowLoading(false)
    setIsFollowing(true)
    setShowFollowModal(false)

    toast({
      title: 'Following vault!',
      description:
        "You'll receive notifications about yield opportunities and changes.",
    })
  }

  const handleDepositClick = () => {
    setShowDepositModal(true)
    setDepositAmount('')
  }

  const handleWithdrawClick = () => {
    setShowWithdrawModal(true)
    setWithdrawAmount('')
  }

  const handleDeposit = async () => {
    setDepositLoading(true)
    setLastAction('deposit')

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate success/failure (80% success rate)
      if (Math.random() > 0.2) {
        setDepositLoading(false)
        setShowDepositModal(false)
        setShowSuccessModal(true)
        setDepositAmount('')
      } else {
        throw new Error('Network timeout')
      }
    } catch (error) {
      setDepositLoading(false)
      setShowErrorModal(true)
    }
  }

  const handleWithdraw = async () => {
    setWithdrawLoading(true)
    setLastAction('withdraw')

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate success/failure (80% success rate)
      if (Math.random() > 0.2) {
        setWithdrawLoading(false)
        setShowWithdrawModal(false)
        setShowSuccessModal(true)
        setWithdrawAmount('')
      } else {
        throw new Error('Insufficient balance')
      }
    } catch (error) {
      setWithdrawLoading(false)
      setShowErrorModal(true)
    }
  }

  const setQuickAmount = (amount: number, type: 'deposit' | 'withdraw') => {
    if (type === 'deposit') {
      setDepositAmount(amount.toString())
    } else {
      setWithdrawAmount(amount.toString())
    }
  }

  const setMaxAmount = (type: 'deposit' | 'withdraw') => {
    if (type === 'deposit') {
      setDepositAmount(userBalance.toString())
    } else {
      setWithdrawAmount(userVaultBalance.toString())
    }
  }

  const getDepositError = () => {
    const amount = parseFloat(depositAmount)
    if (isNaN(amount) || amount <= 0) return null
    if (amount > Number(userBalance)) return 'Not enough balance'
    return null
  }

  const getWithdrawError = () => {
    const amount = parseFloat(withdrawAmount)
    if (isNaN(amount) || amount <= 0) return null
    if (amount > userVaultBalance) return 'Not enough balance'
    return null
  }

  const isDepositValid = () => {
    const amount = parseFloat(depositAmount)
    return !isNaN(amount) && amount > 0 && amount <= Number(userBalance)
  }

  const isWithdrawValid = () => {
    const amount = parseFloat(withdrawAmount)
    return !isNaN(amount) && amount > 0 && amount <= userVaultBalance
  }

  const getStatusBadgeProps = (status: string) => {
    switch (status) {
      case 'high-yield':
        return {
          className: 'bg-green-100 text-green-800 border-green-200',
          children: 'High Yield',
        }
      case 'new':
        return {
          className: 'bg-blue-100 text-blue-800 border-blue-200',
          children: 'New',
        }
      default:
        return {
          className: 'bg-gray-100 text-gray-800 border-gray-200',
          children: 'Active',
        }
    }
  }

  if (isLoading) {
    ;<div className="flex h-full w-full items-center justify-center">
      <Loader2 className="h-9 w-9 text-gray-500" />
    </div>
  }
  return (
    <div className="flex h-full flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between border-b border-gray-100 p-4 dark:border-gray-800"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="font-semibold text-gray-900 dark:text-gray-100">
          Vault Details
        </h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleStarClick}
          className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-800 ${
            isFollowing ? 'text-yellow-500' : 'text-gray-400'
          }`}
        >
          <Star className={`h-5 w-5 ${isFollowing ? 'fill-current' : ''}`} />
        </Button>
      </motion.div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Top Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4 p-4"
        >
          {/* Vault Info */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {data && truncateMiddle(data?.name, 11, 5)}
              </h2>
              <Badge {...getStatusBadgeProps(vaultData.status)} />
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  TVL
                </span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {`$ 10`}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  APY
                </span>
                <span className="font-semibold text-green-600">{`0.00%`}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleDepositClick}
              className="h-12 bg-green-500 font-medium text-white hover:bg-green-600"
            >
              <Wallet className="mr-2 h-4 w-4" />
              Deposit
            </Button>

            <Button
              onClick={handleWithdrawClick}
              variant="outline"
              className="h-12 border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
            >
              <DollarSign className="mr-2 h-4 w-4" />
              Withdraw
            </Button>
          </div>

          {/* Description */}
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            <h3 className="mb-2 font-medium text-gray-900 dark:text-gray-100">
              About this vault
            </h3>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              {data?.description}
            </p>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="px-4 pb-4"
        >
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="mb-4 grid w-full grid-cols-2">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 py-2 dark:border-gray-800">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Name
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {data?.name}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 py-2 dark:border-gray-800">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Type
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {data?.tag}
                  </span>
                </div>
                <div className="flex items-start justify-between py-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Address
                  </span>
                  <span className="break-all text-right font-mono text-sm text-gray-900 dark:text-gray-100">
                    {data && truncateMiddle(data?.address, 14, 5)}
                  </span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="metrics" className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 py-2 dark:border-gray-800">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    24h APY
                  </span>
                  <span className="text-sm font-medium text-green-600">
                    {vaultData.metrics.apy24h}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 py-2 dark:border-gray-800">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    7d APY
                  </span>
                  <span className="text-sm font-medium text-green-600">
                    {vaultData.metrics.apy7d}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    30d APY
                  </span>
                  <span className="text-sm font-medium text-green-600">
                    {vaultData.metrics.apy30d}
                  </span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Follow Modal */}
      <Dialog open={showFollowModal} onOpenChange={setShowFollowModal}>
        <DialogContent className="w-[350px] rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span>Follow this vault</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Get notified about vault changes, yield opportunities, and
              important updates. You'll be the first to know about alpha
              opportunities!
            </p>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowFollowModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleFollow}
                disabled={followLoading}
                className="flex-1 bg-yellow-500 text-white hover:bg-yellow-600"
              >
                {followLoading ? (
                  <motion.div
                    className="flex items-center space-x-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      className="h-4 w-4 rounded-full border-2 border-white border-t-transparent"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                    <span>Following...</span>
                  </motion.div>
                ) : (
                  'Follow'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="w-[350px] rounded-lg sm:max-w-md">
          <div className="space-y-4 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900"
            >
              <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
            </motion.div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {lastAction === 'deposit'
                  ? 'Deposit successful!'
                  : 'Withdrawal successful!'}
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {lastAction === 'deposit'
                  ? "You're now earning yield! Your funds are being optimized for maximum returns."
                  : 'Your funds have been withdrawn successfully and are now in your wallet.'}
              </p>
            </div>
            <Button
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-green-500 text-white hover:bg-green-600"
            >
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Deposit Modal */}
      <Dialog open={showDepositModal} onOpenChange={setShowDepositModal}>
        <DialogContent className="w-[350px] rounded-lg sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Wallet className="h-5 w-5 text-green-500" />
              <span>Deposit to Vault</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deposit-amount">Amount ({data?.asset})</Label>
              <div className="relative">
                <Input
                  id="deposit-amount"
                  type="number"
                  placeholder="0.00"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="pr-16"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setMaxAmount('deposit')}
                  className="absolute right-1 top-1 h-8 px-2 text-xs font-medium text-green-600 hover:text-green-700"
                >
                  MAX
                </Button>
              </div>
              {getDepositError() && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-600"
                >
                  {getDepositError()}
                </motion.p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Quick amounts</Label>
              <div className="grid grid-cols-4 gap-2">
                {[100, 250, 500, 1000].map((amount) => (
                  <Button
                    key={amount}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setQuickAmount(amount, 'deposit')}
                    disabled={amount > Number(userBalance)}
                    className="text-xs"
                  >
                    ${amount}
                  </Button>
                ))}
              </div>
            </div>

            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Available Balance:
                </span>
                <span className="font-medium">
                  ${userBalance} {data?.asset}
                </span>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowDepositModal(false)}
                className="flex-1"
                disabled={depositLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeposit}
                disabled={!isDepositValid() || depositLoading}
                className="flex-1 bg-green-500 text-white hover:bg-green-600"
              >
                {depositLoading ? (
                  <motion.div
                    className="flex items-center space-x-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      className="h-4 w-4 rounded-full border-2 border-white border-t-transparent"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                    <span>Depositing...</span>
                  </motion.div>
                ) : (
                  `Deposit ${depositAmount ? `$${depositAmount}` : ''}`
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Withdraw Modal */}
      <Dialog open={showWithdrawModal} onOpenChange={setShowWithdrawModal}>
        <DialogContent className="w-[350px] rounded-lg sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-blue-500" />
              <span>Withdraw from Vault</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="withdraw-amount">Amount ({data?.asset})</Label>
              <div className="relative">
                <Input
                  id="withdraw-amount"
                  type="number"
                  placeholder="0.00"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="pr-16"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setMaxAmount('withdraw')}
                  className="absolute right-1 top-1 h-8 px-2 text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                  MAX
                </Button>
              </div>
              {getWithdrawError() && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-600"
                >
                  {getWithdrawError()}
                </motion.p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Quick amounts</Label>
              <div className="grid grid-cols-4 gap-2">
                {[100, 250, 500, 850].map((amount) => (
                  <Button
                    key={amount}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setQuickAmount(amount, 'withdraw')}
                    disabled={amount > userVaultBalance}
                    className="text-xs"
                  >
                    ${amount}
                  </Button>
                ))}
              </div>
            </div>

            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Vault Balance:
                </span>
                <span className="font-medium">
                  ${userVaultBalance.toFixed(2)} USDC
                </span>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1"
                disabled={withdrawLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleWithdraw}
                disabled={!isWithdrawValid() || withdrawLoading}
                className="flex-1 bg-blue-500 text-white hover:bg-blue-600"
              >
                {withdrawLoading ? (
                  <motion.div
                    className="flex items-center space-x-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      className="h-4 w-4 rounded-full border-2 border-white border-t-transparent"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                    <span>Withdrawing...</span>
                  </motion.div>
                ) : (
                  `Withdraw ${withdrawAmount ? `$${withdrawAmount}` : ''}`
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Error Modal */}
      <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
        <DialogContent className="sm:max-w-md">
          <div className="space-y-4 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900"
            >
              <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </motion.div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Something went wrong
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {lastAction === 'deposit'
                  ? "We couldn't process your deposit. Please check your balance and try again."
                  : "We couldn't process your withdrawal. Please try again in a moment."}
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowErrorModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={
                  lastAction === 'deposit' ? handleDeposit : handleWithdraw
                }
                className="flex-1 bg-blue-500 text-white hover:bg-blue-600"
              >
                Try Again
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
