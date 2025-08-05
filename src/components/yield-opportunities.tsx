import { ExternalLink } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { YieldOpportunity } from '@/shared/schema'

export default function YieldOpportunities() {
  const { data: opportunities, isLoading } = useQuery<YieldOpportunity[]>({
    queryKey: ['/api/yield-opportunities'],
  })

  if (isLoading) {
    return (
      <div className="px-4 pb-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="h-6 w-48 animate-pulse rounded bg-gray-200"></div>
          <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-bg-secondary shadow-soft rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200"></div>
                  <div>
                    <div className="mb-1 h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                    <div className="h-3 w-20 animate-pulse rounded bg-gray-200"></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="mb-1 h-4 w-16 animate-pulse rounded bg-gray-200"></div>
                  <div className="h-3 w-12 animate-pulse rounded bg-gray-200"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!opportunities || opportunities.length === 0) {
    return (
      <div className="px-4 pb-4">
        <h2 className="text-text-primary mb-4 text-lg font-semibold">
          Top Yield Opportunities
        </h2>
        <div className="bg-bg-secondary shadow-soft rounded-xl p-4 text-center">
          <p className="text-text-secondary">
            No yield opportunities available
          </p>
        </div>
      </div>
    )
  }

  const getIconColorClass = (iconColor: string) => {
    switch (iconColor) {
      case 'text-blue-600':
        return 'text-blue-600'
      case 'text-purple-600':
        return 'text-purple-600'
      case 'text-green-600':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  const getBackgroundColorClass = (iconColor: string) => {
    switch (iconColor) {
      case 'text-blue-600':
        return 'bg-blue-100'
      case 'text-purple-600':
        return 'bg-purple-100'
      case 'text-green-600':
        return 'bg-green-100'
      default:
        return 'bg-gray-100'
    }
  }

  return (
    <div className="px-4 pb-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-text-primary text-lg font-semibold">
          Top Yield Opportunities
        </h2>
        <button className="text-brand-green hover:text-brand-green-dark flex items-center space-x-1 text-sm font-medium transition-colors">
          <span>View All</span>
          <ExternalLink className="h-3 w-3" />
        </button>
      </div>

      <div className="space-y-3">
        {opportunities.map((opportunity) => (
          <div
            key={opportunity.id}
            className="bg-bg-secondary shadow-soft cursor-pointer rounded-xl p-4 transition-shadow duration-200 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`h-10 w-10 ${getBackgroundColorClass(opportunity.iconColor)} flex items-center justify-center rounded-full`}
                >
                  <i
                    className={`${opportunity.icon} ${getIconColorClass(opportunity.iconColor)} text-lg`}
                  ></i>
                </div>
                <div>
                  <h3 className="text-text-primary font-medium">
                    {opportunity.name}
                  </h3>
                  <p className="text-text-tertiary text-xs">
                    {opportunity.protocol}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-brand-green font-bold">
                  {opportunity.apy}% APY
                </p>
                <p className="text-text-tertiary text-xs">
                  {opportunity.riskLevel}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
