import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Navigation } from 'swiper/modules'
import {
  ChevronLeft,
  ChevronRight,
  Wallet,
  TrendingUp,
  Shield,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { connectStellarWallet, getWalletAddress } from '@/lib/wallet/connectors'
import { useRegisterUser } from '@/lib/registerAccount'
import { useWallet } from './providers/walletProvider'
import flow1 from '../assets/img/flow-1.png'
interface OnboardingFlowProps {
  onComplete: () => void
}

const onboardingSlides = [
  {
    id: 1,
    title: 'DeFi Payments Made Simple',
    subtitle: 'We connect & empower people by bringing Web3 to their lives',
    description:
      'Experience seamless DeFi payments with instant transactions, low fees, and maximum security. Your gateway to the future of finance.',
    icon: TrendingUp,
    color: 'from-blue-500 to-purple-600',
    features: ['Instant payments', 'Ultra-low fees', 'Global accessibility'],
    image: flow1,
  },

  {
    id: 2,
    title: 'Smart Yield Optimization',
    subtitle: 'Earn up to 8.1% APY with intelligent yield strategies',
    description:
      'Our AI-powered algorithms automatically find and execute the best yield opportunities across multiple DeFi protocols, maximizing your returns.',
    icon: Shield,
    color: 'from-green-500 to-teal-600',
    features: ['Up to 8.1% APY', 'Automated rebalancing', 'Risk optimization'],
    image: flow1,
  },
  {
    id: 3,
    title: 'Enterprise Security',
    subtitle: 'Military-grade protection for your digital assets',
    description:
      'Advanced security infrastructure with multi-signature wallets, smart contract audits, and comprehensive insurance coverage.',
    icon: Zap,
    color: 'from-orange-500 to-red-600',
    features: [
      'Multi-sig protection',
      'Audited contracts',
      'Insurance coverage',
    ],
    image: flow1,
  },
  {
    id: 4,
    title: 'Ready to Start Earning?',
    subtitle: 'Connect your wallet and begin your Web3 journey',
    description:
      'Join thousands of users already earning passive income through our Smart Yield Vault. Your financial freedom starts here.',
    icon: Wallet,
    color: 'from-emerald-500 to-green-600',
    features: ['One-click setup', 'No minimum deposit', 'Start earning today'],
  },
]

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isConnecting, setIsConnecting] = useState(false)
  const [swiperInstance, setSwiperInstance] = useState<any>(null)
  const { mutate: registerUser, isPending, isSuccess } = useRegisterUser()
  const { setWalletAddress } = useWallet()

  const handleConnectWallet = async () => {
    setIsConnecting(true)
    try {
      // Simulate wallet connection process
      // await new Promise((resolve) => setTimeout(resolve, 2500))
      const { publicKey } = await connectStellarWallet()
      const user = registerUser({
        walletAddress: publicKey,
        publicKey,
        walletSource: 'WALLET_CONNECT', // or 'FREIGHTER', etc.
      })
      console.log('registered user', user)
      console.log('Connected address:', publicKey)
      // On success, complete onboarding
      setWalletAddress(publicKey)
      onComplete()
    } catch (error) {
      // Handle wallet connection error
      console.error('Wallet connection failed:', error)
      setIsConnecting(false)
    }
  }
  const userWallet = getWalletAddress()

  console.log(`user wallet is`, userWallet)
  const handleNext = () => {
    if (swiperInstance) {
      swiperInstance.slideNext()
    }
  }

  const handlePrev = () => {
    if (swiperInstance) {
      swiperInstance.slidePrev()
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  return (
    <div className="flex h-full flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header - Removed navigation buttons */}
      <div className="p-0 pb-2">{/* Empty header for clean look */}</div>

      {/* Swiper Container */}
      <div className="flex-1 px-1">
        <Swiper
          modules={[]}
          spaceBetween={20}
          slidesPerView={1}
          allowTouchMove={true}
          onSwiper={setSwiperInstance}
          onSlideChange={(swiper) => setCurrentSlide(swiper.activeIndex)}
          className="h-full"
        >
          {onboardingSlides.map((slide, index) => (
            <SwiperSlide
              key={slide.id}
              className="mb-3 flex h-[430px] flex-col border-b border-yellow-400"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex flex-1 flex-col items-center justify-center text-center"
              >
                {/* Icon */}
                <img
                  src={slide.image}
                  className="h-full w-full border border-red-500"
                />
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Step Indicators */}
      <div className="mb-8 flex justify-center">
        <div className="flex space-x-3">
          {onboardingSlides.map((_, index) => (
            <motion.div
              key={index}
              className={`h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'w-8 bg-blue-500 shadow-lg'
                  : index < currentSlide
                    ? 'w-3 bg-blue-500'
                    : 'w-3 bg-gray-300 dark:bg-gray-600'
              }`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: index === currentSlide ? 1.1 : 1,
                opacity: 1,
              }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="px-6 pb-6">
        <AnimatePresence mode="wait">
          {currentSlide < 3 ? (
            <motion.div
              key="navigation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex space-x-3"
            >
              <Button
                variant="outline"
                onClick={handleSkip}
                className="h-14 flex-1 rounded-xl border-gray-300 text-base font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Skip
              </Button>
              <Button
                onClick={handleNext}
                className="h-14 flex-1 transform rounded-xl bg-blue-500 text-base font-semibold text-white transition-all duration-200 hover:scale-105 hover:bg-blue-600"
              >
                Next
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="connect"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Button
                onClick={handleConnectWallet}
                disabled={isConnecting}
                className="h-16 w-full transform rounded-xl bg-blue-500 text-lg font-bold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-blue-600 hover:shadow-xl disabled:scale-100 disabled:cursor-not-allowed disabled:bg-blue-400 disabled:opacity-80"
              >
                {isConnecting ? (
                  <motion.div
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      className="h-5 w-5 rounded-full border-2 border-white border-t-transparent"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                    <span>Connecting...</span>
                  </motion.div>
                ) : (
                  <motion.div
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Wallet className="h-6 w-6" />
                    <span>Connect Wallet</span>
                  </motion.div>
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

//SLIDEDS CONTENTS

/*

 <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.2,
                    type: 'spring',
                    stiffness: 260,
                    damping: 20,
                  }}
                  className={`h-24 w-24 rounded-2xl bg-gradient-to-r ${slide.color} mb-8 flex items-center justify-center shadow-xl`}
                >
                  <slide.icon className="h-12 w-12 text-white" />
                </motion.div>

              
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="mb-3 text-3xl font-bold leading-tight text-gray-900 dark:text-gray-100"
                >
                  {slide.title}
                </motion.h1>

          
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="mb-6 max-w-xs text-base font-medium leading-relaxed text-gray-600 dark:text-gray-300"
                >
                  {slide.subtitle}
                </motion.p>

          
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="mb-8 max-w-sm text-sm leading-relaxed text-gray-500 dark:text-gray-400"
                >
                  {slide.description}
                </motion.p>


                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="mb-8 space-y-4"
                >
                  {slide.features.map((feature, featureIndex) => (
                    <motion.div
                      key={featureIndex}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.7 + featureIndex * 0.15,
                      }}
                      className="flex items-center space-x-3 rounded-lg bg-white/60 px-4 py-3 shadow-sm backdrop-blur-sm dark:bg-gray-800/60"
                    >
                      <div className="h-2 w-2 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>*/
