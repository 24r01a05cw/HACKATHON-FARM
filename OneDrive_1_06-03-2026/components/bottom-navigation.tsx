'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Play, ShoppingBag, User, LayoutGrid } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useApp } from '@/lib/app-context'

const customerNavItems = [
  { href: '/home', icon: Home, label: 'Home' },
  { href: '/reels', icon: Play, label: 'Reels' },
  { href: '/market', icon: ShoppingBag, label: 'Market' },
  { href: '/profile', icon: User, label: 'Profile' },
]

const farmerNavItems = [
  { href: '/home', icon: Home, label: 'Home' },
  { href: '/reels', icon: Play, label: 'Reels' },
  { href: '/market', icon: ShoppingBag, label: 'Market' },
  { href: '/dashboard', icon: LayoutGrid, label: 'Dashboard' },
  { href: '/profile', icon: User, label: 'Profile' },
]

export function BottomNavigation() {
  const pathname = usePathname()
  const { user } = useApp()
  
  const navItems = user?.role === 'farmer' ? farmerNavItems : customerNavItems

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-colors min-w-[64px]',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon
                className={cn(
                  'w-6 h-6 transition-transform',
                  isActive && 'scale-110'
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={cn(
                'text-xs font-medium',
                isActive && 'font-semibold'
              )}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
