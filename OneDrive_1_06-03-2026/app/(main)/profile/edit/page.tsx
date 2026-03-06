'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, Camera } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useApp } from '@/lib/app-context'

export default function EditProfilePage() {
  const router = useRouter()
  const { currentUser } = useApp()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    location: currentUser?.location || '',
    bio: '',
  })

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.back()
  }

  if (!currentUser) return null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-semibold text-foreground">Edit Profile</h1>
          </div>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading}
            className="h-9"
          >
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </header>

      <main className="px-4 py-6 max-w-lg mx-auto">
        {/* Profile Photo */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-border">
              <Image
                src={currentUser.avatar}
                alt={currentUser.name}
                width={112}
                height={112}
                className="object-cover w-full h-full"
              />
            </div>
            <button className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-lg">
              <Camera className="w-5 h-5 text-primary-foreground" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-foreground">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              className="h-12"
              disabled
            />
            <p className="text-xs text-muted-foreground">Phone number cannot be changed</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">Email (Optional)</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              className="h-12"
              placeholder="Enter your email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-foreground">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => updateField('location', e.target.value)}
              className="h-12"
              placeholder="Village, District, State"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-foreground">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => updateField('bio', e.target.value)}
              rows={3}
              className="resize-none"
              placeholder="Tell others about yourself..."
            />
          </div>
        </form>
      </main>
    </div>
  )
}
