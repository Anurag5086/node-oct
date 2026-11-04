export type StoredUser = {
  _id: string
  name: string
  email: string
  role?: string
  roles?: string
  phoneNumber?: string
  address?: string
}

const TOKEN_KEY = 'nova_auth_token'
const USER_KEY = 'nova_auth_user'

export function saveSession(token: string, user: StoredUser): void {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function getStoredUser(): StoredUser | null {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as StoredUser
  } catch {
    return null
  }
}
