const badges = [
  {
    title: '256-bit encryption',
    description: 'Your credentials are protected in transit.',
  },
  {
    title: 'Verified sellers',
    description: 'Every merchant passes identity checks.',
  },
  {
    title: 'Easy returns',
    description: '30-day hassle-free return policy.',
  },
]

export function TrustBadges() {
  return (
    <ul className="mt-10 grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
      {badges.map((badge) => (
        <li
          key={badge.title}
          className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
        >
          <span
            className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-500/20 text-accent-400"
            aria-hidden
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </span>
          <div>
            <p className="font-semibold text-white">{badge.title}</p>
            <p className="mt-0.5 text-sm text-white/70">{badge.description}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}
