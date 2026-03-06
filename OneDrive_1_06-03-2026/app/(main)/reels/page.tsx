'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, MessageCircle, Share2, Plus, Volume2, VolumeX, Play } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { mockReels } from '@/lib/mock-data'
import { useApp } from '@/lib/app-context'
import { cn } from '@/lib/utils'

export default function ReelsPage() {
  const { user } = useApp()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [likedReels, setLikedReels] = useState<Set<string>>(new Set())
  const [isMuted, setIsMuted] = useState(true)

  const handleLike = (reelId: string) => {
    setLikedReels(prev => {
      const newSet = new Set(prev)
      if (newSet.has(reelId)) {
        newSet.delete(reelId)
      } else {
        newSet.add(reelId)
      }
      return newSet
    })
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget
    const scrollTop = element.scrollTop
    const itemHeight = element.clientHeight
    const newIndex = Math.round(scrollTop / itemHeight)
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex)
    }
  }

  return (
    <div className="h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3 bg-gradient-to-b from-background/80 to-transparent">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <h1 className="text-xl font-bold text-foreground">Reels</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </Button>
        </div>
      </header>

      {/* Reels Container */}
      <div
        className="h-full overflow-y-auto snap-y snap-mandatory scrollbar-hide"
        onScroll={handleScroll}
        style={{ scrollBehavior: 'smooth' }}
      >
        {mockReels.map((reel, index) => {
          const isLiked = likedReels.has(reel.id)
          return (
            <div
              key={reel.id}
              className="h-screen w-full snap-start snap-always relative"
            >
              {/* Video/Image Background */}
              <div className="absolute inset-0 bg-foreground/10">
                <Image
                  src={reel.thumbnailUrl}
                  alt={reel.description}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-foreground/20">
                  <div className="w-20 h-20 rounded-full bg-background/30 backdrop-blur flex items-center justify-center">
                    <Play className="w-10 h-10 text-background fill-background ml-1" />
                  </div>
                </div>
              </div>

              {/* Content Overlay */}
              <div className="absolute inset-0 flex">
                {/* Left side - Info */}
                <div className="flex-1 flex flex-col justify-end p-4 pb-24">
                  <Link href={`/farmer/${reel.farmerId}`} className="flex items-center gap-3 mb-3">
                    <Avatar className="w-10 h-10 border-2 border-background">
                      <AvatarImage src={reel.farmerAvatar} alt={reel.farmerName} />
                      <AvatarFallback className="bg-secondary text-secondary-foreground">
                        {reel.farmerName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-sm font-semibold text-background">{reel.farmerName}</h3>
                      <p className="text-xs text-background/80">{reel.village}</p>
                    </div>
                    <Button size="sm" variant="outline" className="ml-2 h-7 bg-background/20 border-background/50 text-background hover:bg-background/30">
                      Follow
                    </Button>
                  </Link>
                  <p className="text-sm text-background line-clamp-2 max-w-[80%]">
                    {reel.description}
                  </p>
                </div>

                {/* Right side - Actions */}
                <div className="flex flex-col items-center justify-end gap-6 p-4 pb-28">
                  <button
                    className="flex flex-col items-center gap-1"
                    onClick={() => handleLike(reel.id)}
                  >
                    <Heart
                      className={cn(
                        'w-8 h-8 transition-all active:scale-125',
                        isLiked ? 'fill-destructive text-destructive' : 'text-background'
                      )}
                    />
                    <span className="text-xs font-medium text-background">
                      {isLiked ? reel.likes + 1 : reel.likes}
                    </span>
                  </button>
                  <button className="flex flex-col items-center gap-1">
                    <MessageCircle className="w-8 h-8 text-background" />
                    <span className="text-xs font-medium text-background">{reel.comments}</span>
                  </button>
                  <button className="flex flex-col items-center gap-1">
                    <Share2 className="w-8 h-8 text-background" />
                    <span className="text-xs font-medium text-background">{reel.shares}</span>
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Floating Action Button for Farmers */}
      {user?.role === 'farmer' && (
        <Link
          href="/reels/create"
          className="fixed bottom-24 right-4 w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors z-40"
        >
          <Plus className="w-7 h-7 text-primary-foreground" />
        </Link>
      )}

      {/* Scroll Indicator */}
      <div className="fixed right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1 z-40">
        {mockReels.map((_, index) => (
          <div
            key={index}
            className={cn(
              'w-1 rounded-full transition-all',
              index === currentIndex ? 'h-6 bg-primary' : 'h-1.5 bg-background/50'
            )}
          />
        ))}
      </div>
    </div>
  )
}
