'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/product-card'
import { useApp } from '@/lib/app-context'

export default function WishlistPage() {
  const router = useRouter()
  const { wishlist } = useApp()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border px-4 py-3">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Wishlist ({wishlist.length})</h1>
        </div>
      </header>

      <main className="px-4 py-4 max-w-lg mx-auto">
        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-4">
              <Heart className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground text-center mb-6">Save products you love for later</p>
            <Button asChild>
              <Link href="/market">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {wishlist.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
