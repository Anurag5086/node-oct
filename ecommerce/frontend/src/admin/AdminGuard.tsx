import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { fetchCurrentUser } from '../api/admin'
import { getToken, saveSession } from '../lib/authStorage'
import { isAdminUser } from '../lib/authHelpers'

export function AdminGuard() {
  const location = useLocation()
  const token = getToken()
  const [checking, setChecking] = useState(true)
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function verify() {
      if (!token) {
        if (!cancelled) {
          setAllowed(false)
          setChecking(false)
        }
        return
      }

      const user = await fetchCurrentUser()
      if (cancelled) return

      if (user && token) {
        saveSession(token, user)
      }

      setAllowed(isAdminUser(user))
      setChecking(false)
    }

    verify()
    return () => {
      cancelled = true
    }
  }, [token])

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <p className="text-sm font-medium text-stone-600">Verifying admin access…</p>
      </div>
    )
  }

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (!allowed) {
    return <Navigate to="/" replace state={{ adminDenied: true }} />
  }

  return <Outlet />
}
