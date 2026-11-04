import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/categories', label: 'Categories', end: false },
  { to: '/admin/products', label: 'Products', end: false },
  { to: '/admin/users', label: 'Users', end: false },
  { to: '/admin/orders', label: 'Orders', end: false },
]

function linkClass({ isActive }: { isActive: boolean }) {
  return [
    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
    isActive
      ? 'bg-white/10 text-white shadow-inner'
      : 'text-white/70 hover:bg-white/5 hover:text-white',
  ].join(' ')
}

export function AdminSidebar() {
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-white/10 bg-brand-950 text-white">
      <div className="border-b border-white/10 px-5 py-5">
        <NavLink to="/" className="inline-flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-600 font-display text-sm font-bold">
            N
          </span>
          <div>
            <p className="font-display text-base font-semibold leading-tight">Nova Admin</p>
            <p className="text-xs text-white/55">Store management</p>
          </div>
        </NavLink>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
            <span className="h-1.5 w-1.5 rounded-full bg-accent-400 opacity-80" aria-hidden />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 px-5 py-4 text-xs text-white/45">
        Admin-only area · Role verified on each request
      </div>
    </aside>
  )
}
