'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Sprout, ArrowLeft, Phone, Lock, User, Tractor, ShoppingBasket, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { useApp } from '@/lib/app-context'
import { UserRole } from '@/lib/types'
import { cn } from '@/lib/utils'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useApp()
  const [step, setStep] = useState<'role' | 'credentials'>('role')
  const [role, setRole] = useState<UserRole | null>(null)
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole)
    setStep('credentials')
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!role || !phone || !password) {
      setError('Please fill in all fields')
      return
    }
    
    setIsLoading(true)
    setError('')
    
    try {
      const success = await login(phone, password, role)
      if (success) {
        router.push('/home')
      } else {
        setError('Invalid credentials')
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
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={() => step === 'credentials' ? setStep('role') : router.push('/')}
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
          <h1 className="text-2xl font-bold text-foreground mb-2">Welcome Back!</h1>
          <p className="text-muted-foreground mb-8">Choose how you want to login</p>
          
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
                  <h3 className="text-lg font-semibold text-card-foreground">Farmer</h3>
                  <p className="text-sm text-muted-foreground">Sell your produce directly</p>
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
                  <h3 className="text-lg font-semibold text-card-foreground">Customer</h3>
                  <p className="text-sm text-muted-foreground">Buy fresh farm produce</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <p className="text-center text-sm text-muted-foreground mt-auto pt-8">
            {"Don't have an account? "}
            <Link href="/signup" className="text-primary font-medium">
              Sign Up
            </Link>
          </p>
        </div>
      ) : (
        /* Credentials Form */
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-3 mb-8">
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
              <h1 className="text-xl font-bold text-foreground">Login as {role === 'farmer' ? 'Farmer' : 'Customer'}</h1>
              <p className="text-sm text-muted-foreground">Enter your credentials</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-foreground">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-11 h-12 text-base"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <div className="text-right">
              <Link href="/forgot-password" className="text-sm text-primary font-medium">
                Forgot Password?
              </Link>
            </div>

            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full h-14 text-lg rounded-xl"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-auto pt-8">
            {"Don't have an account? "}
            <Link href="/signup" className="text-primary font-medium">
              Sign Up
            </Link>
          </p>
        </div>
      )}
    </div>
  )
}
