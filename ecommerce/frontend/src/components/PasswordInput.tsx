import { useState } from 'react'

type PasswordInputProps = {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  autoComplete?: string
  required?: boolean
  hint?: string
}

export function PasswordInput({
  id,
  label,
  value,
  onChange,
  autoComplete = 'current-password',
  required,
  hint,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-brand-900">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          required={required}
          className="block w-full rounded-xl border border-stone-300 bg-white px-4 py-3 pr-12 text-brand-950 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
          placeholder="••••••••"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-sm font-medium text-stone-500 hover:text-brand-800"
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? 'Hide' : 'Show'}
        </button>
      </div>
      {hint ? <p className="text-xs text-stone-500">{hint}</p> : null}
    </div>
  )
}
