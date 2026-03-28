export function ThinkingIndicator() {
  return (
    <div className="flex w-full justify-start animate-fade-in-up">
      <div className="flex items-center gap-3 rounded-2xl border border-zinc-700/60 bg-zinc-900/80 px-4 py-3 backdrop-blur-sm">
        <span className="flex gap-1">
          <span className="inline-flex h-2 w-2 animate-bounce rounded-full bg-violet-400 [animation-delay:-0.3s]" />
          <span className="inline-flex h-2 w-2 animate-bounce rounded-full bg-violet-400 [animation-delay:-0.15s]" />
          <span className="inline-flex h-2 w-2 animate-bounce rounded-full bg-violet-400" />
        </span>
        <span className="text-sm text-zinc-400">Thinking…</span>
      </div>
    </div>
  )
}
