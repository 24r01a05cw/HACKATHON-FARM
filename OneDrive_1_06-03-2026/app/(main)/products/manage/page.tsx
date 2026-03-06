'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Plus, Edit2, Trash2, Package, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { mockProducts } from '@/lib/mock-data'
import { useApp } from '@/lib/app-context'
import { cn } from '@/lib/utils'

export default function ManageProductsPage() {
  const router = useRouter()
  const { user } = useApp()
  
  // Filter products for the current farmer
  const farmerProducts = mockProducts.filter(p => p.farmerId === '1')
  const [products, setProducts] = useState(farmerProducts)

  const toggleProductActive = (productId: string) => {
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, availableQuantity: p.availableQuantity > 0 ? 0 : 50 } : p
    ))
  }

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-semibold text-foreground">My Products</h1>
          </div>
          <Button size="sm" asChild>
            <Link href="/products/add">
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Link>
          </Button>
        </div>
      </header>

      <main className="px-4 py-4 max-w-lg mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="bg-card">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-primary">{products.length}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-primary">{products.filter(p => p.availableQuantity > 0).length}</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-destructive">{products.filter(p => p.availableQuantity < 10).length}</p>
              <p className="text-xs text-muted-foreground">Low Stock</p>
            </CardContent>
          </Card>
        </div>

        {/* Products List */}
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh]">
            <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-4">
              <Package className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">No products yet</h2>
            <p className="text-muted-foreground text-center mb-6">Start selling by adding your first product</p>
            <Button asChild>
              <Link href="/products/add">Add Product</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((product) => (
              <Card key={product.id} className="bg-card overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex">
                    <div className="relative w-24 h-24 shrink-0">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                      {product.availableQuantity < 10 && product.availableQuantity > 0 && (
                        <div className="absolute top-1 left-1">
                          <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                            Low
                          </Badge>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-card-foreground">{product.name}</h3>
                          <p className="text-sm text-primary font-medium">
                            ₹{product.price}/{product.unit}
                          </p>
                        </div>
                        <Switch
                          checked={product.availableQuantity > 0}
                          onCheckedChange={() => toggleProductActive(product.id)}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Package className="w-4 h-4" />
                          <span>{product.availableQuantity} {product.unit}</span>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                            <Link href={`/products/edit/${product.id}`}>
                              <Edit2 className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => deleteProduct(product.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
