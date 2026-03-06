'use client'

import { AppProvider } from '@/lib/app-context'
import { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      <div className="min-h-screen bg-background flex flex-col">
        {children}
      </div>
    </AppProvider>
  )
}
