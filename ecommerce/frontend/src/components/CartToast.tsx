import { useEffect } from 'react'
import { useCart } from '../context/CartContext'

export function CartToast() {
  const { notice, clearNotice } = useCart()

  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(clearNotice, 3200)
    return () => window.clearTimeout(timer)
  }, [notice, clearNotice])

  if (!notice) return null

  const styles =
    notice.type === 'success'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
      : 'border-red-200 bg-red-50 text-red-900'

  return (
    <div
      role="status"
      className={`fixed bottom-6 left-1/2 z-[100] w-[min(92vw,24rem)] -translate-x-1/2 rounded-xl border px-4 py-3 text-sm font-medium shadow-lg ${styles}`}
    >
      {notice.message}
    </div>
  )
}
