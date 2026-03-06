'use client'

import { useState } from 'react'
import { use } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Heart, Share2, Star, Leaf, Sparkles, MapPin, Calendar, ShoppingCart, Minus, Plus, Truck, Shield, RotateCcw } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { mockProducts, mockFarmers } from '@/lib/mock-data'
import { useApp } from '@/lib/app-context'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useApp()
  
  const product = mockProducts.find(p => p.id === id)
  const farmer = mockFarmers.find(f => f.id === product?.farmerId)
  
  const [quantity, setQuantity] = useState(1)
  const [isAddedToCart, setIsAddedToCart] = useState(false)
  
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Product not found</p>
      </div>
    )
  }

  const inWishlist = isInWishlist(product.id)

  const handleAddToCart = () => {
    addToCart(product, quantity)
    setIsAddedToCart(true)
    setTimeout(() => setIsAddedToCart(false), 2000)
  }

  const handleBuyNow = () => {
    addToCart(product, quantity)
    router.push('/checkout')
  }

  const handleToggleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-background to-transparent">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          <Button variant="ghost" size="icon" className="bg-card/80 backdrop-blur" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="bg-card/80 backdrop-blur"
              onClick={handleToggleWishlist}
            >
              <Heart className={cn('w-5 h-5', inWishlist && 'fill-destructive text-destructive')} />
            </Button>
            <Button variant="ghost" size="icon" className="bg-card/80 backdrop-blur">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Product Image */}
      <div className="relative aspect-square w-full">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute bottom-4 left-4 flex gap-2">
          {product.isOrganic && (
            <Badge className="bg-primary text-primary-foreground gap-1">
              <Leaf className="w-3 h-3" />
              Organic
            </Badge>
          )}
          {product.isFreshHarvest && (
            <Badge className="bg-accent text-accent-foreground gap-1">
              <Sparkles className="w-3 h-3" />
              Fresh Harvest
            </Badge>
          )}
        </div>
      </div>

      <main className="px-4 py-4 max-w-lg mx-auto space-y-4">
        {/* Product Info */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">{product.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-accent text-accent" />
              <span className="font-medium text-foreground">{product.rating}</span>
            </div>
            <span className="text-muted-foreground">({product.reviewsCount} reviews)</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-primary">₹{product.price}</span>
          <span className="text-muted-foreground">per {product.unit}</span>
        </div>

        {/* Availability */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-primary border-primary">
            {product.availableQuantity} {product.unit} available
          </Badge>
          {product.harvestDate && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              Harvested {format(product.harvestDate, 'MMM d')}
            </div>
          )}
        </div>

        <Separator />

        {/* Farmer Info */}
        <Link href={`/farmer/${product.farmerId}`}>
          <Card className="bg-card">
            <CardContent className="flex items-center gap-3 p-4">
              <Avatar className="w-14 h-14 border-2 border-primary">
                <AvatarImage src={product.farmerAvatar} alt={product.farmerName} />
                <AvatarFallback className="bg-secondary text-secondary-foreground">
                  {product.farmerName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-card-foreground">{product.farmerName}</h3>
                  {(farmer?.rating ?? 0) >= 4.5 && (
                    <Badge className="bg-primary/10 text-primary text-xs">Trusted</Badge>
                  )}
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5" />
                  {product.village}
                </div>
                {farmer && (
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                    <span className="text-sm font-medium text-card-foreground">{farmer.rating}</span>
                    <span className="text-xs text-muted-foreground">({farmer.totalOrders} orders)</span>
                  </div>
                )}
              </div>
              <Button variant="outline" size="sm">View</Button>
            </CardContent>
          </Card>
        </Link>

        {/* Description */}
        {product.description && (
          <div>
            <h3 className="font-semibold text-foreground mb-2">Description</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>
          </div>
        )}

        {/* Features */}
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center p-3 bg-secondary/50 rounded-xl">
            <Truck className="w-6 h-6 text-primary mb-1" />
            <span className="text-xs text-center text-foreground">Fast Delivery</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-secondary/50 rounded-xl">
            <Shield className="w-6 h-6 text-primary mb-1" />
            <span className="text-xs text-center text-foreground">Quality Assured</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-secondary/50 rounded-xl">
            <RotateCcw className="w-6 h-6 text-primary mb-1" />
            <span className="text-xs text-center text-foreground">Easy Returns</span>
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center justify-between">
          <span className="font-medium text-foreground">Quantity ({product.unit})</span>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="w-12 text-center text-lg font-semibold text-foreground">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10"
              onClick={() => setQuantity(Math.min(product.availableQuantity, quantity + 1))}
              disabled={quantity >= product.availableQuantity}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="text-right text-sm text-muted-foreground">
          Total: <span className="font-semibold text-foreground">₹{product.price * quantity}</span>
        </div>
      </main>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 safe-area-bottom">
        <div className="flex gap-3 max-w-lg mx-auto">
          <Button
            variant="outline"
            className="flex-1 h-12 gap-2"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-5 h-5" />
            {isAddedToCart ? 'Added!' : 'Add to Cart'}
          </Button>
          <Button className="flex-1 h-12" onClick={handleBuyNow}>
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  )
}
