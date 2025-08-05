import Header from '@/components/header'
import BottomNavigation from '@/components/bottom-navigation'
import AssetAllocation from '@/components/asset-allocation'
import { useQuery } from '@tanstack/react-query'
import { TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react'
import type { Portfolio } from '@/shared/schema'
export default function Portfolio() {
  const { data: portfolio, isLoading } = useQuery<Portfolio>({
    queryKey: ['/api/portfolio'],
  })

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="flex-1 overflow-y-auto p-4 pb-20">
          <div className="space-y-4">
            <div className="h-8 w-32 animate-pulse rounded bg-gray-200"></div>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-bg-secondary shadow-soft rounded-xl p-4"
                >
                  <div className="mb-2 h-4 w-16 animate-pulse rounded bg-gray-200"></div>
                  <div className="h-6 w-20 animate-pulse rounded bg-gray-200"></div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="flex-1 overflow-y-auto pb-20">
        <div className="p-4">
          <h1 className="text-text-primary mb-6 text-2xl font-bold">
            Portfolio Details
          </h1>

          <div className="mb-6 grid grid-cols-2 gap-4">
            <div className="bg-bg-secondary shadow-soft rounded-xl p-4">
              <div className="mb-2 flex items-center space-x-2">
                <DollarSign className="text-text-secondary h-4 w-4" />
                <span className="text-text-secondary text-sm">Total Value</span>
              </div>
              <p className="text-text-primary text-xl font-bold">
                $
                {portfolio
                  ? parseFloat(portfolio.totalValue).toLocaleString()
                  : 0}
              </p>
            </div>

            <div className="bg-bg-secondary shadow-soft rounded-xl p-4">
              <div className="mb-2 flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-text-secondary text-sm">
                  Daily Change
                </span>
              </div>
              <p className="text-xl font-bold text-green-600">
                +${portfolio ? parseFloat(portfolio.dailyChange).toFixed(2) : 0}
              </p>
            </div>

            <div className="bg-bg-secondary shadow-soft rounded-xl p-4">
              <div className="mb-2 flex items-center space-x-2">
                <Percent className="text-brand-green h-4 w-4" />
                <span className="text-text-secondary text-sm">Current APY</span>
              </div>
              <p className="text-brand-green text-xl font-bold">
                {portfolio ? portfolio.currentAPY : 0}%
              </p>
            </div>

            <div className="bg-bg-secondary shadow-soft rounded-xl p-4">
              <div className="mb-2 flex items-center space-x-2">
                <DollarSign className="text-text-secondary h-4 w-4" />
                <span className="text-text-secondary text-sm">
                  Monthly Earnings
                </span>
              </div>
              <p className="text-text-primary text-xl font-bold">
                $
                {portfolio
                  ? parseFloat(portfolio.monthlyEarnings).toLocaleString()
                  : 0}
              </p>
            </div>
          </div>
        </div>

        <AssetAllocation />
      </main>
    </>
  )
}
