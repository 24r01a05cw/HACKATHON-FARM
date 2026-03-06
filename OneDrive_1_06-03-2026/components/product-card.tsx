'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingCart, Star, Leaf, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Product } from '@/lib/types'
import { useApp } from '@/lib/app-context'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  product: Product
  onAddToCart?: () => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useApp()
  const inWishlist = isInWishlist(product.id)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addToCart(product, 1)
    onAddToCart?.()
  }

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    if (inWishlist) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  return (
    <Link href={`/product/${product.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow bg-card">
        <div className="relative aspect-square">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
          <button
            onClick={handleToggleWishlist}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-card/80 backdrop-blur flex items-center justify-center"
          >
            <Heart
              className={cn(
                'w-5 h-5 transition-colors',
                inWishlist ? 'fill-destructive text-destructive' : 'text-muted-foreground'
              )}
            />
          </button>
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isOrganic && (
              <Badge className="bg-primary text-primary-foreground text-xs gap-1">
                <Leaf className="w-3 h-3" />
                Organic
              </Badge>
            )}
            {product.isFreshHarvest && (
              <Badge className="bg-accent text-accent-foreground text-xs gap-1">
                <Sparkles className="w-3 h-3" />
                Fresh
              </Badge>
            )}
          </div>
        </div>
        <CardContent className="p-3">
          <h3 className="font-semibold text-sm line-clamp-1 text-card-foreground">{product.name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
            {product.farmerName} - {product.village}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-3.5 h-3.5 fill-accent text-accent" />
            <span className="text-xs font-medium text-card-foreground">{product.rating}</span>
            <span className="text-xs text-muted-foreground">({product.reviewsCount})</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div>
              <span className="text-base font-bold text-primary">₹{product.price}</span>
              <span className="text-xs text-muted-foreground">/{product.unit}</span>
            </div>
            <Button
              size="sm"
              className="h-8 w-8 p-0 rounded-full"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {product.availableQuantity} {product.unit} available
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
