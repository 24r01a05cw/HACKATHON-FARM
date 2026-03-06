'use client'

import Link from 'next/link'
import { Sprout, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function WelcomePage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      {/* Logo */}
      <div className="w-28 h-28 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <Sprout className="w-16 h-16 text-primary" />
      </div>
      
      {/* App Name */}
      <h1 className="text-4xl font-bold text-primary mb-2">Rythu Market</h1>
      <p className="text-lg text-muted-foreground mb-12">Direct from Farmer to Your Home</p>
      
      {/* Illustration Area */}
      <div className="w-full max-w-xs aspect-square rounded-3xl bg-secondary/50 mb-12 flex items-center justify-center overflow-hidden">
        <div className="text-center p-6">
          <div className="flex justify-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-3xl">🌾</span>
            </div>
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
              <span className="text-3xl">🥬</span>
            </div>
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-3xl">🍎</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Fresh produce directly from local farmers
          </p>
        </div>
      </div>
      
      {/* Buttons */}
      <div className="w-full max-w-xs space-y-4">
        <Button asChild size="lg" className="w-full h-14 text-lg rounded-xl">
          <Link href="/login">
            Login
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="w-full h-14 text-lg rounded-xl">
          <Link href="/signup">
            Sign Up
          </Link>
        </Button>
      </div>
      
      {/* Footer Text */}
      <p className="text-xs text-muted-foreground mt-8 max-w-xs">
        By continuing, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  )
}
