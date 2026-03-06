'use client'

import Link from 'next/link'
import { Star, MapPin, ShoppingBag } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { User } from '@/lib/types'

interface FarmerCardProps {
  farmer: User
  onFollow?: () => void
}

export function FarmerCard({ farmer, onFollow }: FarmerCardProps) {
  return (
    <Link href={`/farmer/${farmer.id}`}>
      <Card className="overflow-hidden hover:shadow-md transition-shadow bg-card">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Avatar className="w-14 h-14 border-2 border-primary">
              <AvatarImage src={farmer.avatar} alt={farmer.name} />
              <AvatarFallback className="bg-secondary text-secondary-foreground text-lg">
                {farmer.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold text-card-foreground truncate">{farmer.name}</h3>
                {(farmer.rating ?? 0) >= 4.5 && (
                  <Badge className="bg-primary/10 text-primary shrink-0">
                    Trusted
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1 text-muted-foreground mt-0.5">
                <MapPin className="w-3.5 h-3.5" />
                <span className="text-sm truncate">{farmer.village}</span>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-accent text-accent" />
                  <span className="text-sm font-medium text-card-foreground">{farmer.rating}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <ShoppingBag className="w-4 h-4" />
                  <span className="text-sm">{farmer.productsListed} products</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={(e) => {
                e.preventDefault()
                onFollow?.()
              }}
            >
              Follow
            </Button>
            <Button size="sm" className="flex-1" asChild>
              <Link href={`/farmer/${farmer.id}/products`}>View Products</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
