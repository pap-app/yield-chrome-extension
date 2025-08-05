import { Outlet, useNavigate } from 'react-router-dom'
import BottomNavigation from './bottom-navigation'

export function Layout() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
      <BottomNavigation />
    </div>
  )
}
