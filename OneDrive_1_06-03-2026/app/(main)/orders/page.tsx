'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, Package, Truck, CheckCircle, Clock, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

type OrderStatus = 'all' | 'pending' | 'shipped' | 'delivered'

interface Order {
  id: string
  date: string
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered'
  items: {
    name: string
    quantity: string
    price: number
    image: string
  }[]
}

const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    date: '2024-01-15',
    total: 450,
    status: 'delivered',
    items: [
      { name: 'Fresh Tomatoes', quantity: '2 kg', price: 80, image: 'https://images.unsplash.com/photo-1546470427-e26264be0b11?w=100&h=100&fit=crop' },
      { name: 'Organic Rice', quantity: '5 kg', price: 370, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100&h=100&fit=crop' },
    ]
  },
  {
    id: 'ORD-002',
    date: '2024-01-18',
    total: 280,
    status: 'shipped',
    items: [
      { name: 'Green Chillies', quantity: '500 g', price: 40, image: 'https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=100&h=100&fit=crop' },
      { name: 'Fresh Mangoes', quantity: '3 kg', price: 240, image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=100&h=100&fit=crop' },
    ]
  },
  {
    id: 'ORD-003',
    date: '2024-01-20',
    total: 520,
    status: 'pending',
    items: [
      { name: 'Organic Turmeric', quantity: '1 kg', price: 200, image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=100&h=100&fit=crop' },
      { name: 'Fresh Potatoes', quantity: '5 kg', price: 150, image: 'https://images.unsplash.com/photo-1518977676601-b53f82ber07e?w=100&h=100&fit=crop' },
      { name: 'Onions', quantity: '3 kg', price: 170, image: 'https://images.unsplash.com/photo-1618512496248-a07a0a9e5e0f?w=100&h=100&fit=crop' },
    ]
  },
]

const statusConfig = {
  pending: { icon: Clock, label: 'Pending', color: 'text-yellow-600 bg-yellow-100' },
  confirmed: { icon: Package, label: 'Confirmed', color: 'text-blue-600 bg-blue-100' },
  shipped: { icon: Truck, label: 'Shipped', color: 'text-purple-600 bg-purple-100' },
  delivered: { icon: CheckCircle, label: 'Delivered', color: 'text-primary bg-primary/10' },
}

export default function OrdersPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<OrderStatus>('all')

  const filteredOrders = activeTab === 'all' 
    ? mockOrders 
    : mockOrders.filter(order => order.status === activeTab)

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border px-4 py-3">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">My Orders</h1>
        </div>
      </header>

      {/* Tabs */}
      <div className="px-4 py-3 max-w-lg mx-auto">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as OrderStatus)}>
          <TabsList className="w-full grid grid-cols-4 h-10">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="pending" className="text-xs">Pending</TabsTrigger>
            <TabsTrigger value="shipped" className="text-xs">Shipped</TabsTrigger>
            <TabsTrigger value="delivered" className="text-xs">Delivered</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Orders List */}
      <main className="px-4 max-w-lg mx-auto space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No orders found</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const StatusIcon = statusConfig[order.status].icon
            return (
              <Card key={order.id} className="overflow-hidden">
                {/* Order Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <div>
                    <p className="font-semibold text-foreground">{order.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.date).toLocaleDateString('en-IN', { 
                        day: 'numeric', 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                  <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[order.status].color}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {statusConfig[order.status].label}
                  </span>
                </div>

                {/* Order Items */}
                <div className="p-4 space-y-3">
                  {order.items.slice(0, 2).map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={48}
                          height={48}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.quantity}</p>
                      </div>
                      <p className="font-medium text-foreground">Rs. {item.price}</p>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <p className="text-sm text-muted-foreground">
                      +{order.items.length - 2} more items
                    </p>
                  )}
                </div>

                {/* Order Footer */}
                <div className="flex items-center justify-between p-4 bg-secondary/30 border-t border-border">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="text-lg font-bold text-foreground">Rs. {order.total}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => router.push(`/orders/${order.id}`)}
                  >
                    View Details
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </Card>
            )
          })
        )}
      </main>
    </div>
  )
}
