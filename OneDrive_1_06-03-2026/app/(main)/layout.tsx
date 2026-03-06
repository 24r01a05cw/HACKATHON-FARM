'use client'

import { ReactNode } from 'react'
import { AppProvider } from '@/lib/app-context'
import { BottomNavigation } from '@/components/bottom-navigation'

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      <div className="min-h-screen bg-background pb-20">
        {children}
        <BottomNavigation />
      </div>
    </AppProvider>
  )
}
