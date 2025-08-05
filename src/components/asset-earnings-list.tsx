import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { AssetAllocation } from '@/shared/schema'
import axios from 'axios'

interface AssetEarningsListProps {
  activeTab: string
}

export default function AssetEarningsList({
  activeTab,
}: AssetEarningsListProps) {
  const BACKEND_ENDPOINT = 'http://localhost:5000/api/'
  const fetchPortfolios = async () => {
    const res = await axios.get(`${BACKEND_ENDPOINT}asset-allocations`)
    return res.data
  }
  const { data: allocations, isLoading } = useQuery<AssetAllocation[]>({
    queryKey: ['/api/asset-allocations'],
    queryFn: fetchPortfolios,
  })

  if (isLoading) {
    return (
      <div className="mt-6 space-y-3">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="flex animate-pulse items-center justify-between p-3"
          >
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-gray-200"></div>
              <div>
                <div className="mb-1 h-4 w-24 rounded bg-gray-200"></div>
                <div className="h-3 w-16 rounded bg-gray-200"></div>
              </div>
            </div>
            <div className="text-right">
              <div className="mb-1 h-4 w-20 rounded bg-gray-200"></div>
              <div className="h-3 w-12 rounded bg-gray-200"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const filteredAllocations =
    allocations?.filter((allocation) => {
      if (activeTab === 'all') return true
      return allocation.assetSymbol.toLowerCase() === activeTab.toLowerCase()
    }) || []

  const earningAssets = filteredAllocations.filter(
    (asset) => asset.isEarning === 'true',
  )
  const notEarningAssets = filteredAllocations.filter(
    (asset) => asset.isEarning === 'false',
  )

  const getAssetIcon = (symbol: string) => {
    switch (symbol.toLowerCase()) {
      case 'usdc':
        return '💵'
      case 'eth':
        return '⟐'
      case 'eurc':
        return '💶'
      case 'xlm':
        return '⭐'
      default:
        return '💰'
    }
  }

  const getAssetColor = (symbol: string) => {
    switch (symbol.toLowerCase()) {
      case 'usdc':
        return 'bg-blue-100 text-blue-600'
      case 'eth':
        return 'bg-purple-100 text-purple-600'
      case 'eurc':
        return 'bg-green-100 text-green-600'
      case 'xlm':
        return 'bg-yellow-100 text-yellow-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="mt-6"
    >
      {/* Earnings Stats */}
      <div className="mb-4 flex items-center space-x-2">
        <div className="h-3 w-3 rounded-full bg-green-500"></div>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {Math.round(
            (earningAssets.length / filteredAllocations.length) * 100,
          )}
          % of Assets are Earning
        </span>
      </div>

      {/* Earning/Not Earning Tabs */}
      <div className="mb-4 flex space-x-6 border-b border-gray-200 dark:border-gray-700">
        <button className="border-b-2 border-gray-900 pb-2 text-sm font-medium text-gray-900 dark:border-gray-100 dark:text-gray-100">
          Earning
        </button>
        <button className="pb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
          Not Earning
        </button>
      </div>

      {/* Asset List */}
      <div className="space-y-3">
        {earningAssets.map((asset, index) => (
          <motion.div
            key={asset.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-center justify-between py-3"
          >
            <div className="flex items-center space-x-3">
              <div
                className={`h-8 w-8 ${getAssetColor(asset.assetSymbol)} flex items-center justify-center rounded-full text-sm font-bold`}
              >
                {getAssetIcon(asset.assetSymbol)}
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {asset.assetName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {asset.assetSymbol}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900 dark:text-gray-100">
                ${parseFloat(asset.value).toLocaleString()}
              </p>
              <p className="text-xs font-medium text-green-600">
                {asset.changePercent}%
              </p>
            </div>
          </motion.div>
        ))}

        {notEarningAssets.map((asset, index) => (
          <motion.div
            key={asset.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.3,
              delay: (earningAssets.length + index) * 0.1,
            }}
            className="flex items-center justify-between py-3 opacity-60"
          >
            <div className="flex items-center space-x-3">
              <div
                className={`h-8 w-8 ${getAssetColor(asset.assetSymbol)} flex items-center justify-center rounded-full text-sm font-bold`}
              >
                {getAssetIcon(asset.assetSymbol)}
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {asset.assetName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {asset.assetSymbol}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900 dark:text-gray-100">
                ${parseFloat(asset.value).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">{asset.changePercent}%</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
