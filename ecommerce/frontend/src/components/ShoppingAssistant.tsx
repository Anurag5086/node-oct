import { useEffect, useId, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { sendAssistantMessage } from '../api/assistant'
import type { ChatMessage } from '../types/assistant'
import { AssistantProductCard } from './AssistantProductCard'

const SUGGESTED_PROMPTS = [
  'What are your best deals right now?',
  'Recommend something under ₹2000',
  'Which products are in stock?',
]

function createMessageId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function ShoppingAssistant() {
  const location = useLocation()
  const panelTitleId = useId()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'Hi! I’m your Nova Commerce shopping assistant. Ask me about products, prices, or what to buy — I’ll suggest items from our catalog.',
    },
  ])
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const hideOnRoute = location.pathname.startsWith('/admin')

  useEffect(() => {
    if (!open || !listRef.current) return
    listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages, open, sending])

  useEffect(() => {
    if (open) {
      inputRef.current?.focus()
    }
  }, [open])

  async function submitMessage(text: string) {
    const trimmed = text.trim()
    if (!trimmed || sending) return

    const userMessage: ChatMessage = {
      id: createMessageId(),
      role: 'user',
      text: trimmed,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setSending(true)

    try {
      const data = await sendAssistantMessage(trimmed)
      setMessages((prev) => [
        ...prev,
        {
          id: createMessageId(),
          role: 'assistant',
          text: data.response,
          products: data.products?.length ? data.products : undefined,
        },
      ])
    } catch (err) {
      const detail = err instanceof Error ? err.message : 'Something went wrong.'
      setMessages((prev) => [
        ...prev,
        {
          id: createMessageId(),
          role: 'assistant',
          text: detail,
          error: true,
        },
      ])
    } finally {
      setSending(false)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    void submitMessage(input)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void submitMessage(input)
    }
  }

  if (hideOnRoute) {
    return null
  }

  return (
    <>
      {open ? (
        <div
          className="fixed inset-0 z-[60] bg-brand-950/40 backdrop-blur-[2px] sm:bg-transparent sm:backdrop-blur-none"
          aria-hidden
          onClick={() => setOpen(false)}
        />
      ) : null}

      <div className="fixed bottom-4 right-4 z-[70] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
        {open ? (
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby={panelTitleId}
            className="flex h-[min(560px,calc(100vh-6rem))] w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-2xl shadow-brand-950/20 animate-fade-up"
          >
            <header className="flex items-center gap-3 border-b border-stone-200 bg-gradient-to-r from-brand-900 to-brand-800 px-4 py-3.5 text-white">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 font-display text-lg font-bold">
                AI
              </span>
              <div className="min-w-0 flex-1">
                <h2 id={panelTitleId} className="truncate font-display text-base font-semibold">
                  Shopping assistant
                </h2>
                <p className="truncate text-xs text-white/70">Powered by your store catalog</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-white/90 hover:bg-white/10"
                aria-label="Close assistant"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </header>

            <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto bg-surface px-4 py-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[92%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'rounded-br-md bg-brand-900 text-white'
                        : msg.error
                          ? 'rounded-bl-md border border-red-200 bg-red-50 text-red-900'
                          : 'rounded-bl-md border border-stone-200 bg-white text-brand-950 shadow-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    {msg.products && msg.products.length > 0 ? (
                      <div className="mt-3 -mx-1">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500">
                          Related products
                        </p>
                        <div className="flex gap-2 overflow-x-auto pb-1">
                          {msg.products.map((product) => (
                            <AssistantProductCard key={product._id} product={product} />
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}

              {sending ? (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-md border border-stone-200 bg-white px-4 py-3 shadow-sm">
                    <span className="inline-flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-accent-500 [animation-delay:0ms]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-accent-500 [animation-delay:150ms]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-accent-500 [animation-delay:300ms]" />
                    </span>
                  </div>
                </div>
              ) : null}
            </div>

            {messages.length <= 1 ? (
              <div className="border-t border-stone-200 bg-white px-3 py-2">
                <p className="mb-2 px-1 text-xs font-medium text-stone-500">Try asking</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      disabled={sending}
                      onClick={() => void submitMessage(prompt)}
                      className="rounded-full border border-stone-200 bg-surface px-3 py-1.5 text-left text-xs text-brand-900 hover:border-accent-500/40 hover:bg-white disabled:opacity-50"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <form
              onSubmit={handleSubmit}
              className="border-t border-stone-200 bg-white p-3"
            >
              <div className="flex items-end gap-2 rounded-xl border border-stone-300 bg-surface-muted/50 p-2 focus-within:border-accent-500 focus-within:ring-2 focus-within:ring-accent-500/20">
                <label className="sr-only" htmlFor="assistant-input">
                  Message
                </label>
                <textarea
                  id="assistant-input"
                  ref={inputRef}
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={sending}
                  placeholder="Ask about products, prices, or recommendations…"
                  className="max-h-24 min-h-[2.5rem] flex-1 resize-none bg-transparent px-2 py-1.5 text-sm outline-none disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={sending || !input.trim()}
                  className="shrink-0 rounded-lg bg-accent-600 px-3 py-2 text-sm font-semibold text-white hover:bg-accent-500 disabled:cursor-not-allowed disabled:bg-stone-300"
                >
                  Send
                </button>
              </div>
              <p className="mt-2 text-center text-[10px] text-stone-400">
                Enter to send · Shift+Enter for new line
              </p>
            </form>
          </section>
        ) : null}

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-2 rounded-full bg-brand-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-950/25 transition hover:bg-brand-800 hover:shadow-xl"
          aria-expanded={open}
          aria-controls={open ? panelTitleId : undefined}
        >
          <svg className="h-5 w-5 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          {open ? 'Close' : 'Ask AI'}
        </button>
      </div>
    </>
  )
}
