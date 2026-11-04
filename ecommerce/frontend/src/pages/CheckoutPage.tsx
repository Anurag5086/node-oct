import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { createOrder } from '../api/orders'
import { ApiError } from '../api/httpClient'
import { useCart } from '../context/CartContext'
import { Alert } from '../components/Alert'
import { OrderSummary } from '../components/OrderSummary'
import { StoreFooter } from '../components/layout/StoreFooter'
import { StoreHeader } from '../components/layout/StoreHeader'
import { getStoredUser, getToken } from '../lib/authStorage'
import { formatShippingAddress } from '../lib/orderHelpers'

export function CheckoutPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = getStoredUser()
  const token = getToken()
  const { items, itemCount, subtotal, deliveryFee, total } = useCart()

  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [phone, setPhone] = useState(user?.phoneNumber ?? '')
  const [address, setAddress] = useState(user?.address ?? '')
  const [city, setCity] = useState('')
  const [pincode, setPincode] = useState('')
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  /** Prevents empty-bag redirect while navigating to order success after place order */
  const [orderPlaced, setOrderPlaced] = useState(false)

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (items.length === 0 && !orderPlaced && !placing) {
    return <Navigate to="/bag" replace />
  }

  async function handlePlaceOrder(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setPlacing(true)

    try {
      const shippingAddress = formatShippingAddress({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
        pincode: pincode.trim(),
      })

      const order = await createOrder({
        products: items.map((item) => ({
          product: item.productId,
          quantity: item.quantity,
        })),
        totalAmount: total,
        paymentMethod: 'COD',
        shippingAddress,
      })

      const lineItems = items.map((item) => ({ ...item }))
      setOrderPlaced(true)
      navigate(`/order/success/${order._id}`, {
        replace: true,
        state: { order, justPlaced: true, lineItems },
      })
    } catch (err) {
      setOrderPlaced(false)
      if (err instanceof ApiError) {
        setError(err.message)
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Could not place order. Please try again.')
      }
    } finally {
      setPlacing(false)
    }
  }

  const inputClass =
    'w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20'

  return (
    <div className="min-h-screen bg-surface">
      <StoreHeader compact />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-semibold text-brand-950">Checkout</h1>
        <p className="mt-1 text-stone-600">Complete delivery details and confirm Cash on Delivery.</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem]">
          <form onSubmit={handlePlaceOrder} className="space-y-6">
            {error ? <Alert variant="error">{error}</Alert> : null}

            <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              <h2 className="font-display text-lg font-semibold text-brand-950">Delivery details</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-sm font-medium">Full name</label>
                  <input required className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Email</label>
                  <input required type="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Phone (10 digits)</label>
                  <input
                    required
                    pattern="\d{10}"
                    title="Enter a 10-digit mobile number"
                    className={inputClass}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-sm font-medium">Address</label>
                  <textarea required rows={2} className={inputClass} value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">City</label>
                  <input required className={inputClass} value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">PIN code</label>
                  <input required pattern="\d{6}" title="6-digit PIN code" className={inputClass} value={pincode} onChange={(e) => setPincode(e.target.value)} />
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              <h2 className="font-display text-lg font-semibold text-brand-950">Payment</h2>
              <p className="mt-1 text-sm text-stone-600">Your order will be created on the server with payment method COD.</p>

              <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border-2 border-accent-500 bg-accent-500/5 p-4">
                <input type="radio" name="payment" checked readOnly className="mt-1" />
                <div>
                  <p className="font-semibold text-brand-950">Cash on Delivery (COD)</p>
                  <p className="mt-1 text-sm text-stone-600">
                    Pay with cash or UPI when your order arrives. Our delivery partner will confirm the amount.
                  </p>
                </div>
              </label>
            </section>

            <button
              type="submit"
              disabled={placing}
              className="w-full rounded-xl bg-brand-900 px-4 py-3.5 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-60 sm:w-auto sm:min-w-[16rem]"
            >
              {placing ? 'Placing order…' : 'Place order · COD'}
            </button>
          </form>

          <OrderSummary
            subtotal={subtotal}
            deliveryFee={deliveryFee}
            total={total}
            itemCount={itemCount}
            action={
              <Link to="/bag" className="block text-center text-sm font-semibold text-accent-600 hover:text-accent-500">
                Edit bag
              </Link>
            }
          />
        </div>
      </div>

      <StoreFooter />
    </div>
  )
}
