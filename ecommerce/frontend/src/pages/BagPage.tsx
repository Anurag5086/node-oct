import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { getToken } from '../lib/authStorage'
import { OrderSummary } from '../components/OrderSummary'
import { formatCurrency } from '../lib/formatCurrency'
import { StoreFooter } from '../components/layout/StoreFooter'
import { StoreHeader } from '../components/layout/StoreHeader'

export function BagPage() {
  const { items, itemCount, subtotal, deliveryFee, total, setQuantity, removeFromBag } =
    useCart()
  const signedIn = Boolean(getToken())

  return (
    <div className="min-h-screen bg-surface">
      <StoreHeader compact />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-semibold text-brand-950">Your bag</h1>
        <p className="mt-1 text-stone-600">Review items before checkout with Cash on Delivery.</p>

        {items.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
            <p className="font-display text-xl font-semibold text-brand-950">Your bag is empty</p>
            <p className="mt-2 text-sm text-stone-600">Browse the storefront and add products you love.</p>
            <Link
              to="/"
              className="mt-6 inline-flex rounded-xl bg-brand-900 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-800"
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem]">
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.productId}
                  className="flex gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm"
                >
                  <div className="h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-surface-muted">
                    {item.image ? (
                      <img src={item.image} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-brand-900 text-sm font-bold text-white">
                        {item.brand.slice(0, 1)}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-accent-600">
                      {item.brand}
                    </p>
                    <p className="font-semibold text-brand-950">{item.title}</p>
                    <p className="mt-1 text-sm font-bold">{formatCurrency(item.sellingPrice)}</p>

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <label className="flex items-center gap-2 text-sm text-stone-600">
                        Qty
                        <select
                          value={item.quantity}
                          onChange={(e) => setQuantity(item.productId, Number(e.target.value))}
                          className="rounded-lg border border-stone-300 px-2 py-1 text-sm"
                        >
                          {Array.from({ length: item.maxStock }, (_, i) => i + 1).map((n) => (
                            <option key={n} value={n}>
                              {n}
                            </option>
                          ))}
                        </select>
                      </label>
                      <button
                        type="button"
                        onClick={() => removeFromBag(item.productId)}
                        className="text-sm font-semibold text-red-600 hover:text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-brand-950">
                    {formatCurrency(item.sellingPrice * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>

            <OrderSummary
              subtotal={subtotal}
              deliveryFee={deliveryFee}
              total={total}
              itemCount={itemCount}
              action={
                signedIn ? (
                  <Link
                    to="/checkout"
                    className="flex w-full items-center justify-center rounded-xl bg-brand-900 px-4 py-3.5 text-sm font-semibold text-white hover:bg-brand-800"
                  >
                    Proceed to checkout
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    state={{ from: '/checkout' }}
                    className="flex w-full items-center justify-center rounded-xl bg-brand-900 px-4 py-3.5 text-sm font-semibold text-white hover:bg-brand-800"
                  >
                    Sign in to checkout
                  </Link>
                )
              }
            />
          </div>
        )}
      </div>

      <StoreFooter />
    </div>
  )
}
