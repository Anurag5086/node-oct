export type RazorpayHandlerResponse = {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

type RazorpayOptions = {
  key: string
  amount: number
  currency: string
  order_id: string
  name: string
  description: string
  prefill?: { name?: string; email?: string; contact?: string }
  handler: (response: RazorpayHandlerResponse) => void
  modal?: { ondismiss?: () => void }
  theme?: { color?: string }
}

type RazorpayInstance = {
  open: () => void
  on: (event: string, callback: () => void) => void
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance
  }
}

export function loadRazorpayScript(): Promise<NonNullable<typeof window.Razorpay>> {
  if (window.Razorpay) {
    return Promise.resolve(window.Razorpay)
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => {
      if (window.Razorpay) {
        resolve(window.Razorpay)
      } else {
        reject(new Error('Razorpay failed to load'))
      }
    }
    script.onerror = () => reject(new Error('Could not load Razorpay checkout'))
    document.body.appendChild(script)
  })
}
