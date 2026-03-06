'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Sprout, ArrowLeft, Phone, Lock, User, Tractor, ShoppingBasket, Eye, EyeOff, MapPin, Building2, Camera } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useApp } from '@/lib/app-context'
import { UserRole } from '@/lib/types'
import { cn } from '@/lib/utils'

export default function SignupPage() {
  const router = useRouter()
  const { signup } = useApp()
  const [step, setStep] = useState<'role' | 'form'>('role')
  const [role, setRole] = useState<UserRole | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    village: '',
    district: '',
    state: '',
    city: '',
    farmSize: '',
    primaryCrops: '',
  })

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole)
    setStep('form')
  }

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!role || !formData.name || !formData.phone || !formData.password) {
      setError('Please fill in all required fields')
      return
    }
    
    setIsLoading(true)
    setError('')
    
    try {
      const userData = {
        name: formData.name,
        phone: formData.phone,
        role,
        village: formData.village,
        district: formData.district,
        state: formData.state,
        city: formData.city,
        farmSize: formData.farmSize,
        primaryCrops: formData.primaryCrops ? formData.primaryCrops.split(',').map(c => c.trim()) : undefined,
      }
      
      const success = await signup(userData, formData.password)
      if (success) {
        router.push('/home')
      } else {
        setError('Failed to create account')
      }
    } catch {
      setError('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={() => step === 'form' ? setStep('role') : router.push('/')}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-2">
          <Sprout className="w-6 h-6 text-primary" />
          <span className="text-lg font-semibold text-foreground">Rythu Market</span>
        </div>
      </div>

      {step === 'role' ? (
        /* Role Selection */
        <div className="flex-1 flex flex-col">
          <h1 className="text-2xl font-bold text-foreground mb-2">Create Account</h1>
          <p className="text-muted-foreground mb-8">Choose your account type</p>
          
          <div className="space-y-4">
            <Card
              className={cn(
                'cursor-pointer transition-all hover:border-primary hover:shadow-md bg-card',
                role === 'farmer' && 'border-primary ring-2 ring-primary/20'
              )}
              onClick={() => handleRoleSelect('farmer')}
            >
              <CardContent className="flex items-center gap-4 p-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Tractor className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-card-foreground">Farmer Account</h3>
                  <p className="text-sm text-muted-foreground">Sell your produce, share updates</p>
                </div>
              </CardContent>
            </Card>

            <Card
              className={cn(
                'cursor-pointer transition-all hover:border-primary hover:shadow-md bg-card',
                role === 'customer' && 'border-primary ring-2 ring-primary/20'
              )}
              onClick={() => handleRoleSelect('customer')}
            >
              <CardContent className="flex items-center gap-4 p-6">
                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
                  <ShoppingBasket className="w-8 h-8 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-card-foreground">Customer Account</h3>
                  <p className="text-sm text-muted-foreground">Buy fresh produce from farmers</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <p className="text-center text-sm text-muted-foreground mt-auto pt-8">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-medium">
              Login
            </Link>
          </p>
        </div>
      ) : (
        /* Registration Form */
        <div className="flex-1 flex flex-col overflow-auto pb-6">
          <div className="flex items-center gap-3 mb-6">
            {role === 'farmer' ? (
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Tractor className="w-6 h-6 text-primary" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                <ShoppingBasket className="w-6 h-6 text-accent" />
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold text-foreground">{role === 'farmer' ? 'Farmer' : 'Customer'} Registration</h1>
              <p className="text-sm text-muted-foreground">Fill in your details</p>
            </div>
          </div>

          {/* Profile Photo */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-primary/20">
                <AvatarImage src="" />
                <AvatarFallback className="bg-secondary text-secondary-foreground text-2xl">
                  <User className="w-10 h-10" />
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Camera className="w-4 h-4 text-primary-foreground" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">Full Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className="pl-11 h-12 text-base"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-foreground">Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  className="pl-11 h-12 text-base"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  className="pl-11 pr-11 h-12 text-base"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <Eye className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>

            {/* Location fields based on role */}
            {role === 'farmer' ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="village" className="text-foreground">Village *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="village"
                      type="text"
                      placeholder="Enter your village"
                      value={formData.village}
                      onChange={(e) => updateField('village', e.target.value)}
                      className="pl-11 h-12 text-base"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="district" className="text-foreground">District</Label>
                    <Input
                      id="district"
                      type="text"
                      placeholder="District"
                      value={formData.district}
                      onChange={(e) => updateField('district', e.target.value)}
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-foreground">State</Label>
                    <Input
                      id="state"
                      type="text"
                      placeholder="State"
                      value={formData.state}
                      onChange={(e) => updateField('state', e.target.value)}
                      className="h-12 text-base"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="farmSize" className="text-foreground">Farm Size (Optional)</Label>
                  <Input
                    id="farmSize"
                    type="text"
                    placeholder="e.g., 5 acres"
                    value={formData.farmSize}
                    onChange={(e) => updateField('farmSize', e.target.value)}
                    className="h-12 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primaryCrops" className="text-foreground">Primary Crops (Optional)</Label>
                  <Input
                    id="primaryCrops"
                    type="text"
                    placeholder="e.g., Rice, Tomato, Cotton"
                    value={formData.primaryCrops}
                    onChange={(e) => updateField('primaryCrops', e.target.value)}
                    className="h-12 text-base"
                  />
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="city" className="text-foreground">City / Village</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="city"
                    type="text"
                    placeholder="Enter your city or village"
                    value={formData.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    className="pl-11 h-12 text-base"
                  />
                </div>
              </div>
            )}

            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full h-14 text-lg rounded-xl mt-6"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-medium">
              Login
            </Link>
          </p>
        </div>
      )}
    </div>
  )
}
