import { MarkdownMessage } from './MarkdownMessage'
import { useTypingStream } from '../hooks/useTypingStream'

export function ChatMessage({ message, isStreaming }) {
  const isUser = message.role === 'user'
  const raw = message.content ?? ''
  const displayText = useTypingStream(raw, Boolean(isStreaming))

  return (
    <div className={`flex w-full animate-fade-in-up ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[min(100%,52rem)] rounded-2xl px-4 py-3 shadow-lg sm:px-5 ${
          isUser
            ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white'
            : 'border border-zinc-700/60 bg-zinc-900/80 text-zinc-100 backdrop-blur-sm'
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{raw}</p>
        ) : (
          <MarkdownMessage>{displayText || (isStreaming ? '\u00a0' : '')}</MarkdownMessage>
        )}
      </div>
    </div>
  )
}
