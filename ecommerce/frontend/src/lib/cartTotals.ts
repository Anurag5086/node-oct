import type { CartLineItem } from '../types/cart'

export const FREE_DELIVERY_MIN = 999
export const DELIVERY_FEE = 49

export function cartSubtotal(items: CartLineItem[]): number {
  return items.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0)
}

export function deliveryFeeForSubtotal(subtotal: number): number {
  return subtotal >= FREE_DELIVERY_MIN || subtotal === 0 ? 0 : DELIVERY_FEE
}

export function cartTotal(items: CartLineItem[]): number {
  const subtotal = cartSubtotal(items)
  return subtotal + deliveryFeeForSubtotal(subtotal)
}

export function cartItemCount(items: CartLineItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0)
}
