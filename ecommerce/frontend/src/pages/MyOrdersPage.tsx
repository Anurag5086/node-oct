import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { fetchUserOrders } from '../api/orders'
import { ApiError } from '../api/httpClient'
import { Alert } from '../components/Alert'
import { StoreFooter } from '../components/layout/StoreFooter'
import { StoreHeader } from '../components/layout/StoreHeader'
import { getToken } from '../lib/authStorage'
import { formatCurrency } from '../lib/formatCurrency'
import { orderItemCount } from '../lib/orderHelpers'
import type { BackendOrder } from '../types/order'

export function MyOrdersPage() {
  const location = useLocation()
  const token = getToken()
  const [orders, setOrders] = useState<BackendOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return

    async function load() {
      try {
        setOrders(await fetchUserOrders())
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'Failed to load orders')
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [token])

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return (
    <div className="min-h-screen bg-surface">
      <StoreHeader compact />

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <h1 className="font-display text-3xl font-semibold text-brand-950">My orders</h1>
        <p className="mt-1 text-stone-600">Track COD orders linked to your account.</p>

        {error ? <div className="mt-6"><Alert variant="error">{error}</Alert></div> : null}

        <div className="mt-8 space-y-4">
          {loading ? (
            <p className="text-sm text-stone-500">Loading orders…</p>
          ) : orders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-12 text-center">
              <p className="font-medium text-brand-950">No orders yet</p>
              <Link to="/" className="mt-4 inline-block text-sm font-semibold text-accent-600">
                Start shopping
              </Link>
            </div>
          ) : (
            orders.map((order) => (
              <article
                key={order._id}
                className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs text-stone-500">{order._id}</p>
                    <p className="mt-1 text-sm text-stone-600">
                      {new Date(order.createdAt).toLocaleString()} · {orderItemCount(order)} items
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-brand-950">{formatCurrency(order.totalAmount)}</p>
                    <p className="mt-1 text-xs font-semibold uppercase text-accent-600">{order.paymentMethod}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <span className="rounded-full bg-surface-muted px-3 py-1 text-xs font-semibold capitalize text-brand-900">
                    {order.status}
                  </span>
                  <Link
                    to={`/order/success/${order._id}`}
                    className="text-sm font-semibold text-accent-600 hover:text-accent-500"
                  >
                    View details
                  </Link>
                </div>
              </article>
            ))
          )}
        </div>
      </div>

      <StoreFooter />
    </div>
  )
}
