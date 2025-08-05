// hooks/useRegisterUser.ts
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { SERVER_URL } from './constants'

export const useRegisterUser = () => {
  return useMutation({
    mutationFn: async (payload: {
      walletAddress: string
      publicKey?: string
      walletSource?: string
      profilePicture?: string
    }) => {
      const res = await axios.post(`${SERVER_URL}users/register`, payload)
      return res.data
    },
  })
}
