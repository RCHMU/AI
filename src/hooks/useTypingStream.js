import { useState, useEffect, useRef, useLayoutEffect } from 'react'

const WORD_MS = 36

/**
 * While streaming, reveals `targetText` word-by-word (interval-driven updates).
 * When not streaming, returns full `targetText`.
 */
export function useTypingStream(targetText, isStreaming) {
  const [displayed, setDisplayed] = useState('')
  const targetRef = useRef(targetText)

  useLayoutEffect(() => {
    targetRef.current = targetText
  }, [targetText])

  useEffect(() => {
    if (!isStreaming) return undefined

    const id = setInterval(() => {
      const full = targetRef.current
      setDisplayed((prev) => {
        if (prev.length >= full.length) return prev
        if (full.length > 0 && !full.startsWith(prev)) return ''
        const tail = full.slice(prev.length)
        const m = tail.match(/^(\s+|\S+)/)
        return m ? prev + m[1] : prev
      })
    }, WORD_MS)

    return () => clearInterval(id)
  }, [isStreaming])

  return isStreaming ? displayed : targetText
}
