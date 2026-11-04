import type { Product } from '../types/catalog'
import type { BackendOrder, OrderProductLine } from '../types/order'

export function formatShippingAddress(parts: {
  name: string
  email: string
  phone: string
  address: string
  city: string
  pincode: string
}): string {
  return [
    parts.name,
    parts.phone,
    parts.email,
    parts.address,
    `${parts.city} ${parts.pincode}`,
  ].join('\n')
}

export function getProductFromLine(line: OrderProductLine): Product | null {
  return typeof line.product === 'object' ? line.product : null
}

export function orderItemCount(order: BackendOrder): number {
  return order.products.reduce((sum, line) => sum + line.quantity, 0)
}

export function orderMerchandiseSubtotal(order: BackendOrder): number {
  return order.products.reduce((sum, line) => {
    const product = getProductFromLine(line)
    const price = product?.sellingPrice ?? 0
    return sum + price * line.quantity
  }, 0)
}

export function orderDeliveryFee(order: BackendOrder): number {
  const merchandise = orderMerchandiseSubtotal(order)
  const fee = order.totalAmount - merchandise
  return fee > 0 ? fee : 0
}

export function orderCustomerName(order: BackendOrder): string {
  if (typeof order.userId === 'object' && order.userId?.name) {
    return order.userId.name
  }
  const firstLine = order.shippingAddress.split('\n')[0]
  return firstLine ?? 'Customer'
}

export function orderCustomerEmail(order: BackendOrder): string {
  if (typeof order.userId === 'object' && order.userId?.email) {
    return order.userId.email
  }
  const lines = order.shippingAddress.split('\n')
  return lines[2] ?? ''
}
