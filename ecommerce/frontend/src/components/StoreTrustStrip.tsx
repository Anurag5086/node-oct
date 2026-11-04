const items = [
  { title: 'Secure checkout', detail: 'Encrypted payments' },
  { title: 'Verified sellers', detail: 'Identity-checked partners' },
  { title: 'Fast delivery', detail: 'Track every order' },
  { title: 'Easy returns', detail: '30-day policy' },
]

export function StoreTrustStrip() {
  return (
    <section className="border-y border-stone-200/80 bg-white">
      <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-6 sm:grid-cols-4 sm:px-6 lg:px-8">
        {items.map((item) => (
          <li key={item.title} className="flex gap-3">
            <span
              className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-500/10 text-accent-600"
              aria-hidden
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <div>
              <p className="text-sm font-semibold text-brand-950">{item.title}</p>
              <p className="text-xs text-stone-500">{item.detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
