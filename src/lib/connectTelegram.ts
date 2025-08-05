import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { SERVER_URL } from './constants'

export function useConnectTelegram() {
  return useMutation({
    mutationFn: async (walletAddress: string) => {
      const res = await axios.post(`${SERVER_URL}telegram/generate-link`, {
        walletAddress,
      })
      return res.data.url as string // Telegram link
    },
  })
}
