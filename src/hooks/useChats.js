import { useState, useEffect, useCallback } from 'react'
import { loadSessions, saveSessions } from '../lib/storage'

function initialState() {
  const { chats, activeId } = loadSessions()
  return { chats, activeId }
}

export function useChats() {
  const [{ chats, activeId }, setState] = useState(initialState)

  useEffect(() => {
    saveSessions(chats, activeId)
  }, [chats, activeId])

  const activeChat = chats.find((c) => c.id === activeId) ?? null

  const newChat = useCallback(() => {
    const id = crypto.randomUUID()
    const chat = {
      id,
      title: 'New chat',
      messages: [],
      updatedAt: Date.now(),
    }
    setState((s) => ({
      chats: [chat, ...s.chats],
      activeId: id,
    }))
    return id
  }, [])

  const selectChat = useCallback((id) => {
    setState((s) => ({ ...s, activeId: id }))
  }, [])

  const deleteChat = useCallback((id) => {
    setState((s) => {
      const nextChats = s.chats.filter((c) => c.id !== id)
      let nextActive = s.activeId
      if (s.activeId === id) {
        nextActive = nextChats[0]?.id ?? null
      }
      return { chats: nextChats, activeId: nextActive }
    })
  }, [])

  const appendUserMessage = useCallback((chatId, content) => {
    const msg = { id: crypto.randomUUID(), role: 'user', content, at: Date.now() }
    setState((s) => ({
      ...s,
      chats: s.chats.map((c) => {
        if (c.id !== chatId) return c
        const isFirst = c.messages.length === 0
        const title = isFirst
          ? content.trim().slice(0, 56) + (content.trim().length > 56 ? '…' : '') || 'New chat'
          : c.title
        return {
          ...c,
          title,
          messages: [...c.messages, msg],
          updatedAt: Date.now(),
        }
      }),
    }))
    return msg.id
  }, [])

  const appendAssistantPlaceholder = useCallback((chatId) => {
    const msg = { id: crypto.randomUUID(), role: 'assistant', content: '', at: Date.now() }
    setState((s) => ({
      ...s,
      chats: s.chats.map((c) =>
        c.id === chatId
          ? { ...c, messages: [...c.messages, msg], updatedAt: Date.now() }
          : c,
      ),
    }))
    return msg.id
  }, [])

  const setAssistantContent = useCallback((chatId, messageId, content) => {
    setState((s) => ({
      ...s,
      chats: s.chats.map((c) => {
        if (c.id !== chatId) return c
        const messages = c.messages.map((m) =>
          m.id === messageId ? { ...m, content } : m,
        )
        return { ...c, messages, updatedAt: Date.now() }
      }),
    }))
  }, [])

  return {
    chats,
    activeId,
    activeChat,
    newChat,
    selectChat,
    deleteChat,
    appendUserMessage,
    appendAssistantPlaceholder,
    setAssistantContent,
  }
}
