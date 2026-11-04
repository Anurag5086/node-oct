export function formatOrderNumber(orderId: string): string {
  const tail = orderId.slice(-8).toUpperCase()
  return `NOVA-${tail}`
}

export const ORDER_SUCCESS_STEPS = [
  { title: 'Order placed', detail: 'We received your COD request.' },
  { title: 'Confirmation', detail: 'Seller confirms items and stock.' },
  { title: 'Out for delivery', detail: 'Pay when your package arrives.' },
]
