import { useEffect, useState } from 'react'
import { fetchAdminOrders, updateOrderStatus } from '../../api/orders'
import { ApiError } from '../../api/httpClient'
import { Alert } from '../../components/Alert'
import { formatCurrency } from '../../lib/formatCurrency'
import {
  orderCustomerEmail,
  orderCustomerName,
  orderItemCount,
} from '../../lib/orderHelpers'
import type { BackendOrder, OrderStatus } from '../../types/order'
import { AdminPanel } from '../components/AdminPanel'

const STATUS_OPTIONS: OrderStatus[] = [
  'pending',
  'confirmed',
  'shipped',
  'delivered',
  'cancelled',
]

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<BackendOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  async function loadOrders() {
    setLoading(true)
    setError(null)
    try {
      setOrders(await fetchAdminOrders())
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadOrders()
  }, [])

  async function handleStatusChange(orderId: string, status: OrderStatus) {
    setUpdatingId(orderId)
    setSuccess(null)
    setError(null)
    try {
      const updated = await updateOrderStatus(orderId, status)
      setOrders((prev) => prev.map((o) => (o._id === orderId ? updated : o)))
      setSuccess(`Order ${orderId} updated to ${status}.`)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to update status')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-brand-950">Orders</h1>
        <p className="mt-1 text-stone-600">All store orders from GET /api/order/get-all-orders.</p>
      </div>

      {error ? <Alert variant="error">{error}</Alert> : null}
      {success ? <Alert variant="success">{success}</Alert> : null}

      <AdminPanel title="Order management">
        {loading ? (
          <p className="text-sm text-stone-500">Loading orders…</p>
        ) : orders.length === 0 ? (
          <p className="text-sm text-stone-500">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-stone-200 text-xs uppercase tracking-wide text-stone-500">
                <tr>
                  <th className="px-2 py-2">Order</th>
                  <th className="px-2 py-2">Customer</th>
                  <th className="px-2 py-2">Items</th>
                  <th className="px-2 py-2">Payment</th>
                  <th className="px-2 py-2">Total</th>
                  <th className="px-2 py-2">Status</th>
                  <th className="px-2 py-2">Placed</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b border-stone-100 align-top">
                    <td className="px-2 py-3 font-mono text-xs">{order._id}</td>
                    <td className="px-2 py-3">
                      <p className="font-medium text-brand-950">{orderCustomerName(order)}</p>
                      <p className="text-xs text-stone-500">{orderCustomerEmail(order)}</p>
                    </td>
                    <td className="px-2 py-3">{orderItemCount(order)}</td>
                    <td className="px-2 py-3">
                      <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800">
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td className="px-2 py-3 font-semibold">{formatCurrency(order.totalAmount)}</td>
                    <td className="px-2 py-3">
                      <select
                        value={order.status}
                        disabled={updatingId === order._id}
                        onChange={(e) => handleStatusChange(order._id, e.target.value as OrderStatus)}
                        className="rounded-lg border border-stone-300 px-2 py-1 text-xs capitalize"
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-2 py-3 text-stone-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminPanel>
    </div>
  )
}
