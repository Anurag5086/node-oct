import { apiUrl } from '../lib/apiConfig'
import type { AssistantChatResponse } from '../types/assistant'

export async function sendAssistantMessage(message: string): Promise<AssistantChatResponse> {
  const response = await fetch(apiUrl('/api/assistant/chat'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ message }),
  })

  const body = (await response.json().catch(() => null)) as AssistantChatResponse | null

  if (!response.ok || !body?.success) {
    throw new Error(body?.message ?? 'Could not reach the shopping assistant.')
  }

  return body
}
