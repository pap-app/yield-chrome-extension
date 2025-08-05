import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import CurrencyTabs from '@/components/currency-tabs'
import EarningsChart from '@/components/earnings-chart'
import TimePeriodSelector from '@/components/time-period-selector'
import AssetEarningsList from '@/components/asset-earnings-list'
import { Settings } from 'lucide-react'
import { Portfolio } from '@/shared/schema'
import axios from 'axios'
import { SERVER_URL } from '@/lib/constants'
import { usePortfolio } from '@/hooks/useGetPortfolio'
import { getWalletAddress } from '@/lib/wallet/connectors'
import { useNavigate } from 'react-router-dom'
import { useWallet } from './providers/walletProvider'
type PortfolioAsset = {
  asset: string
  totalValue: number
  [key: string]: any
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('all')
  const [activePeriod, setActivePeriod] = useState('1y')
  const { walletAddress } = useWallet()
  const navigate = useNavigate()
  const MY_WALLET_ID =
    'GB5FDU7757EAJS2BHNJLLLGGYMJ2YQQZJBHG3WDAP7HJFRE7VD3FUJPU'
  const BACKEND_ENDPOINT = 'http://localhost:5000/api/'

  const url =
    'http://localhost:4000/api/v1/vault/portfolio/GB5FDU7757EAJS2BHNJLLLGGYMJ2YQQZJBHG3WDAP7HJFRE7VD3FUJPU?asset=USDC'

  /*const fetchPortfolios = async () => {
    const res = await axios.get(`${SERVER_URL}vault/portfolio/${MY_WALLET_ID}`)
    return res.data
  }

  const { data: portfolio, isLoading } = useQuery<Portfolio>({
    queryKey: ['/api/portfolio'],
    queryFn: fetchPortfolios,
  })*/

  //const walletAddress = getWalletAddress()
  const { data: portfolio, isLoading, error } = usePortfolio(walletAddress!)

  console.log('portfolio', portfolio?.portfolio)

  function getPortfolioValueByAsset(
    portfolio: PortfolioAsset[] | undefined,
    tab: string,
  ): number {
    if (!portfolio || portfolio.length === 0) return 0

    const tabUpper = tab.toUpperCase()

    const matchedAsset = portfolio.find(
      (item) => item.asset.toUpperCase() === tabUpper,
    )

    if (!matchedAsset) return 0

    return Math.floor(matchedAsset.totalValue)
  }

  function getPortfolioGrowthByAsset(
    portfolio: PortfolioAsset[] | undefined,
    tab: string,
  ): number {
    if (!portfolio || portfolio.length === 0) return 0

    const tabUpper = tab.toUpperCase()

    const matchedAsset = portfolio.find(
      (item) => item.asset.toUpperCase() === tabUpper,
    )

    if (!matchedAsset || !matchedAsset.growth) return 0

    return Math.floor(parseFloat(matchedAsset.growth))
  }

  console.log(
    `the value by tab`,
    getPortfolioValueByAsset(portfolio?.portfolio, 'EURC'),
  )

  const getTabValue = (tab: string) => {
    if (!portfolio) return 0
    // const totalValue = parseFloat(portfolio.portfolio.totalVaule)
    const totalValue = portfolio.portfolio.reduce((sum, item) => {
      return sum + item.totalValue
    }, 0)

    switch (tab) {
      case 'usdc':
        return getPortfolioValueByAsset(portfolio?.portfolio, 'usdc') //Math.floor(totalValue * 0.815)
      case 'eurc':
        return getPortfolioValueByAsset(portfolio?.portfolio, 'eurc') //Math.floor(totalValue * 0.021)
      case 'xlm':
        return getPortfolioValueByAsset(portfolio?.portfolio, 'xlm') ///Math.floor(totalValue * 0.01)
      default:
        return totalValue
    }
  }

  const getTabGrowth = (tab: string) => {
    if (!portfolio) return 0
    //const totalGrowth = parseFloat(portfolio.growth)
    const totalGrowth = portfolio.portfolio.reduce((sum, item) => {
      return sum + item.totalValue
    }, 0)

    switch (tab) {
      case 'usdc':
        return Math.floor(totalGrowth * 0.815).toFixed(2)
      case 'eurc':
        return Math.floor(totalGrowth * 0.021).toFixed(2)
      case 'xlm':
        return Math.floor(totalGrowth * 0.01).toFixed(2)
      default:
        return totalGrowth
    }
  }

  if (isLoading) {
    return (
      <>
        <main className="scrollbar-hide flex-1 overflow-y-auto p-4 pb-20">
          <div className="animate-pulse space-y-6">
            <div className="flex items-center justify-between">
              <div className="h-8 w-32 rounded bg-gray-200"></div>
              <div className="h-6 w-6 rounded bg-gray-200"></div>
            </div>
            <div className="h-10 w-full rounded-full bg-gray-200"></div>
            <div className="space-y-4 text-center">
              <div className="mx-auto h-8 w-48 rounded bg-gray-200"></div>
              <div className="mx-auto h-6 w-32 rounded bg-gray-200"></div>
            </div>
            <div className="h-48 w-full rounded bg-gray-200"></div>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <main className="flex-1 overflow-y-auto p-4 pb-20">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex space-x-2"
          >
            <div className="h-2 w-2 rounded-full bg-red-500"></div>
            <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
          </motion.div>
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-2 text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <Settings
              className="h-5 w-5"
              onClick={() => navigate('/settings')}
            />
          </motion.button>
        </div>

        {/* Currency Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <CurrencyTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </motion.div>

        {/* Balance Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-2 text-center"
        >
          <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
            Total Balance
          </p>
          <div className="flex items-center justify-center space-x-4">
            <AnimatePresence mode="wait">
              <motion.h1
                key={`${activeTab}-balance`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="text-4xl font-bold text-gray-900 dark:text-gray-100"
              >
                $
                {getTabValue(activeTab).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </motion.h1>
            </AnimatePresence>
            <div className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
              EARNING 0%
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTab}-growth`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mt-2 flex items-center justify-center space-x-2"
            >
              <span className="font-medium text-green-600">GROWTH</span>
              <span className="font-bold text-green-600">
                +${getTabGrowth(activeTab).toLocaleString()}
              </span>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <AnimatePresence mode="wait">
            <EarningsChart key={activeTab} currency={activeTab} />
          </AnimatePresence>
        </motion.div>

        {/* Time Period Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <TimePeriodSelector
            activePeriod={activePeriod}
            onPeriodChange={setActivePeriod}
          />
        </motion.div>

        {/* Asset Earnings List */}
        <AnimatePresence mode="wait">
          <AssetEarningsList key={activeTab} activeTab={activeTab} />
        </AnimatePresence>
      </main>
    </>
  )
}
