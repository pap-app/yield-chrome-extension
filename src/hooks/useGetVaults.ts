import { SERVER_URL } from '@/lib/constants'
import { useQuery } from '@tanstack/react-query'

export type VaultItem = {
  vaultId: string
  name: string
  address: string
  tvl: number
  asset: string
  description: string
  apy: string
  dailyChange: string
  dailyChangePercent: string
  earningPercentage: string
  growth: string
  tag: string
  logo: string
  monthlyEarnings: string
  riskLevel: string
}

export const useVault = () => {
  return useQuery<VaultItem[]>({
    queryKey: ['vaults'],
    queryFn: async () => {
      const res = await fetch(`${SERVER_URL}vault`)
      if (!res.ok) throw new Error('Failed to fetch vautls')
      return res.json()
    },
  })
}

export const useGetVaultById = (vaultId: string) => {
  return useQuery<VaultItem>({
    queryKey: ['vaults', vaultId],
    queryFn: async () => {
      const res = await fetch(`${SERVER_URL}vault?vaultId=${vaultId}`)
      if (!res.ok) throw new Error('Failed to fetch vault')
      return res.json()
    },
  })
}
