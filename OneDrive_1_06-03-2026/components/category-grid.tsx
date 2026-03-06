'use client'

import Link from 'next/link'
import { Carrot, Apple, Wheat, Droplet, Leaf, Bean } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Category } from '@/lib/types'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  carrot: Carrot,
  apple: Apple,
  wheat: Wheat,
  grain: Wheat,
  bean: Bean,
  droplet: Droplet,
  leaf: Leaf,
}

interface CategoryGridProps {
  categories: Category[]
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {categories.map((category) => {
        const Icon = iconMap[category.icon] || Leaf
        return (
          <Link key={category.id} href={`/market?category=${category.id}`}>
            <Card className="flex flex-col items-center justify-center p-3 h-20 hover:bg-secondary/50 transition-colors bg-card">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-1">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs font-medium text-center text-card-foreground line-clamp-1">
                {category.name}
              </span>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
