'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, MessageCircle, Share2, Bookmark, AlertTriangle, TrendingUp, Cloud, Sprout } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CropUpdate } from '@/lib/types'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'

interface UpdateCardProps {
  update: CropUpdate
}

const typeConfig = {
  update: { icon: Sprout, label: 'Crop Update', color: 'bg-primary text-primary-foreground' },
  alert: { icon: AlertTriangle, label: 'Alert', color: 'bg-destructive text-destructive-foreground' },
  price_change: { icon: TrendingUp, label: 'Price Update', color: 'bg-accent text-accent-foreground' },
  weather: { icon: Cloud, label: 'Weather', color: 'bg-secondary text-secondary-foreground' },
}

export function UpdateCard({ update }: UpdateCardProps) {
  const [isLiked, setIsLiked] = useState(update.isLiked)
  const [isSaved, setIsSaved] = useState(update.isSaved)
  const [likes, setLikes] = useState(update.likes)

  const config = typeConfig[update.type]
  const TypeIcon = config.icon

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikes(prev => isLiked ? prev - 1 : prev + 1)
  }

  return (
    <Card className="overflow-hidden bg-card">
      <CardHeader className="p-4 pb-3">
        <div className="flex items-center justify-between">
          <Link href={`/farmer/${update.farmerId}`} className="flex items-center gap-3">
            <Avatar className="w-12 h-12 border-2 border-primary">
              <AvatarImage src={update.farmerAvatar} alt={update.farmerName} />
              <AvatarFallback className="bg-secondary text-secondary-foreground">
                {update.farmerName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-sm text-card-foreground">{update.farmerName}</h3>
              <p className="text-xs text-muted-foreground">{update.village}</p>
            </div>
          </Link>
          <Badge className={cn('gap-1', config.color)}>
            <TypeIcon className="w-3 h-3" />
            {config.label}
          </Badge>
        </div>
      </CardHeader>
      
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={update.images[0]}
          alt={update.cropName}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      <CardContent className="p-4">
        {/* Action buttons */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <button onClick={handleLike} className="flex items-center gap-1.5 tap-highlight-transparent">
              <Heart
                className={cn(
                  'w-6 h-6 transition-all active:scale-125',
                  isLiked ? 'fill-destructive text-destructive' : 'text-card-foreground'
                )}
              />
              <span className="text-sm font-medium text-card-foreground">{likes}</span>
            </button>
            <button className="flex items-center gap-1.5">
              <MessageCircle className="w-6 h-6 text-card-foreground" />
              <span className="text-sm font-medium text-card-foreground">{update.comments}</span>
            </button>
            <button className="flex items-center gap-1.5">
              <Share2 className="w-6 h-6 text-card-foreground" />
              <span className="text-sm font-medium text-card-foreground">{update.shares}</span>
            </button>
          </div>
          <button onClick={() => setIsSaved(!isSaved)}>
            <Bookmark
              className={cn(
                'w-6 h-6 transition-all',
                isSaved ? 'fill-primary text-primary' : 'text-card-foreground'
              )}
            />
          </button>
        </div>

        {/* Crop info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="font-medium">
              {update.cropName}
            </Badge>
            {update.daysAfterPlanting && (
              <Badge variant="outline" className="font-normal">
                {update.daysAfterPlanting} days
              </Badge>
            )}
          </div>
          
          {update.description && (
            <p className="text-sm text-card-foreground leading-relaxed">{update.description}</p>
          )}
          
          {update.problem && (
            <div className="flex items-start gap-2 p-2 bg-destructive/10 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
              <p className="text-sm text-destructive">{update.problem}</p>
            </div>
          )}
          
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(update.createdAt, { addSuffix: true })}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
