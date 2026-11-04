export const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''

export function apiUrl(path: string): string {
  const base = API_BASE.replace(/\/$/, '')
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalized}`
}
