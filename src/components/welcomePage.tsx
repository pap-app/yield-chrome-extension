import React, { useEffect } from 'react'
import OnboardingFlow from './onboardingFlow'
import { useNavigate } from 'react-router-dom'
import { getWalletAddress } from '@/lib/wallet/connectors'

export default function WelcomePage() {
  const navigate = useNavigate()
  const handleComplete = () => {
    // Navigate to dashboard after onboarding completion
    navigate('/home')
  }

  return (
    <div>
      <OnboardingFlow onComplete={handleComplete} />
    </div>
  )
}
