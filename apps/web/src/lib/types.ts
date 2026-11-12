export type User = {
  id: string
  name: string
  email: string
  role: string
}

export type Category = {
  id: string
  slug: string
  name: string
  productCount?: number
}

export type Product = {
  id: string
  slug: string
  name: string
  description: string
  brand: string
  imageUrl: string
  priceCents: number
  compareAtCents: number | null
  stock: number
  featured: boolean
  specs: string[]
  categoryId: string
  createdAt: string
  updatedAt: string
  category?: { id: string; slug: string; name: string }
}

export type ProductListResponse = {
  items: Product[]
  total: number
  page: number
  perPage: number
}

export type ShippingOption = {
  id: string
  label: string
  priceCents: number
  days: string
}

export type OrderItem = {
  id: string
  productId: string
  productName: string
  productImage: string
  unitPriceCents: number
  quantity: number
  totalCents: number
}

export type Order = {
  id: string
  code: string
  status: string
  customerName: string
  customerEmail: string
  customerPhone: string | null
  shippingName: string
  shippingAddress: string
  shippingCity: string
  shippingState: string
  shippingZip: string
  shippingMethod: string
  shippingCents: number
  subtotalCents: number
  discountCents: number
  totalCents: number
  couponCode: string | null
  paymentMethod: string
  paymentStatus: string
  createdAt: string
  updatedAt: string
  items: OrderItem[]
}

export type AdminStats = {
  revenueCents: number
  ordersCount: number
  paidOrders: number
  productsCount: number
  lowStockCount: number
  averageTicketCents: number
  topProducts: { name: string; quantity: number; totalCents: number }[]
  recentOrders: {
    id: string
    code: string
    customerName: string
    totalCents: number
    status: string
    createdAt: string
  }[]
}

export type ActionResult = {
  ok: boolean
  error?: string
  redirectTo?: string
  code?: string
}
