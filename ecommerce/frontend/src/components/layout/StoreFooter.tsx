import { Link } from 'react-router-dom'

export function StoreFooter() {
  return (
    <footer className="mt-16 border-t border-stone-200 bg-brand-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-600 font-display text-sm font-bold">
              N
            </span>
            <span className="font-display text-lg font-semibold">Nova Commerce</span>
          </Link>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">
            Curated products from verified sellers, transparent pricing, and support you can reach
            when it matters. Shop with the same trust you expect on login — end to end.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">Shop</h3>
          <ul className="mt-4 space-y-2 text-sm text-white/65">
            <li>
              <a href="#shop" className="hover:text-accent-400">
                New arrivals
              </a>
            </li>
            <li>
              <a href="#categories" className="hover:text-accent-400">
                Categories
              </a>
            </li>
            <li>
              <span className="text-white/40">Gift cards (soon)</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">Account</h3>
          <ul className="mt-4 space-y-2 text-sm text-white/65">
            <li>
              <Link to="/login" className="hover:text-accent-400">
                Sign in
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-accent-400">
                Create account
              </Link>
            </li>
            <li>
              <span className="text-white/40">Order tracking (soon)</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-6 text-center text-xs text-white/45 sm:px-6">
        © {new Date().getFullYear()} Nova Commerce · Secure payments · Privacy protected
      </div>
    </footer>
  )
}
