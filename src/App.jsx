import { useState, useCallback, useMemo } from 'react'
import { flushSync } from 'react-dom'
import { Sidebar } from './components/Sidebar'
import { Chat } from './components/Chat'
import { useChats } from './hooks/useChats'
import { streamGeminiReply } from './lib/gemini'

const KEY_STORAGE = 'gemini_api_key_override'

export default function App() {
  const {
    chats,
    activeId,
    activeChat,
    newChat,
    selectChat,
    deleteChat,
    appendUserMessage,
    appendAssistantPlaceholder,
    setAssistantContent,
  } = useChats()

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [streamingAssistantId, setStreamingAssistantId] = useState(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [keyDraft, setKeyDraft] = useState(() => localStorage.getItem(KEY_STORAGE) ?? '')

  const envKey = import.meta.env.VITE_GEMINI_API_KEY ?? ''
  const model = import.meta.env.VITE_GEMINI_MODEL ?? 'gemini-1.5-flash'

  const effectiveKey = useMemo(() => {
    const k = envKey.trim() || keyDraft.trim() || localStorage.getItem(KEY_STORAGE) || ''
    return k
  }, [envKey, keyDraft])

  const persistKey = () => {
    const v = keyDraft.trim()
    if (v) localStorage.setItem(KEY_STORAGE, v)
    else localStorage.removeItem(KEY_STORAGE)
    setSettingsOpen(false)
  }

  const handleSend = useCallback(async () => {
    const text = input.trim()
    if (!text || loading) return

    const apiKey = effectiveKey
    if (!apiKey) {
      setSettingsOpen(true)
      return
    }

    let chatId = activeId
    let priorMessages = []

    if (!chatId) {
      flushSync(() => {
        chatId = newChat()
      })
    } else if (activeChat?.id === chatId) {
      priorMessages = activeChat.messages.map((m) => ({
        role: m.role,
        content: m.content,
      }))
    }

    setInput('')
    setLoading(true)
    setStreamingAssistantId(null)

    appendUserMessage(chatId, text)
    const assistantId = appendAssistantPlaceholder(chatId)
    setStreamingAssistantId(assistantId)

    let accumulated = ''

    try {
      for await (const chunk of streamGeminiReply({
        apiKey,
        model,
        priorMessages,
        userMessage: text,
      })) {
        accumulated += chunk
        setAssistantContent(chatId, assistantId, accumulated)
      }
    } catch (e) {
      const msg =
        e?.name === 'AbortError'
          ? 'Request cancelled.'
          : e?.message || 'Something went wrong. Check your API key and model name.'
      setAssistantContent(chatId, assistantId, accumulated + (accumulated ? '\n\n' : '') + `*Error:* ${msg}`)
    } finally {
      setLoading(false)
      setStreamingAssistantId(null)
    }
  }, [
    activeChat,
    activeId,
    appendAssistantPlaceholder,
    appendUserMessage,
    effectiveKey,
    input,
    loading,
    model,
    newChat,
    setAssistantContent,
  ])

  return (
    <div className="flex h-svh w-full overflow-hidden bg-zinc-950 text-zinc-100">
      <Sidebar
        chats={chats}
        activeId={activeId}
        onNewChat={newChat}
        onSelectChat={selectChat}
        onDeleteChat={deleteChat}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="pointer-events-none absolute right-3 top-3 z-10 sm:right-4 sm:top-3 md:right-4">
          <div className="pointer-events-auto flex items-center gap-2">
            {envKey ? (
              <span className="hidden rounded-lg bg-emerald-500/15 px-2 py-1 text-[11px] font-medium text-emerald-400 sm:inline">
                API key from env
              </span>
            ) : null}
            <button
              type="button"
              onClick={() => {
                setKeyDraft(localStorage.getItem(KEY_STORAGE) ?? '')
                setSettingsOpen(true)
              }}
              className="rounded-xl border border-zinc-700/80 bg-zinc-900/90 px-3 py-2 text-xs font-medium text-zinc-300 shadow-sm backdrop-blur-sm transition hover:border-zinc-600 hover:text-zinc-100"
            >
              Settings
            </button>
          </div>
        </div>

        <Chat
          activeChat={activeChat}
          loading={loading}
          streamingAssistantId={streamingAssistantId}
          input={input}
          onInputChange={setInput}
          onSend={handleSend}
          sidebarToggle={() => setSidebarOpen(true)}
        />
      </div>

      {settingsOpen ? (
        <div className="fixed inset-0 z-[60] flex items-end justify-center p-4 sm:items-center">
          <button
            type="button"
            aria-label="Close settings"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSettingsOpen(false)}
          />
          <div className="relative z-10 w-full max-w-md animate-fade-in-up rounded-2xl border border-zinc-700/80 bg-zinc-900 p-5 shadow-2xl shadow-black/40">
            <h2 className="text-lg font-semibold text-zinc-50">Gemini API</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Get a key from{' '}
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-violet-400 underline underline-offset-2"
              >
                Google AI Studio
              </a>
              . Stored in this browser only (unless you use{' '}
              <code className="rounded bg-zinc-800 px-1 text-xs">.env</code>).
            </p>
            <label className="mt-4 block text-xs font-medium uppercase tracking-wide text-zinc-500">
              API key
            </label>
            <input
              type="password"
              autoComplete="off"
              value={keyDraft}
              onChange={(e) => setKeyDraft(e.target.value)}
              placeholder="AIza…"
              className="mt-1.5 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/25"
            />
            <p className="mt-3 text-xs text-zinc-500">
              Model: <span className="font-mono text-zinc-400">{model}</span> — override with{' '}
              <span className="font-mono text-zinc-400">VITE_GEMINI_MODEL</span> in{' '}
              <span className="font-mono text-zinc-400">.env</span>.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSettingsOpen(false)}
                className="rounded-xl px-4 py-2 text-sm text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={persistKey}
                className="rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-md transition hover:brightness-110"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
