import { useEffect, useState } from 'react'
import { fetchAdminUsers, type AdminUserRow } from '../../api/admin'
import { ApiError } from '../../api/httpClient'
import { Alert } from '../../components/Alert'
import { AdminPanel } from '../components/AdminPanel'

export function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        setUsers(await fetchAdminUsers())
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'Failed to load users')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-brand-950">Users</h1>
        <p className="mt-1 text-stone-600">Read-only list from GET /api/user/get-all-users (admin).</p>
      </div>

      {error ? <Alert variant="error">{error}</Alert> : null}

      <AdminPanel title="Registered customers">
        {loading ? (
          <p className="text-sm text-stone-500">Loading…</p>
        ) : users.length === 0 ? (
          <p className="text-sm text-stone-500">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-stone-200 text-xs uppercase tracking-wide text-stone-500">
                <tr>
                  <th className="px-2 py-2">Name</th>
                  <th className="px-2 py-2">Email</th>
                  <th className="px-2 py-2">Phone</th>
                  <th className="px-2 py-2">Role</th>
                  <th className="px-2 py-2">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b border-stone-100">
                    <td className="px-2 py-3 font-medium text-brand-950">{user.name}</td>
                    <td className="px-2 py-3 text-stone-600">{user.email}</td>
                    <td className="px-2 py-3 text-stone-600">{user.phoneNumber || '—'}</td>
                    <td className="px-2 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          (user.roles ?? user.role) === 'admin'
                            ? 'bg-brand-900 text-white'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {user.roles ?? user.role ?? 'user'}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-stone-500">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminPanel>
    </div>
  )
}
