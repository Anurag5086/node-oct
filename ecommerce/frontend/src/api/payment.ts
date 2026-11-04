import type { BackendOrder } from '../types/order'
import { authFetch } from './httpClient'

type CartLinePayload = { product: string; quantity: number }

export type RazorpayOrderResponse = {
  keyId: string
  amount: number
  currency: string
  orderId: string
}

export async function createRazorpayOrder(payload: {
  items: CartLinePayload[]
}): Promise<RazorpayOrderResponse> {
  const body = await authFetch<{
    success?: boolean
    message?: string
    keyId?: string
    amount?: number
    currency?: string
    orderId?: string
  }>('/api/payment/razorpay/create-order', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  if (!body.keyId || !body.orderId || body.amount == null) {
    throw new Error(body.message ?? 'Could not start Razorpay checkout')
  }

  return {
    keyId: body.keyId,
    amount: body.amount,
    currency: body.currency ?? 'INR',
    orderId: body.orderId,
  }
}

export async function verifyRazorpayCheckout(payload: {
  items: CartLinePayload[]
  shippingAddress: string
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}): Promise<{ order: BackendOrder }> {
  const body = await authFetch<{ order?: BackendOrder; message?: string }>(
    '/api/payment/razorpay/verify',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  )

  if (!body.order) {
    throw new Error(body.message ?? 'Payment verification failed')
  }

  return { order: body.order }
}
