import { SERVER_URL } from '@/lib/constants'
import { getWalletAddress } from '@/lib/wallet/connectors'
import { useQuery } from '@tanstack/react-query'

export type Balance = {
  balance: string
  asset_type: string
}

export type PortfolioResponse = {
  wallet: string
  balance: Balance[]
}

const walletAddress = getWalletAddress()

export const useFetchBalance1 = (asset: string) => {
  return useQuery<PortfolioResponse>({
    queryKey: ['portfolio', walletAddress],
    queryFn: async () => {
      const res = await fetch(
        `${SERVER_URL}vault/balances/${walletAddress}?assets=${asset}`,
      )
      if (!res.ok) throw new Error('Failed to fetch portfolio')
      return res.json()
    },
  })
}

export const useFetchBalance = (
  asset: string,
  options?: { enabled?: boolean }, // 👈 accept optional options here
) => {
  const walletAddress = getWalletAddress()

  return useQuery<PortfolioResponse>({
    queryKey: ['portfolio', walletAddress, asset],
    queryFn: async () => {
      const res = await fetch(
        `${SERVER_URL}vault/balances/${walletAddress}?assets=${asset}`,
      )
      if (!res.ok) throw new Error('Failed to fetch portfolio')
      return res.json()
    },
    enabled: options?.enabled ?? true, // 👈 only enable when explicitly allowed
  })
}

export function getSmartBalance(balances: Balance[] | undefined): string {
  if (!balances || balances.length === 0) {
    return '0'
  }

  console.log('balances from main', balances)
  // If asset has balance, return it — default to the first match
  const balance = balances[0]?.balance
  console.log('balance from func', balance)
  return balance ?? '0.00'
}
