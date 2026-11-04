import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import {
  createCategory,
  deleteCategory,
  fetchAdminCategories,
  updateCategory,
} from '../../api/admin'
import { ApiError } from '../../api/httpClient'
import { Alert } from '../../components/Alert'
import type { Category } from '../../types/catalog'
import { AdminPanel } from '../components/AdminPanel'

type FormState = { title: string; description: string; isActive: boolean }

const emptyForm: FormState = { title: '', description: '', isActive: true }

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function loadCategories() {
    setLoading(true)
    setError(null)
    try {
      setCategories(await fetchAdminCategories())
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  function startEdit(category: Category) {
    setEditingId(category._id)
    setForm({
      title: category.title,
      description: category.description,
      isActive: category.isActive ?? true,
    })
    setSuccess(null)
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(emptyForm)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      if (editingId) {
        await updateCategory(editingId, form)
        setSuccess('Category updated.')
      } else {
        await createCategory({ title: form.title, description: form.description })
        setSuccess('Category created.')
      }
      cancelEdit()
      await loadCategories()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!window.confirm(`Delete category “${title}”?`)) return
    setError(null)
    try {
      await deleteCategory(id)
      setSuccess('Category deleted.')
      if (editingId === id) cancelEdit()
      await loadCategories()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Delete failed')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-brand-950">Categories</h1>
        <p className="mt-1 text-stone-600">Create and manage categories via admin category APIs.</p>
      </div>

      {error ? <Alert variant="error">{error}</Alert> : null}
      {success ? <Alert variant="success">{success}</Alert> : null}

      <AdminPanel
        title={editingId ? 'Edit category' : 'Add category'}
        description="Uses POST / create and PUT / update category endpoints."
      >
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5 md:col-span-1">
            <label className="text-sm font-medium text-brand-900">Title</label>
            <input
              required
              minLength={3}
              maxLength={100}
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full rounded-xl border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
            />
          </div>
          {editingId ? (
            <div className="flex items-end md:col-span-1">
              <label className="flex items-center gap-2 text-sm text-stone-700">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                />
                Active on storefront
              </label>
            </div>
          ) : null}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-sm font-medium text-brand-900">Description</label>
            <textarea
              required
              minLength={3}
              maxLength={500}
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full rounded-xl border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
            />
          </div>
          <div className="flex gap-2 md:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-brand-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-60"
            >
              {saving ? 'Saving…' : editingId ? 'Update category' : 'Create category'}
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-xl border border-stone-300 px-4 py-2.5 text-sm font-semibold text-brand-900"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </AdminPanel>

      <AdminPanel title="All categories" description="Includes inactive categories for admin review.">
        {loading ? (
          <p className="text-sm text-stone-500">Loading…</p>
        ) : categories.length === 0 ? (
          <p className="text-sm text-stone-500">No categories yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-stone-200 text-xs uppercase tracking-wide text-stone-500">
                <tr>
                  <th className="px-2 py-2">Title</th>
                  <th className="px-2 py-2">Description</th>
                  <th className="px-2 py-2">Status</th>
                  <th className="px-2 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category._id} className="border-b border-stone-100">
                    <td className="px-2 py-3 font-medium text-brand-950">{category.title}</td>
                    <td className="max-w-xs truncate px-2 py-3 text-stone-600">{category.description}</td>
                    <td className="px-2 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          category.isActive !== false
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {category.isActive !== false ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => startEdit(category)}
                        className="mr-2 text-sm font-semibold text-accent-600 hover:text-accent-500"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(category._id, category.title)}
                        className="text-sm font-semibold text-red-600 hover:text-red-500"
                      >
                        Delete
                      </button>
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
