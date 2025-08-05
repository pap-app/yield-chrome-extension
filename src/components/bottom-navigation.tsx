import { BarChart3, Wallet, Sprout, Settings, Home } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

interface NavItem {
  path: string
  icon: typeof BarChart3
  label: string
}

const navItems: NavItem[] = [
  { path: '/home', icon: Home, label: 'Home' },
  { path: '/portfolio', icon: Wallet, label: 'Portfolio' },
  { path: '/yields', icon: Sprout, label: 'Yields' },
  { path: '/settings', icon: Settings, label: 'Settings' },
]

export default function BottomNavigation() {
  //const [location, setLocation] = useLocation();
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav className="bg-bg-secondary border-t border-gray-100 px-4 py-2">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          const isHome = item.path === '/' ? true : false

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center space-y-1 px-3 py-2 transition-colors duration-200 ${
                isActive || isHome
                  ? 'text-brand-green'
                  : 'text-text-tertiary hover:text-text-secondary'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
