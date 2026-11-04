import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { discountPercent, formatCurrency } from '../lib/formatCurrency'
import type { Product } from '../types/catalog'
import { StarRating } from './StarRating'

type ProductCardProps = {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToBag } = useCart()
  const [imageError, setImageError] = useState(false)
  const imageUrl = product.images?.[0]
  const discount = discountPercent(product.mrpPrice, product.sellingPrice)
  const inStock = product.stockQty > 0

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[4/5] overflow-hidden bg-surface-muted">
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={product.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-brand-800 to-brand-950 px-4 text-center text-white">
            <span className="font-display text-2xl font-semibold">{product.brand.slice(0, 1)}</span>
            <p className="mt-2 text-xs text-white/70">{product.brand}</p>
          </div>
        )}
        {discount > 0 ? (
          <span className="absolute left-3 top-3 rounded-full bg-accent-600 px-2.5 py-1 text-xs font-semibold text-white">
            {discount}% off
          </span>
        ) : null}
        {!inStock ? (
          <span className="absolute right-3 top-3 rounded-full bg-stone-900/80 px-2.5 py-1 text-xs font-medium text-white">
            Out of stock
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-accent-600">{product.brand}</p>
        <h3 className="mt-1 line-clamp-2 font-semibold leading-snug text-brand-950">{product.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-stone-600">{product.description}</p>

        <div className="mt-3">
          <StarRating rating={product.rating} reviewCount={product.noOfReviews} compact />
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div>
            <p className="text-lg font-bold text-brand-950">{formatCurrency(product.sellingPrice)}</p>
            {product.mrpPrice > product.sellingPrice ? (
              <p className="text-sm text-stone-400 line-through">{formatCurrency(product.mrpPrice)}</p>
            ) : null}
          </div>
          <button
            type="button"
            disabled={!inStock}
            onClick={() => addToBag(product)}
            className="rounded-xl bg-brand-900 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:bg-stone-300"
          >
            {inStock ? 'Add to bag' : 'Notify me'}
          </button>
        </div>
      </div>
    </article>
  )
}
