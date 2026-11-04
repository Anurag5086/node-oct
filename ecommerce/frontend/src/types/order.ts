import type { Product } from './catalog'

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export type OrderProductLine = {
  product: Product | string
  quantity: number
  _id?: string
}

export type OrderUserRef = {
  _id: string
  name: string
  email: string
}

export type BackendOrder = {
  _id: string
  userId: string | OrderUserRef
  products: OrderProductLine[]
  totalAmount: number
  status: OrderStatus
  paymentMethod: 'COD' | 'Razorpay'
  shippingAddress: string
  createdAt: string
  updatedAt: string
}

export type CreateOrderPayload = {
  products: { product: string; quantity: number }[]
  totalAmount: number
  paymentMethod: 'COD' | 'Razorpay'
  shippingAddress: string
}
