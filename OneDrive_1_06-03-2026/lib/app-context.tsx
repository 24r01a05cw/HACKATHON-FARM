'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, CartItem, Product, Address, UserRole } from './types'
import { mockProducts, mockAddresses } from './mock-data'

interface AppContextType {
  user: User | null
  setUser: (user: User | null) => void
  isAuthenticated: boolean
  cart: CartItem[]
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateCartQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  cartTotal: number
  cartItemsCount: number
  wishlist: Product[]
  addToWishlist: (product: Product) => void
  removeFromWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  addresses: Address[]
  addAddress: (address: Address) => void
  removeAddress: (addressId: string) => void
  setDefaultAddress: (addressId: string) => void
  defaultAddress: Address | null
  login: (phone: string, password: string, role: UserRole) => Promise<boolean>
  signup: (userData: Partial<User>, password: string) => Promise<boolean>
  logout: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<Product[]>([])
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses)

  // Load state from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('rythu_user')
    const savedCart = localStorage.getItem('rythu_cart')
    const savedWishlist = localStorage.getItem('rythu_wishlist')
    
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist))
    }
  }, [])

  // Save state to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('rythu_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('rythu_user')
    }
  }, [user])

  useEffect(() => {
    localStorage.setItem('rythu_cart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    localStorage.setItem('rythu_wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  const isAuthenticated = !!user

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id)
      if (existing) {
        return prev.map(item =>
          item.productId === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.availableQuantity) }
            : item
        )
      }
      return [...prev, { productId: product.id, product, quantity }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId))
  }

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart(prev =>
      prev.map(item =>
        item.productId === productId
          ? { ...item, quantity: Math.min(quantity, item.product.availableQuantity) }
          : item
      )
    )
  }

  const clearCart = () => setCart([])

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const addToWishlist = (product: Product) => {
    if (!wishlist.find(p => p.id === product.id)) {
      setWishlist(prev => [...prev, product])
    }
  }

  const removeFromWishlist = (productId: string) => {
    setWishlist(prev => prev.filter(p => p.id !== productId))
  }

  const isInWishlist = (productId: string) => wishlist.some(p => p.id === productId)

  const addAddress = (address: Address) => {
    const newAddress = { ...address, id: Date.now().toString() }
    if (addresses.length === 0) {
      newAddress.isDefault = true
    }
    setAddresses(prev => [...prev, newAddress])
  }

  const removeAddress = (addressId: string) => {
    setAddresses(prev => prev.filter(a => a.id !== addressId))
  }

  const setDefaultAddress = (addressId: string) => {
    setAddresses(prev =>
      prev.map(a => ({ ...a, isDefault: a.id === addressId }))
    )
  }

  const defaultAddress = addresses.find(a => a.isDefault) || addresses[0] || null

  const login = async (phone: string, password: string, role: UserRole): Promise<boolean> => {
    // Mock login - in production this would call an API
    if (phone && password) {
      const mockUser: User = {
        id: Date.now().toString(),
        name: role === 'farmer' ? 'Rahul Kumar' : 'Customer User',
        phone,
        role,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
        village: 'Karimnagar',
        district: 'Karimnagar',
        state: 'Telangana',
        rating: 4.7,
        followers: 340,
        following: 45,
        totalSales: 12500,
        totalOrders: 85,
        productsListed: 15,
        postsCount: 25,
        createdAt: new Date(),
      }
      setUser(mockUser)
      return true
    }
    return false
  }

  const signup = async (userData: Partial<User>, password: string): Promise<boolean> => {
    // Mock signup - in production this would call an API
    if (userData.phone && password) {
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name || 'User',
        phone: userData.phone,
        role: userData.role || 'customer',
        avatar: undefined,
        village: userData.village,
        district: userData.district,
        state: userData.state,
        city: userData.city,
        farmSize: userData.farmSize,
        primaryCrops: userData.primaryCrops,
        rating: 0,
        followers: 0,
        following: 0,
        totalSales: 0,
        totalOrders: 0,
        productsListed: 0,
        postsCount: 0,
        createdAt: new Date(),
      }
      setUser(newUser)
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    setCart([])
    localStorage.removeItem('rythu_user')
    localStorage.removeItem('rythu_cart')
  }

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartItemsCount,
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        addresses,
        addAddress,
        removeAddress,
        setDefaultAddress,
        defaultAddress,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
