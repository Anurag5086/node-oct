import type { Category, Product } from '../types/catalog'
import type { StoredUser } from '../lib/authStorage'
import { ApiError, authFetch } from './httpClient'

export async function fetchCurrentUser(): Promise<StoredUser | null> {
  try {
    const body = await authFetch<{ user?: StoredUser & { roles?: string } }>('/api/user/get-user')
    if (!body.user) return null
    const { roles, role, ...rest } = body.user
    return { ...rest, role: role ?? roles, roles: roles ?? role }
  } catch {
    return null
  }
}

export async function fetchAdminCategories(): Promise<Category[]> {
  try {
    const body = await authFetch<{ categories?: Category[] }>(
      '/api/category/get-all-categories-admin',
    )
    return body.categories ?? []
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return []
    throw err
  }
}

export async function createCategory(payload: { title: string; description: string }) {
  return authFetch<{ category: Category }>('/api/category/create-category', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function updateCategory(
  id: string,
  payload: { title: string; description: string; isActive?: boolean },
) {
  return authFetch('/api/category/update-category/' + id, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export async function deleteCategory(id: string) {
  return authFetch('/api/category/delete-category/' + id, { method: 'DELETE' })
}

export async function fetchAdminProducts(): Promise<Product[]> {
  try {
    const body = await authFetch<{ products?: Product[] }>('/api/product/get-all-products-admin')
    return body.products ?? []
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return []
    throw err
  }
}

export type ProductInput = {
  title: string
  description: string
  mrpPrice: number
  sellingPrice: number
  images: string[]
  categoryId: string
  stockQty: number
  rating?: number
  noOfReviews?: number
  brand: string
  isActive?: boolean
}

export async function createProduct(payload: ProductInput) {
  return authFetch<{ product: Product }>('/api/product/create-product', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function updateProduct(id: string, payload: ProductInput) {
  return authFetch<{ product: Product }>('/api/product/update-product/' + id, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export async function deleteProduct(id: string) {
  return authFetch('/api/product/delete-product/' + id, { method: 'DELETE' })
}

export type AdminUserRow = StoredUser & {
  phoneNumber?: string
  address?: string
  roles?: string
  createdAt?: string
}

export async function fetchAdminUsers(): Promise<AdminUserRow[]> {
  try {
    const body = await authFetch<{ users?: AdminUserRow[] }>('/api/user/get-all-users')
    return body.users ?? []
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return []
    throw err
  }
}
