import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { TrustBadges } from './TrustBadges'

type AuthLayoutProps = {
  title: string
  subtitle: string
  children: ReactNode
  footer: ReactNode
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-brand-950 lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, #0d9488 0%, transparent 45%), radial-gradient(circle at 80% 0%, #2dd4bf 0%, transparent 35%)',
          }}
        />
        <div className="relative">
          <Link to="/login" className="inline-flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-500 font-display text-lg font-bold text-white">
              N
            </span>
            <span className="font-display text-xl font-semibold tracking-tight text-white">
              Nova Commerce
            </span>
          </Link>
          <p className="mt-16 max-w-md font-display text-3xl font-semibold leading-snug text-white xl:text-4xl">
            Shop with confidence. Trusted by thousands every day.
          </p>
          <p className="mt-4 max-w-md text-base leading-relaxed text-white/75">
            Secure checkout, genuine products, and support that actually responds — built for
            customers who expect more from online shopping.
          </p>
          <TrustBadges />
        </div>
        <p className="relative text-xs text-white/50">
          © {new Date().getFullYear()} Nova Commerce. PCI-aware payments · Privacy protected
        </p>
      </aside>

      <main className="flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-md animate-fade-up">
          <div className="mb-8 lg:hidden">
            <Link to="/login" className="inline-flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-900 font-display text-sm font-bold text-white">
                N
              </span>
              <span className="font-display text-lg font-semibold text-brand-950">Nova Commerce</span>
            </Link>
          </div>

          <header className="mb-8">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-brand-950">
              {title}
            </h1>
            <p className="mt-2 text-base text-stone-600">{subtitle}</p>
          </header>

          {children}

          <footer className="mt-8 text-center text-sm text-stone-600">{footer}</footer>

          <p className="mt-10 flex items-center justify-center gap-2 text-xs text-stone-500">
            <svg className="h-4 w-4 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Secure connection · We never store card details on this page
          </p>
        </div>
      </main>
    </div>
  )
}
