import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { discountPercent, formatCurrency } from '../lib/formatCurrency'
import type { AssistantMentionedProduct } from '../types/assistant'
import type { Product } from '../types/catalog'

type AssistantProductCardProps = {
  product: AssistantMentionedProduct
}

function toCartProduct(product: AssistantMentionedProduct): Product {
  return {
    _id: product._id,
    title: product.title,
    description: '',
    images: product.images ?? [],
    stockQty: product.stockQty ?? product.stockQuantity ?? 0,
    mrpPrice: product.mrpPrice,
    sellingPrice: product.sellingPrice,
    rating: 0,
    noOfReviews: 0,
    brand: product.brand,
    categoryId: '',
  }
}

export function AssistantProductCard({ product }: AssistantProductCardProps) {
  const { addToBag } = useCart()
  const [imageError, setImageError] = useState(false)
  const stock = product.stockQty ?? product.stockQuantity ?? 0
  const inStock = stock > 0
  const imageUrl = product.images?.[0]
  const discount = discountPercent(product.mrpPrice, product.sellingPrice)

  return (
    <article className="flex min-w-[220px] max-w-[240px] shrink-0 flex-col overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
      <div className="relative aspect-[4/3] bg-surface-muted">
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={product.title}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-brand-800 to-brand-950 font-display text-xl font-semibold text-white">
            {product.brand.slice(0, 1)}
          </div>
        )}
        {discount > 0 ? (
          <span className="absolute left-2 top-2 rounded-full bg-accent-600 px-2 py-0.5 text-[10px] font-semibold text-white">
            {discount}% off
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-3">
        <p className="text-[10px] font-medium uppercase tracking-wide text-accent-600">{product.brand}</p>
        <h4 className="mt-0.5 line-clamp-2 text-xs font-semibold leading-snug text-brand-950">
          {product.title}
        </h4>
        <div className="mt-2 flex items-baseline gap-2">
          <p className="text-sm font-bold text-brand-950">{formatCurrency(product.sellingPrice)}</p>
          {product.mrpPrice > product.sellingPrice ? (
            <p className="text-xs text-stone-400 line-through">{formatCurrency(product.mrpPrice)}</p>
          ) : null}
        </div>
        <button
          type="button"
          disabled={!inStock}
          onClick={() => addToBag(toCartProduct(product))}
          className="mt-auto rounded-lg bg-brand-900 px-2.5 py-1.5 text-[11px] font-semibold text-white hover:bg-brand-800 disabled:cursor-not-allowed disabled:bg-stone-300"
        >
          {inStock ? 'Add to bag' : 'Out of stock'}
        </button>
      </div>
    </article>
  )
}
