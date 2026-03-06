'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, Camera, Image as ImageIcon, X, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

const cropTypes = [
  'Paddy', 'Wheat', 'Cotton', 'Tomato', 'Potato', 'Onion', 'Mango', 
  'Banana', 'Groundnut', 'Turmeric', 'Chilli', 'Sugarcane', 'Maize'
]

export default function CreatePostPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    cropType: '',
    daysAfterPlanting: '',
    description: '',
    hasProblem: false,
    problem: '',
  })

  const handleImageSelect = () => {
    // Simulate image selection with a placeholder
    setSelectedImage('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop')
  }

  const updateField = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate posting
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    router.push('/home')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-semibold text-foreground">New Crop Update</h1>
          </div>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading || !selectedImage || !formData.cropType}
            className="h-9"
          >
            {isLoading ? 'Posting...' : 'Post'}
          </Button>
        </div>
      </header>

      <main className="px-4 py-6 max-w-lg mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="text-foreground">Crop Photo / Video *</Label>
            {selectedImage ? (
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                <Image
                  src={selectedImage}
                  alt="Selected crop"
                  fill
                  priority
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-foreground/80 flex items-center justify-center"
                >
                  <X className="w-5 h-5 text-background" />
                </button>
              </div>
            ) : (
              <div className="aspect-[4/3] rounded-xl border-2 border-dashed border-border bg-secondary/30 flex flex-col items-center justify-center gap-4">
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={handleImageSelect}
                    className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center"
                  >
                    <Camera className="w-8 h-8 text-primary" />
                  </button>
                  <button
                    type="button"
                    onClick={handleImageSelect}
                    className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center"
                  >
                    <ImageIcon className="w-8 h-8 text-primary" />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground">Take a photo or choose from gallery</p>
              </div>
            )}
          </div>

          {/* Crop Type */}
          <div className="space-y-2">
            <Label htmlFor="cropType" className="text-foreground">Crop Type *</Label>
            <Select 
              value={formData.cropType} 
              onValueChange={(value) => updateField('cropType', value)}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select crop type" />
              </SelectTrigger>
              <SelectContent>
                {cropTypes.map((crop) => (
                  <SelectItem key={crop} value={crop.toLowerCase()}>
                    {crop}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Days After Planting */}
          <div className="space-y-2">
            <Label htmlFor="days" className="text-foreground">Days After Planting</Label>
            <Input
              id="days"
              type="number"
              placeholder="e.g., 35"
              value={formData.daysAfterPlanting}
              onChange={(e) => updateField('daysAfterPlanting', e.target.value)}
              className="h-12 text-base"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">Description</Label>
            <Textarea
              id="description"
              placeholder="Share details about your crop..."
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              rows={3}
              className="text-base resize-none"
            />
          </div>

          {/* Problem Toggle */}
          <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <div>
                <p className="font-medium text-foreground">Report a Problem</p>
                <p className="text-sm text-muted-foreground">Crop disease or pest issue?</p>
              </div>
            </div>
            <Switch
              checked={formData.hasProblem}
              onCheckedChange={(checked) => updateField('hasProblem', checked)}
            />
          </div>

          {/* Problem Description */}
          {formData.hasProblem && (
            <div className="space-y-2">
              <Label htmlFor="problem" className="text-foreground">Problem Description</Label>
              <Textarea
                id="problem"
                placeholder="Describe the problem you're facing..."
                value={formData.problem}
                onChange={(e) => updateField('problem', e.target.value)}
                rows={2}
                className="text-base resize-none border-destructive/50 focus:ring-destructive/50"
              />
            </div>
          )}
        </form>
      </main>
    </div>
  )
}
