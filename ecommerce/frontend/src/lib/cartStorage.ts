import type { CartLineItem } from '../types/cart'

const CART_KEY = 'nova_cart'

export function loadCartFromStorage(): CartLineItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as CartLineItem[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveCartToStorage(items: CartLineItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
}
