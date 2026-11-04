import type { ReactNode } from 'react'

type AlertProps = {
  variant: 'error' | 'success' | 'info'
  title?: string
  children: ReactNode
}

const styles = {
  error: 'border-red-200 bg-red-50 text-red-900',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  info: 'border-sky-200 bg-sky-50 text-sky-900',
}

export function Alert({ variant, title, children }: AlertProps) {
  return (
    <div
      role="alert"
      className={`rounded-xl border px-4 py-3 text-sm leading-relaxed ${styles[variant]}`}
    >
      {title ? <p className="mb-0.5 font-semibold">{title}</p> : null}
      <p className={title ? 'opacity-90' : undefined}>{children}</p>
    </div>
  )
}
