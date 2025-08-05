import { motion } from 'framer-motion'
import { AreaChart, Area, ResponsiveContainer } from 'recharts'

interface EarningsChartProps {
  data: Array<{ name: string; value: number }>
  color: string
}

const generateChartData = (currency: string) => {
  const baseData = [
    { name: 'Jan', value: 45000 },
    { name: 'Feb', value: 52000 },
    { name: 'Mar', value: 48000 },
    { name: 'Apr', value: 61000 },
    { name: 'May', value: 75000 },
    { name: 'Jun', value: 88000 },
    { name: 'Jul', value: 95000 },
    { name: 'Aug', value: 108000 },
    { name: 'Sep', value: 125000 },
    { name: 'Oct', value: 142000 },
    { name: 'Nov', value: 154390 },
  ]

  if (currency === 'usdc') {
    return baseData.map((item) => ({
      ...item,
      value: Math.floor(item.value * 0.815),
    }))
  } else if (currency === 'eurc') {
    return baseData.map((item) => ({
      ...item,
      value: Math.floor(item.value * 0.021),
    }))
  } else if (currency === 'xlm') {
    return baseData.map((item) => ({
      ...item,
      value: Math.floor(item.value * 0.01),
    }))
  }

  return baseData
}

export default function EarningsChart({
  currency = 'all',
}: {
  currency: string
}) {
  const data = generateChartData(currency)

  const getGradientColor = (currency: string) => {
    switch (currency) {
      case 'usdc':
        return '#3B82F6' // Blue
      case 'eurc':
        return '#10B981' // Green
      case 'xlm':
        return '#F59E0B' // Yellow
      default:
        return '#10B981' // Default green
    }
  }

  const gradientColor = getGradientColor(currency)

  return (
    <motion.div
      key={currency}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="mt-6 h-48 w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient
              id={`gradient-${currency}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={gradientColor} stopOpacity={0.3} />
              <stop
                offset="100%"
                stopColor={gradientColor}
                stopOpacity={0.05}
              />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={gradientColor}
            strokeWidth={3}
            fill={`url(#gradient-${currency})`}
            dot={false}
            activeDot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
