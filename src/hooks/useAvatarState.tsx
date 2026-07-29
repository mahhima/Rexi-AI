import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { AvatarState } from '../components/Avatar/Avatar'

/**
 * Small state machine that maps the rhythm of a conversation onto Rexi's
 * avatar. It is intentionally mock/local — no API calls. ChatPanel drives it
 * via the handlers; AvatarSlot reads `state` to render the character.
 *
 *   greeting ─(once, on mount)─▶ idle
 *   idle ◀─▶ listening        (user typing, 300ms debounce back to idle)
 *   idle ──▶ thinking         (message sent, before the reply appears)
 *   thinking ──▶ speaking     (reply starts streaming)
 *   speaking ──▶ idle         (reply finished rendering)
 */

const GREETING_DURATION = 2200 // how long the greeting plays before settling
const LISTENING_DEBOUNCE = 300 // idle-out delay after the last keystroke

interface AvatarStateContextValue {
  state: AvatarState
  /** Call on every keystroke while the user is composing a message. */
  notifyTyping: () => void
  /** Play greeting once (e.g. first-ever message typed). */
  startGreeting: () => void
  /** Message sent — Rexi is preparing a response. */
  startThinking: () => void
  /** Reply has begun streaming into the message list. */
  startSpeaking: () => void
  /** Reply finished (or the conversation went quiet) — settle to idle. */
  goIdle: () => void
}

const AvatarStateContext = createContext<AvatarStateContextValue | null>(null)

export function AvatarProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AvatarState>('greeting')
  const typingTimer = useRef<ReturnType<typeof setTimeout>>()
  const greetingTimer = useRef<ReturnType<typeof setTimeout>>()

  // Play the greeting exactly once, then settle into idle.
  useEffect(() => {
    greetingTimer.current = setTimeout(() => {
      setState((s) => (s === 'greeting' ? 'idle' : s))
    }, GREETING_DURATION)
    return () => {
      clearTimeout(greetingTimer.current)
      clearTimeout(typingTimer.current)
    }
  }, [])

  const notifyTyping = useCallback(() => {
    setState((s) => (s === 'thinking' || s === 'speaking' || s === 'greeting' ? s : 'listening'))
    clearTimeout(typingTimer.current)
    typingTimer.current = setTimeout(() => {
      setState((s) => (s === 'listening' ? 'idle' : s))
    }, LISTENING_DEBOUNCE)
  }, [])

  const startGreeting = useCallback(() => {
    clearTimeout(typingTimer.current)
    setState('greeting')
    // Settle to listening after the greeting plays
    greetingTimer.current = setTimeout(() => {
      setState((s) => (s === 'greeting' ? 'listening' : s))
    }, GREETING_DURATION)
  }, [])

  const startThinking = useCallback(() => {
    clearTimeout(typingTimer.current)
    setState('thinking')
  }, [])

  const startSpeaking = useCallback(() => {
    clearTimeout(typingTimer.current)
    setState('speaking')
  }, [])

  const goIdle = useCallback(() => {
    clearTimeout(typingTimer.current)
    setState((s) => (s === 'greeting' ? s : 'idle'))
  }, [])

  return (
    <AvatarStateContext.Provider value={{ state, notifyTyping, startGreeting, startThinking, startSpeaking, goIdle }}>
      {children}
    </AvatarStateContext.Provider>
  )
}

export function useAvatarState(): AvatarStateContextValue {
  const ctx = useContext(AvatarStateContext)
  if (!ctx) {
    throw new Error('useAvatarState must be used within an <AvatarProvider>')
  }
  return ctx
}
