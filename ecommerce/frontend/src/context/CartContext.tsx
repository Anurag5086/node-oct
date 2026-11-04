import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { loadCartFromStorage, saveCartToStorage } from '../lib/cartStorage'
import {
  cartItemCount,
  cartSubtotal,
  cartTotal,
  deliveryFeeForSubtotal,
} from '../lib/cartTotals'
import type { Product } from '../types/catalog'
import type { CartLineItem } from '../types/cart'

type CartNotice = { message: string; type: 'success' | 'error' } | null

type CartContextValue = {
  items: CartLineItem[]
  itemCount: number
  subtotal: number
  deliveryFee: number
  total: number
  notice: CartNotice
  clearNotice: () => void
  addToBag: (product: Product, quantity?: number) => void
  setQuantity: (productId: string, quantity: number) => void
  removeFromBag: (productId: string) => void
  clearBag: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

function productToLine(product: Product, quantity: number): CartLineItem {
  return {
    productId: product._id,
    title: product.title,
    brand: product.brand,
    image: product.images?.[0] ?? '',
    sellingPrice: product.sellingPrice,
    mrpPrice: product.mrpPrice,
    maxStock: product.stockQty,
    quantity,
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLineItem[]>(() => loadCartFromStorage())
  const [notice, setNotice] = useState<CartNotice>(null)

  useEffect(() => {
    saveCartToStorage(items)
  }, [items])

  const clearNotice = useCallback(() => setNotice(null), [])

  const addToBag = useCallback((product: Product, quantity = 1) => {
    if (product.stockQty < 1) {
      setNotice({ message: 'This item is out of stock.', type: 'error' })
      return
    }

    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product._id)
      const nextQty = (existing?.quantity ?? 0) + quantity

      if (nextQty > product.stockQty) {
        setNotice({
          message: `Only ${product.stockQty} in stock for this item.`,
          type: 'error',
        })
        return prev
      }

      const line = productToLine(product, nextQty)
      if (existing) {
        setNotice({ message: `${product.title} updated in your bag.`, type: 'success' })
        return prev.map((i) => (i.productId === product._id ? line : i))
      }

      setNotice({ message: `${product.title} added to your bag.`, type: 'success' })
      return [...prev, line]
    })
  }, [])

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) => {
      const item = prev.find((i) => i.productId === productId)
      if (!item) return prev

      if (quantity < 1) {
        return prev.filter((i) => i.productId !== productId)
      }

      const capped = Math.min(quantity, item.maxStock)
      return prev.map((i) =>
        i.productId === productId ? { ...i, quantity: capped } : i,
      )
    })
  }, [])

  const removeFromBag = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId))
    setNotice({ message: 'Item removed from bag.', type: 'success' })
  }, [])

  const clearBag = useCallback(() => setItems([]), [])

  const subtotal = useMemo(() => cartSubtotal(items), [items])
  const deliveryFee = useMemo(() => deliveryFeeForSubtotal(subtotal), [subtotal])
  const total = useMemo(() => cartTotal(items), [items])
  const itemCount = useMemo(() => cartItemCount(items), [items])

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      deliveryFee,
      total,
      notice,
      clearNotice,
      addToBag,
      setQuantity,
      removeFromBag,
      clearBag,
    }),
    [
      items,
      itemCount,
      subtotal,
      deliveryFee,
      total,
      notice,
      clearNotice,
      addToBag,
      setQuantity,
      removeFromBag,
      clearBag,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider')
  }
  return ctx
}
