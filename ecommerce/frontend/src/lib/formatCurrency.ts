const formatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

export function formatCurrency(amount: number): string {
  return formatter.format(amount)
}

export function discountPercent(mrp: number, selling: number): number {
  if (mrp <= 0 || selling >= mrp) return 0
  return Math.round(((mrp - selling) / mrp) * 100)
}
