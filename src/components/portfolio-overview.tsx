import { TrendingUp } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Portfolio } from '@/shared/schema'

export default function PortfolioOverview() {
  const { data: portfolio, isLoading } = useQuery<Portfolio>({
    queryKey: ['/api/portfolio'],
  })

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="bg-bg-secondary shadow-soft rounded-2xl p-6">
          <div className="text-center">
            <div className="mx-auto mb-2 h-4 w-32 animate-pulse rounded bg-gray-200"></div>
            <div className="mx-auto mb-4 h-8 w-48 animate-pulse rounded bg-gray-200"></div>
            <div className="mx-auto h-4 w-40 animate-pulse rounded bg-gray-200"></div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
            <div className="text-center">
              <div className="mx-auto mb-2 h-3 w-20 animate-pulse rounded bg-gray-200"></div>
              <div className="mx-auto h-6 w-16 animate-pulse rounded bg-gray-200"></div>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-2 h-3 w-24 animate-pulse rounded bg-gray-200"></div>
              <div className="mx-auto h-6 w-20 animate-pulse rounded bg-gray-200"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!portfolio) {
    return (
      <div className="p-4">
        <div className="bg-bg-secondary shadow-soft rounded-2xl p-6 text-center">
          <p className="text-text-secondary">No portfolio data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="bg-bg-secondary shadow-soft rounded-2xl p-6">
        <div className="text-center">
          <p className="text-text-secondary mb-1 text-sm font-medium">
            Total Portfolio Value
          </p>
          <h1 className="text-text-primary mb-2 text-3xl font-bold">
            ${parseFloat(portfolio.totalValue).toLocaleString()}
          </h1>
          <div className="flex items-center justify-center space-x-2 text-green-600">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-medium">
              +${parseFloat(portfolio.dailyChange).toFixed(2)} (
              {portfolio.dailyChangePercent}%) today
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
          <div className="text-center">
            <p className="text-text-tertiary mb-1 text-xs font-medium">
              Current APY
            </p>
            <p className="text-brand-green text-xl font-bold">
              {portfolio.currentAPY}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-text-tertiary mb-1 text-xs font-medium">
              Monthly Earnings
            </p>
            <p className="text-text-primary text-xl font-bold">
              ${parseFloat(portfolio.monthlyEarnings).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
