'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, Camera, Image as ImageIcon, X, Leaf, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { categories } from '@/lib/mock-data'

const units = ['kg', 'gram', 'dozen', 'piece', 'litre', 'bundle']

export default function AddProductPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    unit: 'kg',
    quantity: '',
    description: '',
    isOrganic: false,
    isFreshHarvest: true,
  })

  const handleImageSelect = () => {
    setSelectedImage('https://images.unsplash.com/photo-1546470427-227c7369a9b9?w=400&h=400&fit=crop')
  }

  const updateField = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    router.push('/products/manage')
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
            <h1 className="text-lg font-semibold text-foreground">Add Product</h1>
          </div>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading || !selectedImage || !formData.name || !formData.price}
            className="h-9"
          >
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </header>

      <main className="px-4 py-6 max-w-lg mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="text-foreground">Product Image *</Label>
            {selectedImage ? (
              <div className="relative aspect-square rounded-xl overflow-hidden">
                <Image
                  src={selectedImage}
                  alt="Product"
                  fill
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
              <div className="aspect-square rounded-xl border-2 border-dashed border-border bg-secondary/30 flex flex-col items-center justify-center gap-4">
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
                <p className="text-sm text-muted-foreground">Add a clear photo of your product</p>
              </div>
            )}
          </div>

          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">Product Name *</Label>
            <Input
              id="name"
              type="text"
              placeholder="e.g., Fresh Tomatoes"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              className="h-12 text-base"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-foreground">Category *</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => updateField('category', value)}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price and Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-foreground">Price (₹) *</Label>
              <Input
                id="price"
                type="number"
                placeholder="e.g., 50"
                value={formData.price}
                onChange={(e) => updateField('price', e.target.value)}
                className="h-12 text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit" className="text-foreground">Unit</Label>
              <Select 
                value={formData.unit} 
                onValueChange={(value) => updateField('unit', value)}
              >
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Available Quantity */}
          <div className="space-y-2">
            <Label htmlFor="quantity" className="text-foreground">Available Quantity *</Label>
            <div className="flex items-center gap-2">
              <Input
                id="quantity"
                type="number"
                placeholder="e.g., 100"
                value={formData.quantity}
                onChange={(e) => updateField('quantity', e.target.value)}
                className="h-12 text-base flex-1"
              />
              <span className="text-muted-foreground w-16">{formData.unit}</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your product..."
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              rows={3}
              className="text-base resize-none"
            />
          </div>

          {/* Badges */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
              <div className="flex items-center gap-3">
                <Leaf className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Organic</p>
                  <p className="text-sm text-muted-foreground">Grown without chemicals</p>
                </div>
              </div>
              <Switch
                checked={formData.isOrganic}
                onCheckedChange={(checked) => updateField('isOrganic', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-accent" />
                <div>
                  <p className="font-medium text-foreground">Fresh Harvest</p>
                  <p className="text-sm text-muted-foreground">Recently harvested</p>
                </div>
              </div>
              <Switch
                checked={formData.isFreshHarvest}
                onCheckedChange={(checked) => updateField('isFreshHarvest', checked)}
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full h-14 text-lg rounded-xl"
            disabled={isLoading || !selectedImage || !formData.name || !formData.price}
          >
            {isLoading ? 'Adding Product...' : 'Add Product'}
          </Button>
        </form>
      </main>
    </div>
  )
}
