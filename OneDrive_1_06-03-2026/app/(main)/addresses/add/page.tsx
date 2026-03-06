'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, MapPin, User, Phone, Home, Building2, Map } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useApp } from '@/lib/app-context'

export default function AddAddressPage() {
  const router = useRouter()
  const { addAddress } = useApp()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    district: '',
    state: '',
    pincode: '',
  })

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    addAddress(formData)
    
    router.back()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border px-4 py-3">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Add New Address</h1>
        </div>
      </header>

      <main className="px-4 py-6 max-w-lg mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">Address Label</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="e.g., Home, Office"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                className="pl-11 h-12 text-base"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-foreground">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                className="pl-11 h-12 text-base"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="addressLine1" className="text-foreground">Address Line 1</Label>
            <div className="relative">
              <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="addressLine1"
                type="text"
                placeholder="House/Flat No., Street"
                value={formData.addressLine1}
                onChange={(e) => updateField('addressLine1', e.target.value)}
                className="pl-11 h-12 text-base"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="addressLine2" className="text-foreground">Address Line 2 (Optional)</Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="addressLine2"
                type="text"
                placeholder="Landmark, Area"
                value={formData.addressLine2}
                onChange={(e) => updateField('addressLine2', e.target.value)}
                className="pl-11 h-12 text-base"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-foreground">City</Label>
              <Input
                id="city"
                type="text"
                placeholder="City"
                value={formData.city}
                onChange={(e) => updateField('city', e.target.value)}
                className="h-12 text-base"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="district" className="text-foreground">District</Label>
              <Input
                id="district"
                type="text"
                placeholder="District"
                value={formData.district}
                onChange={(e) => updateField('district', e.target.value)}
                className="h-12 text-base"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="state" className="text-foreground">State</Label>
              <Input
                id="state"
                type="text"
                placeholder="State"
                value={formData.state}
                onChange={(e) => updateField('state', e.target.value)}
                className="h-12 text-base"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pincode" className="text-foreground">Pincode</Label>
              <Input
                id="pincode"
                type="text"
                placeholder="Pincode"
                value={formData.pincode}
                onChange={(e) => updateField('pincode', e.target.value)}
                className="h-12 text-base"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full h-14 text-lg rounded-xl mt-6"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Address'}
          </Button>
        </form>
      </main>
    </div>
  )
}
