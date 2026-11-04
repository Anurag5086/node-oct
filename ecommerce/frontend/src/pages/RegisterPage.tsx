import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthApiError, registerUser } from '../api/auth'
import { Alert } from '../components/Alert'
import { AuthLayout } from '../components/AuthLayout'
import { PasswordInput } from '../components/PasswordInput'
import { getPasswordChecks, isPasswordValid } from '../lib/passwordValidation'

export function RegisterPage() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const passwordChecks = useMemo(() => getPasswordChecks(password), [password])
  const passwordsMatch = password === confirmPassword || confirmPassword.length === 0

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (!acceptedTerms) {
      setError('Please accept the Terms of Service and Privacy Policy to continue.')
      return
    }

    if (!isPasswordValid(password)) {
      setError('Please choose a password that meets all security requirements.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const result = await registerUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      })
      navigate('/login', {
        replace: true,
        state: { message: result.message },
      })
    } catch (err) {
      if (err instanceof AuthApiError) {
        setError(err.message)
      } else {
        setError('Unable to reach the server. Is the backend running?')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join Nova Commerce for personalized recommendations and faster checkout."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-accent-600 hover:text-accent-500">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {error ? <Alert variant="error">{error}</Alert> : null}

        <div className="space-y-1.5">
          <label htmlFor="name" className="block text-sm font-medium text-brand-900">
            Full name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
            minLength={2}
            maxLength={50}
            className="block w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-brand-950 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
            placeholder="Alex Johnson"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-sm font-medium text-brand-900">
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            className="block w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-brand-950 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
            placeholder="you@example.com"
          />
        </div>

        <PasswordInput
          id="password"
          label="Password"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          required
          hint="Use 8+ characters with upper, lower, number, and symbol."
        />

        {password.length > 0 ? (
          <ul className="grid grid-cols-1 gap-1.5 rounded-xl border border-stone-200 bg-surface-muted/80 p-3 text-xs sm:grid-cols-2">
            {passwordChecks.map((check) => (
              <li
                key={check.id}
                className={`flex items-center gap-2 ${check.met ? 'text-emerald-700' : 'text-stone-500'}`}
              >
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
                    check.met ? 'bg-emerald-100' : 'bg-stone-200'
                  }`}
                  aria-hidden
                >
                  {check.met ? '✓' : '·'}
                </span>
                {check.label}
              </li>
            ))}
          </ul>
        ) : null}

        <PasswordInput
          id="confirmPassword"
          label="Confirm password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          autoComplete="new-password"
          required
        />
        {!passwordsMatch ? (
          <p className="text-sm text-red-600">Passwords do not match.</p>
        ) : null}

        <label className="flex cursor-pointer items-start gap-3 text-sm text-stone-600">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-stone-300 text-accent-600 focus:ring-accent-500/30"
            required
          />
          <span>
            I agree to the{' '}
            <span className="font-medium text-brand-900">Terms of Service</span> and{' '}
            <span className="font-medium text-brand-900">Privacy Policy</span>.
          </span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-xl bg-brand-900 px-4 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-accent-500/40 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </AuthLayout>
  )
}
