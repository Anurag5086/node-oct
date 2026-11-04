import type { ReactNode } from 'react'

type AdminPanelProps = {
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
}

export function AdminPanel({ title, description, action, children }: AdminPanelProps) {
  return (
    <section className="rounded-2xl border border-stone-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-stone-100 px-5 py-4">
        <div>
          <h2 className="font-display text-xl font-semibold text-brand-950">{title}</h2>
          {description ? <p className="mt-1 text-sm text-stone-600">{description}</p> : null}
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  )
}
