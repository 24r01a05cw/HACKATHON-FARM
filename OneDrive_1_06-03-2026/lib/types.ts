export type UserRole = 'farmer' | 'customer'

export interface User {
  id: string
  name: string
  phone: string
  role: UserRole
  avatar?: string
  village?: string
  district?: string
  state?: string
  city?: string
  farmSize?: string
  primaryCrops?: string[]
  rating?: number
  followers?: number
  following?: number
  totalSales?: number
  totalOrders?: number
  productsListed?: number
  postsCount?: number
  createdAt: Date
}

export interface Product {
  id: string
  name: string
  category: ProductCategory
  farmerId: string
  farmerName: string
  farmerAvatar?: string
  village: string
  price: number
  unit: string
  availableQuantity: number
  description?: string
  images: string[]
  harvestDate?: Date
  isOrganic?: boolean
  isFreshHarvest?: boolean
  rating?: number
  reviewsCount?: number
  createdAt: Date
}

export type ProductCategory = 
  | 'vegetables'
  | 'fruits'
  | 'cereals'
  | 'millets'
  | 'pulses'
  | 'oilseeds'
  | 'natural'

export interface CropUpdate {
  id: string
  farmerId: string
  farmerName: string
  farmerAvatar?: string
  village: string
  cropName: string
  daysAfterPlanting?: number
  description?: string
  problem?: string
  images: string[]
  videoUrl?: string
  likes: number
  comments: number
  shares: number
  isSaved?: boolean
  isLiked?: boolean
  createdAt: Date
  type: 'update' | 'alert' | 'price_change' | 'weather'
}

export interface Reel {
  id: string
  farmerId: string
  farmerName: string
  farmerAvatar?: string
  village: string
  videoUrl: string
  thumbnailUrl: string
  description: string
  likes: number
  comments: number
  shares: number
  isLiked?: boolean
  createdAt: Date
}

export interface CartItem {
  productId: string
  product: Product
  quantity: number
}

export interface Order {
  id: string
  customerId: string
  items: CartItem[]
  totalAmount: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  shippingAddress: Address
  createdAt: Date
}

export interface Address {
  id?: string
  name: string
  phone: string
  addressLine1: string
  addressLine2?: string
  village?: string
  city: string
  district: string
  state: string
  pincode: string
  isDefault?: boolean
}

export interface Review {
  id: string
  productId: string
  customerId: string
  customerName: string
  customerAvatar?: string
  rating: number
  comment: string
  createdAt: Date
}

export interface Notification {
  id: string
  type: 'order' | 'follow' | 'like' | 'comment' | 'alert'
  title: string
  message: string
  isRead: boolean
  createdAt: Date
}

export interface Category {
  id: ProductCategory
  name: string
  icon: string
}
