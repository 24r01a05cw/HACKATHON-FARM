'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, MapPin, Plus, Check, CreditCard, Truck, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { useApp } from '@/lib/app-context'
import { cn } from '@/lib/utils'

const paymentMethods = [
  { id: 'cod', name: 'Cash on Delivery', icon: '💵', description: 'Pay when you receive' },
  { id: 'upi', name: 'UPI', icon: '📱', description: 'Google Pay, PhonePe, Paytm' },
  { id: 'card', name: 'Credit/Debit Card', icon: '💳', description: 'Visa, Mastercard, RuPay' },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, cartTotal, addresses, defaultAddress, clearCart } = useApp()
  
  const [selectedAddress, setSelectedAddress] = useState(defaultAddress?.id || '')
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [isOrdering, setIsOrdering] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)

  const deliveryFee = cartTotal > 500 ? 0 : 40
  const total = cartTotal + deliveryFee

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      return
    }
    
    setIsOrdering(true)
    
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setOrderPlaced(true)
    clearCart()
    
    // Redirect to orders after a delay
    setTimeout(() => {
      router.push('/orders')
    }, 3000)
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <Check className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Order Placed!</h1>
        <p className="text-muted-foreground text-center mb-6">
          Your order has been placed successfully. You will receive updates soon.
        </p>
        <Button asChild>
          <Link href="/orders">View Orders</Link>
        </Button>
      </div>
    )
  }

  if (cart.length === 0) {
    router.push('/cart')
    return null
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border px-4 py-3">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Checkout</h1>
        </div>
      </header>

      <main className="px-4 py-4 max-w-lg mx-auto space-y-4">
        {/* Delivery Address */}
        <Card className="bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-card-foreground">Delivery Address</h2>
              </div>
              <Link href="/addresses" className="text-sm text-primary font-medium">
                Change
              </Link>
            </div>
            
            {addresses.length === 0 ? (
              <Button variant="outline" className="w-full justify-start gap-2" asChild>
                <Link href="/addresses/add">
                  <Plus className="w-4 h-4" />
                  Add New Address
                </Link>
              </Button>
            ) : (
              <div className="space-y-2">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className={cn(
                      'p-3 rounded-lg border cursor-pointer transition-colors',
                      selectedAddress === address.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                    onClick={() => setSelectedAddress(address.id!)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-card-foreground">{address.name}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {address.addressLine1}, {address.addressLine2 && `${address.addressLine2}, `}
                          {address.city}, {address.state} - {address.pincode}
                        </p>
                        <p className="text-sm text-muted-foreground">{address.phone}</p>
                      </div>
                      {selectedAddress === address.id && (
                        <Check className="w-5 h-5 text-primary shrink-0" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="bg-card">
          <CardContent className="p-4">
            <h2 className="font-semibold text-card-foreground mb-3">Order Summary ({cart.length} items)</h2>
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.productId} className="flex gap-3">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-card-foreground truncate">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">{item.quantity} x ₹{item.product.price}</p>
                  </div>
                  <p className="font-medium text-card-foreground">₹{item.product.price * item.quantity}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card className="bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-card-foreground">Payment Method</h2>
            </div>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-2">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg border cursor-pointer',
                    paymentMethod === method.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border'
                  )}
                  onClick={() => setPaymentMethod(method.id)}
                >
                  <RadioGroupItem value={method.id} id={method.id} />
                  <span className="text-xl">{method.icon}</span>
                  <div className="flex-1">
                    <Label htmlFor={method.id} className="font-medium cursor-pointer text-card-foreground">
                      {method.name}
                    </Label>
                    <p className="text-xs text-muted-foreground">{method.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Price Summary */}
        <Card className="bg-card">
          <CardContent className="p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-card-foreground">₹{cartTotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Delivery Fee</span>
              {deliveryFee === 0 ? (
                <span className="text-primary font-medium">FREE</span>
              ) : (
                <span className="text-card-foreground">₹{deliveryFee}</span>
              )}
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="font-semibold text-card-foreground">Total</span>
              <span className="text-xl font-bold text-primary">₹{total}</span>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Info */}
        <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl">
          <Truck className="w-5 h-5 text-primary" />
          <p className="text-sm text-foreground">Expected delivery in 2-3 days</p>
        </div>
      </main>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 safe-area-bottom">
        <div className="max-w-lg mx-auto">
          <Button
            className="w-full h-14 text-lg"
            onClick={handlePlaceOrder}
            disabled={isOrdering || !selectedAddress}
          >
            {isOrdering ? 'Placing Order...' : `Place Order - ₹${total}`}
          </Button>
        </div>
      </div>
    </div>
  )
}
