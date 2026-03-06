'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, MapPin, Check, Trash2, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useApp } from '@/lib/app-context'
import { cn } from '@/lib/utils'

export default function AddressesPage() {
  const router = useRouter()
  const { addresses, setDefaultAddress, removeAddress } = useApp()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-semibold text-foreground">My Addresses</h1>
          </div>
          <Button size="sm" asChild>
            <Link href="/addresses/add">
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Link>
          </Button>
        </div>
      </header>

      <main className="px-4 py-4 max-w-lg mx-auto">
        {addresses.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-4">
              <MapPin className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">No addresses saved</h2>
            <p className="text-muted-foreground text-center mb-6">Add an address for faster checkout</p>
            <Button asChild>
              <Link href="/addresses/add">Add Address</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {addresses.map((address) => (
              <Card key={address.id} className="bg-card">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-card-foreground">{address.name}</span>
                      {address.isDefault && (
                        <Badge variant="secondary" className="text-xs">Default</Badge>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => removeAddress(address.id!)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {address.addressLine1}
                    {address.addressLine2 && `, ${address.addressLine2}`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {address.city}, {address.district}, {address.state} - {address.pincode}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">{address.phone}</p>
                  
                  {!address.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3 gap-1"
                      onClick={() => setDefaultAddress(address.id!)}
                    >
                      <Check className="w-3 h-3" />
                      Set as Default
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
