'use client'

import Link from 'next/link'
import { Package, ShoppingBag, Star, Users, FileText, Plus, TrendingUp, IndianRupee, BarChart3, Settings } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useApp } from '@/lib/app-context'

const quickActions = [
  { href: '/products/add', icon: Plus, label: 'Add Product', color: 'bg-primary' },
  { href: '/post/create', icon: FileText, label: 'Post Update', color: 'bg-accent' },
  { href: '/orders/manage', icon: ShoppingBag, label: 'Orders', color: 'bg-secondary' },
  { href: '/products/manage', icon: Package, label: 'Products', color: 'bg-secondary' },
]

export default function DashboardPage() {
  const { user } = useApp()

  // Mock stats for demonstration
  const stats = {
    totalSales: user?.totalSales || 12500,
    totalOrders: user?.totalOrders || 85,
    productsListed: user?.productsListed || 15,
    rating: user?.rating || 4.7,
    followers: user?.followers || 340,
    postsCount: user?.postsCount || 25,
    pendingOrders: 5,
    lowStock: 3,
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-4 pt-6 pb-20">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12 border-2 border-primary-foreground/30">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground">
                  {user?.name?.charAt(0) || 'F'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="font-semibold">Welcome back!</h1>
                <p className="text-sm text-primary-foreground/80">{user?.name || 'Farmer'}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="text-primary-foreground" asChild>
              <Link href="/settings">
                <Settings className="w-5 h-5" />
              </Link>
            </Button>
          </div>
          
          {/* Main Stats Card */}
          <Card className="bg-primary-foreground/10 border-primary-foreground/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-primary-foreground/80">Total Earnings</p>
                  <div className="flex items-center gap-1 mt-1">
                    <IndianRupee className="w-6 h-6" />
                    <span className="text-3xl font-bold">{stats.totalSales.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-primary-foreground/20 px-3 py-1.5 rounded-full">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">+12%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </header>

      <main className="px-4 -mt-12 pb-6 max-w-lg mx-auto">
        {/* Quick Actions */}
        <Card className="mb-4 bg-card">
          <CardContent className="p-4">
            <div className="grid grid-cols-4 gap-3">
              {quickActions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex flex-col items-center gap-2"
                >
                  <div className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center`}>
                    <action.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <span className="text-xs text-center text-card-foreground font-medium">{action.label}</span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Card className="bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">{stats.totalOrders}</p>
                  <p className="text-xs text-muted-foreground">Total Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <Package className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">{stats.productsListed}</p>
                  <p className="text-xs text-muted-foreground">Products</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <Star className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">{stats.rating}</p>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">{stats.followers}</p>
                  <p className="text-xs text-muted-foreground">Followers</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        <div className="space-y-3 mb-4">
          {stats.pendingOrders > 0 && (
            <Link href="/orders/manage">
              <Card className="bg-accent/10 border-accent/20">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-5 h-5 text-accent" />
                    <div>
                      <p className="font-medium text-foreground">{stats.pendingOrders} Pending Orders</p>
                      <p className="text-sm text-muted-foreground">Tap to view and process</p>
                    </div>
                  </div>
                  <Badge className="bg-accent text-accent-foreground">{stats.pendingOrders}</Badge>
                </CardContent>
              </Card>
            </Link>
          )}

          {stats.lowStock > 0 && (
            <Link href="/products/manage">
              <Card className="bg-destructive/10 border-destructive/20">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-destructive" />
                    <div>
                      <p className="font-medium text-foreground">{stats.lowStock} Products Low Stock</p>
                      <p className="text-sm text-muted-foreground">Update your inventory</p>
                    </div>
                  </div>
                  <Badge variant="destructive">{stats.lowStock}</Badge>
                </CardContent>
              </Card>
            </Link>
          )}
        </div>

        {/* Recent Activity */}
        <Card className="bg-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base text-card-foreground">Recent Activity</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/activity">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-2 bg-secondary/50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-card-foreground">New order received</p>
                <p className="text-xs text-muted-foreground">5 kg Tomatoes - 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 bg-secondary/50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                <Star className="w-4 h-4 text-accent" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-card-foreground">New review</p>
                <p className="text-xs text-muted-foreground">"Great quality mangoes!" - 5 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 bg-secondary/50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-card-foreground">New follower</p>
                <p className="text-xs text-muted-foreground">Ramesh Kumar followed you - 1 day ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
