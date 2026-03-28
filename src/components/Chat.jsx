import { useRef, useEffect, useCallback } from 'react'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { ThinkingIndicator } from './ThinkingIndicator'

export function Chat({
  activeChat,
  loading,
  streamingAssistantId,
  input,
  onInputChange,
  onSend,
  sidebarToggle,
}) {
  const bottomRef = useRef(null)

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [activeChat?.messages, loading, scrollToBottom])

  const msgs = activeChat?.messages ?? []
  const last = msgs[msgs.length - 1]
  const showThinking =
    loading && last?.role === 'assistant' && !(last?.content)

  return (
    <div className="relative flex min-h-0 min-w-0 flex-1 flex-col bg-gradient-to-b from-zinc-950 via-zinc-950 to-zinc-900/50">
      <header className="flex shrink-0 items-center gap-3 border-b border-zinc-800/80 bg-zinc-950/80 px-3 py-3 backdrop-blur-md sm:px-4">
        <button
          type="button"
          onClick={sidebarToggle}
          className="rounded-xl p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-100 md:hidden"
          aria-label="Open sidebar"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-sm font-semibold text-zinc-100 sm:text-base">
            {activeChat?.title ?? 'New conversation'}
          </h1>
          <p className="truncate text-xs text-zinc-500">Powered by Google Gemini</p>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-6 sm:px-6">
        <div className="mx-auto flex max-w-4xl flex-col gap-4">
          {!activeChat || msgs.length === 0 ? (
            <div className="mx-auto mt-8 max-w-lg animate-fade-in-up px-4 text-center">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600/30 to-indigo-600/20 ring-1 ring-violet-500/30">
                <svg className="h-8 w-8 text-violet-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-zinc-100">How can I help you today?</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                Ask anything, request code, or brainstorm ideas. Your history is saved locally in this browser.
              </p>
            </div>
          ) : null}

          {msgs.map((m) => (
            <ChatMessage
              key={m.id}
              message={m}
              isStreaming={loading && m.id === streamingAssistantId && m.role === 'assistant'}
            />
          ))}

          {showThinking ? <ThinkingIndicator /> : null}

          <div ref={bottomRef} className="h-px shrink-0" aria-hidden />
        </div>
      </div>

      <ChatInput
        value={input}
        onChange={onInputChange}
        onSend={onSend}
        disabled={loading}
      />
    </div>
  )
}
