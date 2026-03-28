export function ChatInput({
  value,
  onChange,
  onSend,
  disabled,
  placeholder = 'Message Gemini…',
}) {
  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!disabled && value.trim()) onSend()
    }
  }

  return (
    <div className="border-t border-zinc-800/80 bg-zinc-950/90 px-3 py-3 backdrop-blur-xl sm:px-4">
      <div className="mx-auto flex max-w-4xl items-end gap-2 rounded-2xl border border-zinc-700/70 bg-zinc-900/90 p-2 shadow-xl shadow-black/20 ring-1 ring-zinc-800 focus-within:border-violet-500/40 focus-within:ring-violet-500/20">
        <textarea
          rows={1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="max-h-40 min-h-[48px] flex-1 resize-none bg-transparent px-3 py-3 text-[15px] text-zinc-100 placeholder:text-zinc-500 focus:outline-none disabled:opacity-50"
        />
        <button
          type="button"
          onClick={() => value.trim() && onSend()}
          disabled={disabled || !value.trim()}
          className="mb-1.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-md transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:brightness-100"
          aria-label="Send message"
        >
          <svg className="h-5 w-5 translate-x-px" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
      <p className="mx-auto mt-2 max-w-4xl text-center text-[11px] text-zinc-600">
        Gemini may produce inaccurate information. Verify important answers.
      </p>
    </div>
  )
}
