'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useApp } from '@/lib/app-context'

export default function CartPage() {
  const router = useRouter()
  const { cart, updateCartQuantity, removeFromCart, cartTotal, clearCart } = useApp()

  const deliveryFee = cartTotal > 500 ? 0 : 40
  const total = cartTotal + deliveryFee

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-40 bg-card border-b border-border px-4 py-3">
          <div className="flex items-center gap-3 max-w-lg mx-auto">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-semibold text-foreground">Shopping Cart</h1>
          </div>
        </header>
        
        <div className="flex flex-col items-center justify-center h-[70vh] px-4">
          <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-4">
            <ShoppingBag className="w-12 h-12 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground text-center mb-6">Browse our marketplace to find fresh farm produce</p>
          <Button asChild>
            <Link href="/market">Browse Products</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-semibold text-foreground">Shopping Cart ({cart.length})</h1>
          </div>
          <Button variant="ghost" size="sm" className="text-destructive" onClick={clearCart}>
            Clear All
          </Button>
        </div>
      </header>

      <main className="px-4 py-4 max-w-lg mx-auto">
        {/* Cart Items */}
        <div className="space-y-3 mb-6">
          {cart.map((item) => (
            <Card key={item.productId} className="bg-card">
              <CardContent className="p-3">
                <div className="flex gap-3">
                  <Link href={`/product/${item.productId}`} className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${item.productId}`}>
                      <h3 className="font-semibold text-card-foreground truncate">{item.product.name}</h3>
                    </Link>
                    <p className="text-xs text-muted-foreground">{item.product.farmerName}</p>
                    <p className="text-sm font-semibold text-primary mt-1">
                      ₹{item.product.price}/{item.product.unit}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium text-card-foreground">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.product.availableQuantity}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => removeFromCart(item.productId)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Price Summary */}
        <Card className="bg-card">
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium text-card-foreground">₹{cartTotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Delivery Fee</span>
              {deliveryFee === 0 ? (
                <span className="text-primary font-medium">FREE</span>
              ) : (
                <span className="font-medium text-card-foreground">₹{deliveryFee}</span>
              )}
            </div>
            {cartTotal < 500 && (
              <p className="text-xs text-muted-foreground">
                Add ₹{500 - cartTotal} more for free delivery
              </p>
            )}
            <Separator />
            <div className="flex justify-between">
              <span className="font-semibold text-card-foreground">Total</span>
              <span className="text-xl font-bold text-primary">₹{total}</span>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 safe-area-bottom">
        <div className="max-w-lg mx-auto">
          <Button asChild className="w-full h-14 text-lg">
            <Link href="/checkout">
              Proceed to Checkout - ₹{total}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
