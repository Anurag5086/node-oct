import type { BackendOrder, CreateOrderPayload, OrderStatus } from '../types/order'
import { authFetch } from './httpClient'

type OrderResponse = BackendOrder & { id?: string }

function normalizeOrder(raw: OrderResponse): BackendOrder {
  const id = raw._id ?? raw.id
  if (!id) {
    throw new Error('Order ID missing from server response')
  }
  return { ...raw, _id: String(id) }
}

export async function createOrder(payload: CreateOrderPayload): Promise<BackendOrder> {
  const body = await authFetch<{ order?: OrderResponse }>('/api/order/create-order', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  if (!body.order) {
    throw new Error('Order was not returned from server')
  }
  return normalizeOrder(body.order)
}

export async function fetchOrderById(id: string): Promise<BackendOrder> {
  const body = await authFetch<{ order: BackendOrder }>(`/api/order/get-order-by-id/${id}`)
  if (!body.order) {
    throw new Error('Order not found')
  }
  return body.order
}

export async function fetchUserOrders(): Promise<BackendOrder[]> {
  const body = await authFetch<{ orders?: BackendOrder[] }>('/api/order/get-all-order-user')
  return body.orders ?? []
}

export async function fetchAdminOrders(): Promise<BackendOrder[]> {
  const body = await authFetch<{ orders?: BackendOrder[] }>('/api/order/get-all-orders')
  return body.orders ?? []
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<BackendOrder> {
  const body = await authFetch<{ updatedOrder: BackendOrder }>(
    `/api/order/update-order-status/${orderId}`,
    {
      method: 'PUT',
      body: JSON.stringify({ status }),
    },
  )
  if (!body.updatedOrder) {
    throw new Error('Updated order not returned')
  }
  return body.updatedOrder
}
