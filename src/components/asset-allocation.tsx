import { useQuery } from '@tanstack/react-query'
import type { AssetAllocation } from '@/shared/schema'
export default function AssetAllocation() {
  const { data: allocations, isLoading } = useQuery<AssetAllocation[]>({
    queryKey: ['/api/asset-allocations'],
  })

  if (isLoading) {
    return (
      <div className="px-4 pb-4">
        <div className="mb-4 h-6 w-32 animate-pulse rounded bg-gray-200"></div>
        <div className="bg-bg-secondary shadow-soft rounded-xl p-4">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-3 w-3 animate-pulse rounded-full bg-gray-200"></div>
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                  </div>
                  <div className="text-right">
                    <div className="mb-1 h-4 w-12 animate-pulse rounded bg-gray-200"></div>
                    <div className="h-3 w-16 animate-pulse rounded bg-gray-200"></div>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-2 animate-pulse rounded-full bg-gray-300"
                    style={{ width: '30%' }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!allocations || allocations.length === 0) {
    return (
      <div className="px-4 pb-4">
        <h2 className="text-text-primary mb-4 text-lg font-semibold">
          Asset Allocation
        </h2>
        <div className="bg-bg-secondary shadow-soft rounded-xl p-4 text-center">
          <p className="text-text-secondary">
            No asset allocation data available
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 pb-4">
      <h2 className="text-text-primary mb-4 text-lg font-semibold">
        Asset Allocation
      </h2>
      <div className="bg-bg-secondary shadow-soft rounded-xl p-4">
        <div className="space-y-4">
          {allocations.map((allocation) => (
            <div key={allocation.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`h-3 w-3 ${allocation.color} rounded-full`}
                  ></div>
                  <span className="text-text-primary text-sm font-medium">
                    {allocation.assetName} ({allocation.assetSymbol})
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-text-primary text-sm font-medium">
                    {allocation.percentage}%
                  </p>
                  <p className="text-text-tertiary text-xs">
                    ${parseFloat(allocation.value).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                <div
                  className={`${allocation.color} h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${allocation.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
