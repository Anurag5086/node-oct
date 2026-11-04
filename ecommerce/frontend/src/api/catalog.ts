import { apiUrl } from '../lib/apiConfig'
import type { Category, Product } from '../types/catalog'

async function parseJson<T>(response: Response): Promise<T | null> {
  try {
    return (await response.json()) as T
  } catch {
    return null
  }
}

export async function fetchCategories(): Promise<Category[]> {
  const response = await fetch(apiUrl('/api/category/get-all-categories'))
  const body = await parseJson<{ categories?: Category[] }>(response)

  if (!response.ok || !body?.categories) {
    return []
  }

  return body.categories
}

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(apiUrl('/api/product/get-all-products'))
  const body = await parseJson<{ products?: Product[] }>(response)

  if (!response.ok || !body?.products) {
    return []
  }

  return body.products
}

export async function fetchProductsByCategory(categoryId: string): Promise<Product[]> {
  const response = await fetch(
    apiUrl(`/api/product/get-all-products-for-category/${categoryId}`),
  )
  const body = await parseJson<{ products?: Product[] }>(response)

  if (!response.ok || !body?.products) {
    return []
  }

  return body.products
}
