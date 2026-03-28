const STORAGE_KEY = 'gemini-chat-sessions-v1'

function safeParse(json, fallback) {
  try {
    return JSON.parse(json) ?? fallback
  } catch {
    return fallback
  }
}

export function loadSessions() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return { chats: [], activeId: null }
  const data = safeParse(raw, null)
  if (!data || !Array.isArray(data.chats)) return { chats: [], activeId: null }
  return {
    chats: data.chats,
    activeId: data.activeId ?? null,
  }
}

export function saveSessions(chats, activeId) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ chats, activeId }),
  )
}
