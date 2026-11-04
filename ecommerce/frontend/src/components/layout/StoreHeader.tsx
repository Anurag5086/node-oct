import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { clearSession, getStoredUser } from '../../lib/authStorage'
import { isAdminUser } from '../../lib/authHelpers'

type StoreHeaderProps = {
  searchQuery?: string
  onSearchChange?: (value: string) => void
  compact?: boolean
}

export function StoreHeader({
  searchQuery = '',
  onSearchChange,
  compact = false,
}: StoreHeaderProps) {
  const navigate = useNavigate()
  const user = getStoredUser()
  const { itemCount } = useCart()

  function handleSignOut() {
    clearSession()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-surface/95 backdrop-blur-md">
      <div className="border-b border-stone-200/60 bg-brand-950 px-4 py-2 text-center text-xs text-white/90">
        Free delivery on orders over ₹999 · 30-day easy returns · Secure checkout
      </div>

      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex shrink-0 items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-900 font-display text-lg font-bold text-white">
            N
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-brand-950">
            Nova Commerce
          </span>
        </Link>

        {!compact && onSearchChange ? (
          <div className="order-3 w-full md:order-none md:mx-4 md:max-w-xl md:flex-1">
            <label className="relative block">
              <span className="sr-only">Search products</span>
              <svg
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search brands, products…"
                className="w-full rounded-xl border border-stone-300 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
              />
            </label>
          </div>
        ) : null}

        <nav className="ml-auto flex items-center gap-2 sm:gap-3">
          {!compact ? (
            <>
              <a
                href="#shop"
                className="hidden rounded-lg px-3 py-2 text-sm font-medium text-brand-800 hover:bg-surface-muted sm:inline-block"
              >
                Shop
              </a>
              <a
                href="#categories"
                className="hidden rounded-lg px-3 py-2 text-sm font-medium text-brand-800 hover:bg-surface-muted sm:inline-block"
              >
                Categories
              </a>
            </>
          ) : (
            <Link
              to="/"
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-brand-800 hover:bg-surface-muted sm:inline-block"
            >
              Shop
            </Link>
          )}

          {isAdminUser(user) ? (
            <Link
              to="/admin"
              className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-accent-600 hover:bg-surface-muted sm:inline-block"
            >
              Admin
            </Link>
          ) : null}

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/orders"
                className="hidden rounded-lg px-3 py-2 text-sm font-medium text-brand-800 hover:bg-surface-muted sm:inline-block"
              >
                Orders
              </Link>
              <span className="hidden max-w-[120px] truncate text-sm font-medium text-brand-900 sm:inline">
                Hi, {user.name.split(' ')[0]}
              </span>
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm font-semibold text-brand-900 hover:bg-surface-muted"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm font-semibold text-brand-900 hover:bg-surface-muted"
            >
              Sign in
            </Link>
          )}

          <Link
            to="/bag"
            className="relative rounded-xl bg-brand-900 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-800"
            aria-label={`Shopping bag, ${itemCount} items`}
          >
            Bag
            {itemCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-500 px-1 text-[10px] font-bold">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            ) : null}
          </Link>
        </nav>
      </div>
    </header>
  )
}
