import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { createOrder } from '../api/orders'
import { createRazorpayOrder, verifyRazorpayCheckout } from '../api/payment'
import { ApiError } from '../api/httpClient'
import { useCart } from '../context/CartContext'
import { Alert } from '../components/Alert'
import { OrderSummary } from '../components/OrderSummary'
import { StoreFooter } from '../components/layout/StoreFooter'
import { StoreHeader } from '../components/layout/StoreHeader'
import { getStoredUser, getToken } from '../lib/authStorage'
import { formatCurrency } from '../lib/formatCurrency'
import { formatShippingAddress } from '../lib/orderHelpers'
import { loadRazorpayScript, type RazorpayHandlerResponse } from '../lib/razorpay'

type PaymentMethod = 'COD' | 'Razorpay'

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
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD')
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

  function buildCartPayload() {
    return items.map((item) => ({
      product: item.productId,
      quantity: item.quantity,
    }))
  }

  function buildShippingAddress(phoneNumber: string) {
    return formatShippingAddress({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phoneNumber,
      address: address.trim(),
      city: city.trim(),
      pincode: pincode.trim(),
    })
  }

  function validateAddress(): string | null {
    const trimmedPhone = phone.trim()
    if (!/^\d{10}$/.test(trimmedPhone)) {
      setError('Enter a valid 10-digit phone number.')
      return null
    }
    if (!name.trim() || !email.trim() || !address.trim() || !city.trim() || !/^\d{6}$/.test(pincode.trim())) {
      setError('Please complete all delivery fields before continuing.')
      return null
    }
    return trimmedPhone
  }

  async function handleRazorpay() {
    const validPhone = validateAddress()
    if (!validPhone) return

    setPlacing(true)
    setError(null)

    const cartPayload = buildCartPayload()
    const shippingAddress = buildShippingAddress(validPhone)

    try {
      const rp = await createRazorpayOrder({ items: cartPayload })
      const RazorpayCtor = await loadRazorpayScript()

      await new Promise<void>((resolve, reject) => {
        const options = {
          key: rp.keyId,
          amount: rp.amount,
          currency: rp.currency || 'INR',
          order_id: rp.orderId,
          name: 'Nova Commerce',
          description: 'Order payment',
          prefill: {
            name: user?.name ?? name.trim(),
            email: user?.email ?? email.trim(),
            contact: validPhone,
          },
          handler: async (response: RazorpayHandlerResponse) => {
            try {
              const result = await verifyRazorpayCheckout({
                items: cartPayload,
                shippingAddress,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              })
              const lineItems = items.map((item) => ({ ...item }))
              setOrderPlaced(true)
              navigate(`/order/success/${result.order._id}`, {
                replace: true,
                state: {
                  order: result.order,
                  justPlaced: true,
                  lineItems,
                  paymentMethod: 'Razorpay' as const,
                },
              })
              resolve()
            } catch (err) {
              reject(err)
            }
          },
          modal: {
            ondismiss: () => reject(new Error('Payment cancelled')),
          },
          theme: { color: '#c25c3e' },
        }

        const rz = new RazorpayCtor(options)
        rz.on('payment.failed', () => reject(new Error('Payment failed')))
        rz.open()
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Payment error'
      if (!message.includes('cancelled')) {
        if (err instanceof ApiError) {
          setError(err.message)
        } else {
          setError(message)
        }
      }
      setOrderPlaced(false)
    } finally {
      setPlacing(false)
    }
  }

  async function handlePlaceOrder(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (paymentMethod === 'Razorpay') {
      await handleRazorpay()
      return
    }

    const validPhone = validateAddress()
    if (!validPhone) return

    setPlacing(true)

    try {
      const shippingAddress = buildShippingAddress(validPhone)

      const order = await createOrder({
        products: buildCartPayload(),
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

  const paymentSummaryNote =
    paymentMethod === 'Razorpay'
      ? 'You will pay securely online via Razorpay (UPI, cards, netbanking).'
      : 'Pay on delivery — no online payment required for COD orders.'

  return (
    <div className="min-h-screen bg-surface">
      <StoreHeader compact />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-semibold text-brand-950">Checkout</h1>
        <p className="mt-1 text-stone-600">Complete delivery details and choose how you want to pay.</p>

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
              <p className="mt-1 text-sm text-stone-600">Choose Cash on Delivery or pay online with Razorpay.</p>

              <div className="mt-4 space-y-3">
                <label
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 ${
                    paymentMethod === 'COD'
                      ? 'border-accent-500 bg-accent-500/5'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-semibold text-brand-950">Cash on Delivery (COD)</p>
                    <p className="mt-1 text-sm text-stone-600">
                      Pay with cash or UPI when your order arrives. Our delivery partner will confirm the amount.
                    </p>
                  </div>
                </label>

                <label
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 ${
                    paymentMethod === 'Razorpay'
                      ? 'border-accent-500 bg-accent-500/5'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'Razorpay'}
                    onChange={() => setPaymentMethod('Razorpay')}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-semibold text-brand-950">Pay online (Razorpay)</p>
                    <p className="mt-1 text-sm text-stone-600">
                      UPI, debit/credit cards, and net banking. Your order is confirmed after successful payment.
                    </p>
                  </div>
                </label>
              </div>
            </section>

            <button
              type="submit"
              disabled={placing}
              className="w-full rounded-xl bg-brand-900 px-4 py-3.5 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-60 sm:w-auto sm:min-w-[16rem]"
            >
              {placing
                ? paymentMethod === 'Razorpay'
                  ? 'Opening payment…'
                  : 'Placing order…'
                : paymentMethod === 'Razorpay'
                  ? `Pay ${formatCurrency(total)} · Razorpay`
                  : 'Place order · COD'}
            </button>
          </form>

          <OrderSummary
            subtotal={subtotal}
            deliveryFee={deliveryFee}
            total={total}
            itemCount={itemCount}
            paymentNote={paymentSummaryNote}
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
