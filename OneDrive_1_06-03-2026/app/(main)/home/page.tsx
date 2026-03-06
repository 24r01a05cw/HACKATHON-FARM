'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Bell, Plus, Sprout } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UpdateCard } from '@/components/update-card'
import { mockCropUpdates } from '@/lib/mock-data'
import { useApp } from '@/lib/app-context'

export default function HomePage() {
  const { user } = useApp()
  const [searchQuery, setSearchQuery] = useState('')
  
  const filteredUpdates = mockCropUpdates.filter(update =>
    update.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    update.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    update.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between gap-4 max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <Sprout className="w-7 h-7 text-primary" />
            <h1 className="text-xl font-bold text-primary">Rythu Market</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/search">
                <Search className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link href="/notifications">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="px-4 py-3 bg-background sticky top-[57px] z-30">
        <div className="max-w-lg mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search updates, farmers, crops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-secondary border-0"
            />
          </div>
        </div>
      </div>

      {/* Feed */}
      <main className="flex-1 px-4 pb-4">
        <div className="max-w-lg mx-auto space-y-4">
          {filteredUpdates.map((update) => (
            <UpdateCard key={update.id} update={update} />
          ))}
          
          {filteredUpdates.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No updates found</p>
            </div>
          )}
        </div>
      </main>

      {/* Floating Action Button for Farmers */}
      {user?.role === 'farmer' && (
        <Link
          href="/post/create"
          className="fixed bottom-24 right-4 w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors z-40"
        >
          <Plus className="w-7 h-7 text-primary-foreground" />
        </Link>
      )}
    </div>
  )
}
