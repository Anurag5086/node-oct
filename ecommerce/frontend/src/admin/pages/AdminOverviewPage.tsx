import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  fetchAdminCategories,
  fetchAdminProducts,
  fetchAdminUsers,
} from '../../api/admin'
import { fetchAdminOrders } from '../../api/orders'
import { ApiError } from '../../api/httpClient'
import { Alert } from '../../components/Alert'

export function AdminOverviewPage() {
  const [stats, setStats] = useState({ categories: 0, products: 0, users: 0, orders: 0 })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [categories, products, users, orders] = await Promise.all([
          fetchAdminCategories(),
          fetchAdminProducts(),
          fetchAdminUsers(),
          fetchAdminOrders(),
        ])
        setStats({
          categories: categories.length,
          products: products.length,
          users: users.length,
          orders: orders.length,
        })
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'Failed to load dashboard stats')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const cards = [
    { label: 'Categories', value: stats.categories, to: '/admin/categories' },
    { label: 'Products', value: stats.products, to: '/admin/products' },
    { label: 'Users', value: stats.users, to: '/admin/users' },
    { label: 'Orders', value: stats.orders, to: '/admin/orders' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-brand-950">Overview</h1>
        <p className="mt-1 text-stone-600">Quick snapshot of your store data from existing admin APIs.</p>
      </div>

      {error ? <Alert variant="error">{error}</Alert> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.to}
            className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:border-accent-500/30 hover:shadow-md"
          >
            <p className="text-sm font-medium text-stone-500">{card.label}</p>
            <p className="mt-2 font-display text-3xl font-semibold text-brand-950">
              {loading ? '…' : card.value}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
