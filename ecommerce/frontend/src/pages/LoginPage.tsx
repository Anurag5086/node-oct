import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AuthApiError, loginUser } from '../api/auth'
import { Alert } from '../components/Alert'
import { AuthLayout } from '../components/AuthLayout'
import { PasswordInput } from '../components/PasswordInput'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const locationState = location.state as { message?: string; from?: string } | null
  const registeredMessage = locationState?.message
  const redirectTo = locationState?.from ?? '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(registeredMessage ?? null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      const result = await loginUser({ email: email.trim().toLowerCase(), password })
      setSuccess(`${result.message} Redirecting…`)
      window.setTimeout(() => navigate(redirectTo, { replace: true }), 800)
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
      title="Welcome back"
      subtitle="Sign in to track orders, save favorites, and checkout faster."
      footer={
        <>
          New here?{' '}
          <Link to="/register" className="font-semibold text-accent-600 hover:text-accent-500">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {success ? <Alert variant="success">{success}</Alert> : null}
        {error ? <Alert variant="error">{error}</Alert> : null}

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
          autoComplete="current-password"
          required
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex cursor-pointer items-center gap-2 text-stone-600">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-stone-300 text-accent-600 focus:ring-accent-500/30"
            />
            Remember me
          </label>
          <span className="text-stone-400" title="Coming soon">
            Forgot password?
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-xl bg-brand-900 px-4 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-accent-500/40 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Sign in securely'}
        </button>
      </form>
    </AuthLayout>
  )
}
