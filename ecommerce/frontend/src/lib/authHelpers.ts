import type { StoredUser } from './authStorage'

export function isAdminUser(user: StoredUser | null | undefined): boolean {
  if (!user) return false
  const role = user.role ?? user.roles
  return role === 'admin'
}
