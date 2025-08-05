import { SERVER_URL } from '@/lib/constants'
import { useQuery } from '@tanstack/react-query'

export type User = {
  id: string
  points: number
  walletAddress: string
  telegramUsername: string
}

type USER_DATA = {
  user: User
}
export const useUser = (walletAddress: string) => {
  return useQuery<USER_DATA>({
    queryKey: ['user', walletAddress],
    queryFn: async () => {
      const res = await fetch(
        `${SERVER_URL}users?walletAddress=${walletAddress}`,
      )
      if (!res.ok) throw new Error('Failed to fetch portfolio')
      return res.json()
    },
  })
}
