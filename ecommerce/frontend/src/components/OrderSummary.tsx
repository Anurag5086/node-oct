import type { ReactNode } from 'react'
import { FREE_DELIVERY_MIN } from '../lib/cartTotals'
import { formatCurrency } from '../lib/formatCurrency'

type OrderSummaryProps = {
  subtotal: number
  deliveryFee: number
  total: number
  itemCount: number
  action?: ReactNode
}

export function OrderSummary({
  subtotal,
  deliveryFee,
  total,
  itemCount,
  action,
}: OrderSummaryProps) {
  return (
    <aside className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <h2 className="font-display text-xl font-semibold text-brand-950">Order summary</h2>
      <p className="mt-1 text-sm text-stone-600">
        {itemCount} item{itemCount === 1 ? '' : 's'}
      </p>

      <dl className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-stone-600">Subtotal</dt>
          <dd className="font-medium text-brand-950">{formatCurrency(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-stone-600">Delivery</dt>
          <dd className="font-medium text-brand-950">
            {deliveryFee === 0 ? 'Free' : formatCurrency(deliveryFee)}
          </dd>
        </div>
        {subtotal > 0 && subtotal < FREE_DELIVERY_MIN ? (
          <p className="text-xs text-accent-600">
            Add {formatCurrency(FREE_DELIVERY_MIN - subtotal)} more for free delivery
          </p>
        ) : null}
        <div className="flex justify-between border-t border-stone-100 pt-3 text-base">
          <dt className="font-semibold text-brand-950">Total</dt>
          <dd className="font-bold text-brand-950">{formatCurrency(total)}</dd>
        </div>
      </dl>

      {action ? <div className="mt-5">{action}</div> : null}

      <p className="mt-4 flex items-start gap-2 text-xs text-stone-500">
        <svg className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Pay on delivery — no online payment required for COD orders.
      </p>
    </aside>
  )
}
