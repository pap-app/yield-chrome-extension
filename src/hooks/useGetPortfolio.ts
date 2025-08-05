import { SERVER_URL } from '@/lib/constants'
import { useQuery } from '@tanstack/react-query'

export type PortfolioItem = {
  asset: string
  assetType: string
  balance: string
  totalValue: number
  currentAPY: string
  dailyChange: string
  dailyChangePercent: string
  earningPercentage: string
  growth: string
  id: string
  monthlyEarnings: string
}

export type PortfolioResponse = {
  wallet: string
  portfolio: PortfolioItem[]
}

export const usePortfolio = (walletId: string) => {
  return useQuery<PortfolioResponse>({
    queryKey: ['portfolio', walletId],
    queryFn: async () => {
      const res = await fetch(`${SERVER_URL}vault/portfolio/${walletId}`)
      if (!res.ok) throw new Error('Failed to fetch portfolio')
      return res.json()
    },
  })
}
