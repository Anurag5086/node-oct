import { apiUrl } from '../lib/apiConfig'
import { saveSession, type StoredUser } from '../lib/authStorage'

type ApiErrorBody = {
  success?: boolean
  message?: string
}

export class AuthApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'AuthApiError'
    this.status = status
  }
}

async function parseJson<T>(response: Response): Promise<T | null> {
  try {
    return (await response.json()) as T
  } catch {
    return null
  }
}

export async function registerUser(payload: {
  name: string
  email: string
  password: string
}): Promise<{ message: string }> {
  const response = await fetch(apiUrl('/api/auth/register'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  const body = await parseJson<ApiErrorBody & { user?: StoredUser }>(response)

  if (!response.ok) {
    throw new AuthApiError(
      body?.message ?? 'Registration failed. Please try again.',
      response.status,
    )
  }

  return { message: body?.message ?? 'Account created successfully.' }
}

export async function loginUser(payload: {
  email: string
  password: string
}): Promise<{ message: string; user: StoredUser }> {
  const response = await fetch(apiUrl('/api/auth/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  const body = await parseJson<
    ApiErrorBody & {
      sucess?: boolean
      success?: boolean
      token?: string
      user?: StoredUser
    }
  >(response)

  if (!response.ok) {
    throw new AuthApiError(
      body?.message ?? 'Sign in failed. Check your email and password.',
      response.status,
    )
  }

  if (!body?.token || !body.user) {
    throw new AuthApiError('Unexpected response from server.', response.status)
  }

  saveSession(body.token, body.user)

  return {
    message: body.message ?? 'Welcome back!',
    user: body.user,
  }
}
