import { Link, Outlet } from 'react-router-dom'
import { AdminSidebar } from './AdminSidebar'
import { getStoredUser } from '../lib/authStorage'

export function AdminLayout() {
  const user = getStoredUser()

  return (
    <div className="flex min-h-screen bg-surface-muted">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-stone-200 bg-white px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-accent-600">
              Admin dashboard
            </p>
            <p className="text-sm text-stone-600">Manage catalog, customers, and store content</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-stone-600 sm:inline">{user?.email}</span>
            <Link
              to="/"
              className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm font-semibold text-brand-900 hover:bg-surface"
            >
              View storefront
            </Link>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
