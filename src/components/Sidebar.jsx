export function Sidebar({
  chats,
  activeId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  open,
  onClose,
}) {
  const sorted = [...chats].sort((a, b) => b.updatedAt - a.updatedAt)

  return (
    <>
      <button
        type="button"
        aria-label="Close menu"
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-200 md:hidden ${
      open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(100%,18rem)] flex-col border-r border-zinc-800/90 bg-zinc-950/95 shadow-2xl backdrop-blur-xl transition-transform duration-300 ease-out md:static md:z-0 md:h-full md:translate-x-0 md:bg-zinc-950/80 md:shadow-none ${
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between gap-2 border-b border-zinc-800/80 px-3 py-3">
          <span className="truncate text-sm font-semibold tracking-tight text-zinc-100">
            Gemini Chat
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200 md:hidden"
            aria-label="Close sidebar"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-3">
          <button
            type="button"
            onClick={() => {
              onNewChat()
              onClose()
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-700/80 bg-zinc-900/90 py-2.5 text-sm font-medium text-zinc-100 shadow-sm transition hover:border-violet-500/40 hover:bg-zinc-800 active:scale-[0.99]"
          >
            <svg className="h-4 w-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New chat
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 pb-4">
          <p className="px-2 pb-2 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
            History
          </p>
          <ul className="space-y-1">
            {sorted.map((c) => (
              <li key={c.id}>
                <div
                  className={`group flex items-center gap-1 rounded-xl transition ${
                    c.id === activeId
                      ? 'bg-zinc-800/90 ring-1 ring-violet-500/30'
                      : 'hover:bg-zinc-800/60'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      onSelectChat(c.id)
                      onClose()
                    }}
                    className="min-w-0 flex-1 px-3 py-2.5 text-left"
                  >
                    <span className="line-clamp-2 text-[13px] text-zinc-200">{c.title}</span>
                  </button>
                  <button
                    type="button"
                    className="mr-1 rounded-lg p-2 text-zinc-500 opacity-0 transition hover:bg-red-500/15 hover:text-red-400 group-hover:opacity-100"
                    aria-label="Delete chat"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteChat(c.id)
                    }}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {sorted.length === 0 && (
            <p className="px-2 py-6 text-center text-[13px] text-zinc-500">No chats yet</p>
          )}
        </nav>
      </aside>
    </>
  )
}
