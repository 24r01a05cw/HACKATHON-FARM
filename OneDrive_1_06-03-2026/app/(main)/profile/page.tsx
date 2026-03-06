'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { 
  Settings, 
  MapPin, 
  Phone, 
  Mail, 
  Star,
  Package,
  Heart,
  ShoppingBag,
  ChevronRight,
  Edit2,
  LogOut,
  Camera
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useApp } from '@/lib/app-context'

export default function ProfilePage() {
  const router = useRouter()
  const { currentUser, logout } = useApp()
  const [activeTab, setActiveTab] = useState<'posts' | 'products'>('posts')

  if (!currentUser) {
    return null
  }

  const isFarmer = currentUser.role === 'farmer'

  const stats = [
    { label: 'Posts', value: 24 },
    { label: 'Followers', value: '1.2K' },
    { label: 'Following', value: 156 },
  ]

  const farmerStats = [
    { label: 'Products', value: 12 },
    { label: 'Orders', value: 48 },
    { label: 'Rating', value: '4.8' },
  ]

  const menuItems = [
    { icon: ShoppingBag, label: 'My Orders', href: '/orders' },
    { icon: Heart, label: 'Wishlist', href: '/wishlist' },
    { icon: MapPin, label: 'Saved Addresses', href: '/addresses' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ]

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-primary text-primary-foreground">
        <div className="px-4 py-3 flex items-center justify-between max-w-lg mx-auto">
          <h1 className="text-lg font-semibold">Profile</h1>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-primary-foreground hover:bg-primary-foreground/10"
            onClick={() => router.push('/settings')}
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>

        {/* Profile Info */}
        <div className="px-4 pb-6 max-w-lg mx-auto">
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-primary-foreground/30">
                <Image
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </div>
              <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary-foreground flex items-center justify-center">
                <Camera className="w-4 h-4 text-primary" />
              </button>
            </div>
            <div className="flex-1 pt-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{currentUser.name}</h2>
                {isFarmer && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-primary-foreground/20 rounded-full">
                    Farmer
                  </span>
                )}
              </div>
              {currentUser.location && (
                <p className="text-sm text-primary-foreground/80 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {currentUser.location}
                </p>
              )}
              <Button 
                variant="secondary" 
                size="sm" 
                className="mt-3 h-8 text-xs"
                onClick={() => router.push('/profile/edit')}
              >
                <Edit2 className="w-3.5 h-3.5 mr-1.5" />
                Edit Profile
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-around mt-6 pt-4 border-t border-primary-foreground/20">
            {(isFarmer ? farmerStats : stats).map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-xl font-bold">{stat.value}</p>
                <p className="text-xs text-primary-foreground/80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="px-4 py-4 max-w-lg mx-auto">
        <Card className="p-4">
          <h3 className="font-semibold text-foreground mb-3">Contact Information</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground">{currentUser.phone}</span>
            </div>
            {currentUser.email && (
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">{currentUser.email}</span>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Farmer Rating */}
      {isFarmer && (
        <div className="px-4 pb-4 max-w-lg mx-auto">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">Seller Rating</h3>
                <p className="text-sm text-muted-foreground">Based on 48 reviews</p>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="text-xl font-bold text-foreground">4.8</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Menu Items */}
      <div className="px-4 max-w-lg mx-auto">
        <Card className="divide-y divide-border">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => router.push(item.href)}
              className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-foreground">{item.label}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          ))}
        </Card>
      </div>

      {/* Farmer Dashboard Link */}
      {isFarmer && (
        <div className="px-4 pt-4 max-w-lg mx-auto">
          <Card 
            className="p-4 bg-primary/5 border-primary/20 cursor-pointer hover:bg-primary/10 transition-colors"
            onClick={() => router.push('/dashboard')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Farmer Dashboard</h3>
                  <p className="text-sm text-muted-foreground">Manage products & orders</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-primary" />
            </div>
          </Card>
        </div>
      )}

      {/* Logout */}
      <div className="px-4 pt-6 max-w-lg mx-auto">
        <Button 
          variant="outline" 
          className="w-full h-12 text-destructive border-destructive/30 hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  )
}
