import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import {
  createProduct,
  deleteProduct,
  fetchAdminCategories,
  fetchAdminProducts,
  updateProduct,
  type ProductInput,
} from '../../api/admin'
import { ApiError } from '../../api/httpClient'
import { Alert } from '../../components/Alert'
import { formatCurrency } from '../../lib/formatCurrency'
import type { Category, Product } from '../../types/catalog'
import { AdminPanel } from '../components/AdminPanel'

type FormState = {
  title: string
  description: string
  brand: string
  categoryId: string
  mrpPrice: string
  sellingPrice: string
  stockQty: string
  rating: string
  noOfReviews: string
  imagesText: string
  isActive: boolean
}

const emptyForm: FormState = {
  title: '',
  description: '',
  brand: '',
  categoryId: '',
  mrpPrice: '',
  sellingPrice: '',
  stockQty: '0',
  rating: '0',
  noOfReviews: '0',
  imagesText: '',
  isActive: true,
}

function categoryLabel(categoryId: Product['categoryId']): string {
  if (typeof categoryId === 'string') return categoryId
  return categoryId.title
}

function formToPayload(form: FormState): ProductInput {
  const images = form.imagesText
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)

  return {
    title: form.title.trim(),
    description: form.description.trim(),
    brand: form.brand.trim(),
    categoryId: form.categoryId,
    mrpPrice: Number(form.mrpPrice),
    sellingPrice: Number(form.sellingPrice),
    stockQty: Number(form.stockQty),
    rating: Number(form.rating) || 0,
    noOfReviews: Number(form.noOfReviews) || 0,
    images,
    isActive: form.isActive,
  }
}

export function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function loadData() {
    setLoading(true)
    setError(null)
    try {
      const [productList, categoryList] = await Promise.all([
        fetchAdminProducts(),
        fetchAdminCategories(),
      ])
      setProducts(productList)
      setCategories(categoryList)
      if (!form.categoryId && categoryList[0]) {
        setForm((f) => ({ ...f, categoryId: categoryList[0]._id }))
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadData()
  }, [])

  function startEdit(product: Product) {
    const categoryId =
      typeof product.categoryId === 'string' ? product.categoryId : product.categoryId._id
    setEditingId(product._id)
    setForm({
      title: product.title,
      description: product.description,
      brand: product.brand,
      categoryId,
      mrpPrice: String(product.mrpPrice),
      sellingPrice: String(product.sellingPrice),
      stockQty: String(product.stockQty),
      rating: String(product.rating ?? 0),
      noOfReviews: String(product.noOfReviews ?? 0),
      imagesText: (product.images ?? []).join('\n'),
      isActive: product.isActive !== false,
    })
  }

  function cancelEdit() {
    setEditingId(null)
    setForm({ ...emptyForm, categoryId: categories[0]?._id ?? '' })
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      const payload = formToPayload(form)
      if (payload.images.length < 1) {
        setError('Add at least one image URL (one per line).')
        setSaving(false)
        return
      }
      if (editingId) {
        await updateProduct(editingId, payload)
        setSuccess('Product updated.')
      } else {
        await createProduct(payload)
        setSuccess('Product created.')
      }
      cancelEdit()
      await loadData()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!window.confirm(`Delete product “${title}”?`)) return
    try {
      await deleteProduct(id)
      setSuccess('Product deleted.')
      if (editingId === id) cancelEdit()
      await loadData()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Delete failed')
    }
  }

  const inputClass =
    'w-full rounded-xl border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-brand-950">Products</h1>
        <p className="mt-1 text-stone-600">Manage catalog items with admin product APIs.</p>
      </div>

      {error ? <Alert variant="error">{error}</Alert> : null}
      {success ? <Alert variant="success">{success}</Alert> : null}

      <AdminPanel title={editingId ? 'Edit product' : 'Add product'}>
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Title</label>
            <input required className={inputClass} value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Brand</label>
            <input required className={inputClass} value={form.brand} onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))} />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-sm font-medium">Description</label>
            <textarea required rows={3} className={inputClass} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Category</label>
            <select required className={inputClass} value={form.categoryId} onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}>
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.title}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Stock quantity</label>
            <input required type="number" min={0} className={inputClass} value={form.stockQty} onChange={(e) => setForm((f) => ({ ...f, stockQty: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">MRP (₹)</label>
            <input required type="number" min={0} className={inputClass} value={form.mrpPrice} onChange={(e) => setForm((f) => ({ ...f, mrpPrice: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Selling price (₹)</label>
            <input required type="number" min={0} className={inputClass} value={form.sellingPrice} onChange={(e) => setForm((f) => ({ ...f, sellingPrice: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Rating (0–5)</label>
            <input type="number" min={0} max={5} step={0.1} className={inputClass} value={form.rating} onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Review count</label>
            <input type="number" min={0} className={inputClass} value={form.noOfReviews} onChange={(e) => setForm((f) => ({ ...f, noOfReviews: e.target.value }))} />
          </div>
          {editingId ? (
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} />
                Active on storefront
              </label>
            </div>
          ) : null}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-sm font-medium">Image URLs (one per line)</label>
            <textarea required rows={3} className={inputClass} value={form.imagesText} onChange={(e) => setForm((f) => ({ ...f, imagesText: e.target.value }))} placeholder="https://…" />
          </div>
          <div className="flex gap-2 md:col-span-2">
            <button type="submit" disabled={saving} className="rounded-xl bg-brand-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-60">
              {saving ? 'Saving…' : editingId ? 'Update product' : 'Create product'}
            </button>
            {editingId ? (
              <button type="button" onClick={cancelEdit} className="rounded-xl border border-stone-300 px-4 py-2.5 text-sm font-semibold">
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </AdminPanel>

      <AdminPanel title="All products">
        {loading ? (
          <p className="text-sm text-stone-500">Loading…</p>
        ) : products.length === 0 ? (
          <p className="text-sm text-stone-500">No products yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-stone-200 text-xs uppercase tracking-wide text-stone-500">
                <tr>
                  <th className="px-2 py-2">Product</th>
                  <th className="px-2 py-2">Category</th>
                  <th className="px-2 py-2">Price</th>
                  <th className="px-2 py-2">Stock</th>
                  <th className="px-2 py-2">Status</th>
                  <th className="px-2 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b border-stone-100">
                    <td className="px-2 py-3">
                      <p className="font-medium text-brand-950">{product.title}</p>
                      <p className="text-xs text-stone-500">{product.brand}</p>
                    </td>
                    <td className="px-2 py-3 text-stone-600">{categoryLabel(product.categoryId)}</td>
                    <td className="px-2 py-3">
                      <p className="font-medium">{formatCurrency(product.sellingPrice)}</p>
                      <p className="text-xs text-stone-400 line-through">{formatCurrency(product.mrpPrice)}</p>
                    </td>
                    <td className="px-2 py-3">{product.stockQty}</td>
                    <td className="px-2 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${product.isActive !== false ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-600'}`}>
                        {product.isActive !== false ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-right">
                      <button type="button" onClick={() => startEdit(product)} className="mr-2 font-semibold text-accent-600">Edit</button>
                      <button type="button" onClick={() => handleDelete(product._id, product.title)} className="font-semibold text-red-600">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminPanel>
    </div>
  )
}
