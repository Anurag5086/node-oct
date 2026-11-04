import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { fetchOrderById } from '../api/orders'
import { ApiError } from '../api/httpClient'
import { OrderSummary } from '../components/OrderSummary'
import { StoreFooter } from '../components/layout/StoreFooter'
import { StoreHeader } from '../components/layout/StoreHeader'
import { formatCurrency } from '../lib/formatCurrency'
import { formatOrderNumber, ORDER_SUCCESS_STEPS } from '../lib/orderDisplay'
import {
  getProductFromLine,
  orderDeliveryFee,
  orderItemCount,
  orderMerchandiseSubtotal,
} from '../lib/orderHelpers'
import type { CartLineItem } from '../types/cart'
import type { BackendOrder } from '../types/order'

type ConfirmationLocationState = {
  order?: BackendOrder
  justPlaced?: boolean
  lineItems?: CartLineItem[]
}

export function OrderConfirmationPage() {
  const { orderId } = useParams()
  const location = useLocation()
  const navState = (location.state as ConfirmationLocationState | null) ?? {}
  const justPlaced = Boolean(navState.justPlaced)
  const { clearBag } = useCart()

  useEffect(() => {
    if (justPlaced) {
      clearBag()
    }
  }, [justPlaced, clearBag])

  const [order, setOrder] = useState<BackendOrder | null>(navState.order ?? null)
  const [lineItems] = useState<CartLineItem[] | undefined>(navState.lineItems)
  const [loading, setLoading] = useState(!navState.order)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!orderId) {
      setLoading(false)
      return
    }

    let cancelled = false

    async function load() {
      if (!orderId) return
      try {
        const data = await fetchOrderById(orderId)
        if (!cancelled) setOrder(data)
      } catch (err) {
        if (!cancelled && !navState.order) {
          setError(err instanceof ApiError ? err.message : 'Could not load order')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [orderId, navState.order])

  if (loading && !order) {
    return (
      <div className="min-h-screen bg-surface">
        <StoreHeader compact />
        <p className="py-20 text-center text-sm text-stone-600">Loading your confirmation…</p>
      </div>
    )
  }

  if (!order || error) {
    return (
      <div className="min-h-screen bg-surface">
        <StoreHeader compact />
        <div className="mx-auto max-w-lg px-4 py-20 text-center">
          <p className="font-display text-2xl font-semibold text-brand-950">Order not found</p>
          {error ? <p className="mt-2 text-sm text-stone-600">{error}</p> : null}
          <Link to="/" className="mt-6 inline-block text-sm font-semibold text-accent-600">
            Back to shop
          </Link>
        </div>
      </div>
    )
  }

  const itemCount = orderItemCount(order)
  const subtotal = orderMerchandiseSubtotal(order)
  const deliveryFee = orderDeliveryFee(order)
  const orderNumber = formatOrderNumber(order._id)

  return (
    <div className="min-h-screen bg-surface">
      <StoreHeader compact />

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:py-14">
        <section className="relative overflow-hidden rounded-3xl border border-emerald-200/80 bg-gradient-to-b from-emerald-50 to-white px-6 py-10 text-center shadow-sm sm:px-10">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                'radial-gradient(circle at 50% 0%, #2dd4bf 0%, transparent 55%)',
            }}
          />
          <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/30">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="relative mt-5 text-sm font-semibold uppercase tracking-widest text-emerald-700">
            {justPlaced ? 'Order placed successfully' : 'Order confirmation'}
          </p>
          <h1 className="relative mt-2 font-display text-3xl font-semibold text-brand-950 sm:text-4xl">
            Thank you — you&apos;re all set
          </h1>
          <p className="relative mx-auto mt-3 max-w-lg text-base text-stone-600">
            Your Cash on Delivery order is confirmed. Keep your phone handy — we&apos;ll contact you
            before delivery.
          </p>
          <div className="relative mt-6 inline-flex flex-col items-center rounded-2xl border border-stone-200 bg-white px-6 py-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500">Order number</p>
            <p className="mt-1 font-display text-2xl font-semibold text-brand-950">{orderNumber}</p>
            <p className="mt-1 text-xs text-stone-400">Reference: {order._id}</p>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <h2 className="font-display text-lg font-semibold text-brand-950">What happens next</h2>
          <ol className="mt-4 space-y-4">
            {ORDER_SUCCESS_STEPS.map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    index === 0 ? 'bg-emerald-600 text-white' : 'bg-surface-muted text-stone-600'
                  }`}
                >
                  {index + 1}
                </span>
                <div>
                  <p className="font-semibold text-brand-950">{step.title}</p>
                  <p className="text-sm text-stone-600">{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-stone-200 bg-white p-5 text-sm shadow-sm">
            <h2 className="font-display text-lg font-semibold text-brand-950">Delivery details</h2>
            <pre className="mt-3 whitespace-pre-wrap font-sans leading-relaxed text-stone-600">
              {order.shippingAddress}
            </pre>
            <div className="mt-4 space-y-2 rounded-xl bg-surface-muted px-4 py-3 text-stone-700">
              <p>
                Payment: <strong>{order.paymentMethod}</strong>
              </p>
              <p>
                Amount due at delivery:{' '}
                <strong className="text-brand-950">{formatCurrency(order.totalAmount)}</strong>
              </p>
              <p className="text-xs capitalize text-stone-500">Status: {order.status}</p>
            </div>
          </section>

          <OrderSummary
            subtotal={subtotal || (lineItems?.reduce((s, i) => s + i.sellingPrice * i.quantity, 0) ?? 0)}
            deliveryFee={deliveryFee}
            total={order.totalAmount}
            itemCount={itemCount || (lineItems?.reduce((s, i) => s + i.quantity, 0) ?? 0)}
          />
        </div>

        <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <h2 className="font-display text-lg font-semibold text-brand-950">Items in this order</h2>
          <ul className="mt-4 divide-y divide-stone-100">
            {order.products.length > 0
              ? order.products.map((line) => {
                  const product = getProductFromLine(line)
                  const title = product?.title ?? 'Product'
                  const price = product?.sellingPrice ?? 0
                  return (
                    <li
                      key={line._id ?? `${title}-${line.quantity}`}
                      className="flex justify-between gap-4 py-3 text-sm"
                    >
                      <span className="text-stone-700">
                        {title} × {line.quantity}
                      </span>
                      <span className="shrink-0 font-semibold text-brand-950">
                        {formatCurrency(price * line.quantity)}
                      </span>
                    </li>
                  )
                })
              : (lineItems ?? []).map((item) => (
                  <li key={item.productId} className="flex justify-between gap-4 py-3 text-sm">
                    <span className="text-stone-700">
                      {item.title} × {item.quantity}
                    </span>
                    <span className="shrink-0 font-semibold text-brand-950">
                      {formatCurrency(item.sellingPrice * item.quantity)}
                    </span>
                  </li>
                ))}
          </ul>
        </section>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="rounded-xl bg-brand-900 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-800"
          >
            Continue shopping
          </Link>
          <Link
            to="/orders"
            className="rounded-xl border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-brand-900 hover:bg-surface-muted"
          >
            View my orders
          </Link>
        </div>
      </div>

      <StoreFooter />
    </div>
  )
}
