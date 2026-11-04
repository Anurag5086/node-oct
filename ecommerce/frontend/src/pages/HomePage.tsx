import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import heroImage from '../assets/hero.png'
import { fetchCategories, fetchProducts, fetchProductsByCategory } from '../api/catalog'
import { ProductCard } from '../components/ProductCard'
import { ProductGridSkeleton } from '../components/ProductGridSkeleton'
import { StoreFooter } from '../components/layout/StoreFooter'
import { StoreHeader } from '../components/layout/StoreHeader'
import { StoreTrustStrip } from '../components/StoreTrustStrip'
import type { Category, Product } from '../types/catalog'

export function HomePage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loadingCatalog, setLoadingCatalog] = useState(true)
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const loadProducts = useCallback(async (categoryId: string | null) => {
    setLoadingProducts(true)
    setFetchError(null)
    try {
      const list = categoryId ? await fetchProductsByCategory(categoryId) : await fetchProducts()
      setProducts(list)
    } catch {
      setFetchError('Could not load products. Check that your backend is running.')
      setProducts([])
    } finally {
      setLoadingProducts(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function loadInitial() {
      setLoadingCatalog(true)
      setFetchError(null)
      try {
        const categoryList = await fetchCategories()
        if (cancelled) return
        setCategories(categoryList)
      } catch {
        if (!cancelled) {
          setFetchError('Could not reach the store API. Start the backend and refresh.')
        }
      } finally {
        if (!cancelled) setLoadingCatalog(false)
      }
    }

    loadInitial()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (loadingCatalog) return
    loadProducts(selectedCategoryId)
  }, [selectedCategoryId, loadingCatalog, loadProducts])

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return products
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    )
  }, [products, searchQuery])

  const selectedCategory = categories.find((c) => c._id === selectedCategoryId)

  return (
    <div className="min-h-screen bg-surface">
      <StoreHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <section className="relative overflow-hidden bg-brand-950 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              'radial-gradient(circle at 15% 50%, #0d9488 0%, transparent 42%), radial-gradient(circle at 85% 20%, #2dd4bf 0%, transparent 38%)',
          }}
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
          <div className="animate-fade-up">
            <p className="text-sm font-medium uppercase tracking-widest text-accent-400">
              Trusted marketplace
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-tight sm:text-5xl">
              Quality you can see. Prices you can trust.
            </h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-white/75">
              Discover top-rated products from verified brands — secure checkout, honest reviews,
              and delivery updates at every step.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#shop"
                className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-brand-950 hover:bg-white/90"
              >
                Shop bestsellers
              </a>
              <a
                href="#categories"
                className="rounded-xl border border-white/25 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Browse categories
              </a>
            </div>
          </div>
          <div className="relative animate-fade-up lg:justify-self-end">
            <div className="overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-black/30">
              <img
                src={heroImage}
                alt="Featured products from Nova Commerce"
                className="aspect-[4/3] w-full max-w-xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <StoreTrustStrip />

      <section id="categories" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold text-brand-950 sm:text-3xl">
              Shop by category
            </h2>
            <p className="mt-1 text-stone-600">Curated collections from your catalog API</p>
          </div>
        </div>

        {loadingCatalog ? (
          <div className="mt-6 flex gap-3 overflow-hidden">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="h-24 w-48 shrink-0 animate-pulse rounded-2xl bg-stone-200" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <p className="mt-6 rounded-2xl border border-dashed border-stone-300 bg-white p-6 text-sm text-stone-600">
            No categories yet. Add active categories in the admin backend to show them here.
          </p>
        ) : (
          <div className="mt-6 flex gap-3 overflow-x-auto pb-2">
            <button
              type="button"
              onClick={() => setSelectedCategoryId(null)}
              className={`shrink-0 rounded-2xl border px-5 py-4 text-left transition ${
                selectedCategoryId === null
                  ? 'border-brand-900 bg-brand-900 text-white'
                  : 'border-stone-200 bg-white text-brand-950 hover:border-accent-500/40'
              }`}
            >
              <span className="block text-sm font-semibold">All products</span>
              <span className="mt-1 block text-xs opacity-80">Full catalog</span>
            </button>
            {categories.map((category) => (
              <button
                key={category._id}
                type="button"
                onClick={() => setSelectedCategoryId(category._id)}
                className={`max-w-xs shrink-0 rounded-2xl border px-5 py-4 text-left transition ${
                  selectedCategoryId === category._id
                    ? 'border-brand-900 bg-brand-900 text-white'
                    : 'border-stone-200 bg-white text-brand-950 hover:border-accent-500/40'
                }`}
              >
                <span className="block text-sm font-semibold">{category.title}</span>
                <span className="mt-1 line-clamp-2 block text-xs opacity-80">{category.description}</span>
              </button>
            ))}
          </div>
        )}
      </section>

      <section id="shop" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold text-brand-950 sm:text-3xl">
              {selectedCategory ? selectedCategory.title : 'Featured products'}
            </h2>
            <p className="mt-1 text-stone-600">
              {filteredProducts.length} item{filteredProducts.length === 1 ? '' : 's'}
              {searchQuery ? ` matching “${searchQuery.trim()}”` : ''}
            </p>
          </div>
        </div>

        {fetchError ? (
          <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {fetchError}
          </p>
        ) : null}

        <div className="mt-8">
          {loadingCatalog || loadingProducts ? (
            <ProductGridSkeleton />
          ) : filteredProducts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
              <p className="font-display text-xl font-semibold text-brand-950">Nothing to show yet</p>
              <p className="mx-auto mt-2 max-w-md text-sm text-stone-600">
                {searchQuery
                  ? 'Try a different search term or clear the filter.'
                  : 'Add active products in your backend, or pick another category.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-brand-900 to-brand-800 px-8 py-10 text-white sm:px-12">
          <div className="max-w-xl">
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">Members save more</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/75">
              Create a free account for faster checkout, order history, and early access to drops.
            </p>
            <Link
              to="/register"
              className="mt-6 inline-flex rounded-xl bg-accent-500 px-5 py-3 text-sm font-semibold text-brand-950 hover:bg-accent-400"
            >
              Join Nova Commerce
            </Link>
          </div>
        </div>
      </section>

      <StoreFooter />
    </div>
  )
}
