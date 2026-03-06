'use client'

import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Search, Mic, ShoppingCart, Filter, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ProductCard } from '@/components/product-card'
import { CategoryGrid } from '@/components/category-grid'
import { mockProducts, categories } from '@/lib/mock-data'
import { useApp } from '@/lib/app-context'
import { ProductCategory } from '@/lib/types'
import { cn } from '@/lib/utils'

export default function MarketPage() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category') as ProductCategory | null
  const { cartItemsCount } = useApp()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>(categoryParam || 'all')
  const [sortBy, setSortBy] = useState<'price_low' | 'price_high' | 'rating' | 'newest'>('newest')

  const filteredProducts = useMemo(() => {
    let products = [...mockProducts]
    
    // Filter by search
    if (searchQuery) {
      products = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.village.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      products = products.filter(p => p.category === selectedCategory)
    }
    
    // Sort
    switch (sortBy) {
      case 'price_low':
        products.sort((a, b) => a.price - b.price)
        break
      case 'price_high':
        products.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        products.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case 'newest':
      default:
        products.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    }
    
    return products
  }, [searchQuery, selectedCategory, sortBy])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
          <h1 className="text-xl font-bold text-primary">Rythu Market</h1>
          <Link href="/cart" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="w-5 h-5" />
            </Button>
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center">
                {cartItemsCount > 9 ? '9+' : cartItemsCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      <main className="px-4 py-4 max-w-lg mx-auto">
        {/* Search Bar */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 h-12 bg-secondary border-0"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2">
              <Mic className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-3">Categories</h2>
          <CategoryGrid categories={categories} />
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          <Badge
            variant={selectedCategory === 'all' ? 'default' : 'secondary'}
            className={cn(
              'cursor-pointer shrink-0 px-4 py-2 text-sm',
              selectedCategory === 'all' && 'bg-primary text-primary-foreground'
            )}
            onClick={() => setSelectedCategory('all')}
          >
            All
          </Badge>
          {categories.map((cat) => (
            <Badge
              key={cat.id}
              variant={selectedCategory === cat.id ? 'default' : 'secondary'}
              className={cn(
                'cursor-pointer shrink-0 px-4 py-2 text-sm',
                selectedCategory === cat.id && 'bg-primary text-primary-foreground'
              )}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.name}
            </Badge>
          ))}
        </div>

        {/* Sort & Filter */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            {filteredProducts.length} products
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <SlidersHorizontal className="w-4 h-4" />
              Filter
            </Button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="h-8 px-2 text-sm bg-secondary border-0 rounded-md"
            >
              <option value="newest">Newest</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found</p>
          </div>
        )}
      </main>
    </div>
  )
}
