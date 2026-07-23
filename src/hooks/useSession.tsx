import { createContext, useCallback, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { MockRepo } from '../data/mockFileTree'

interface Session {
  loggedIn: boolean
  selectedRepo: MockRepo | null
}

interface SessionContextValue extends Session {
  login: () => void
  logout: () => void
  selectRepo: (repo: MockRepo) => void
}

const KEY = 'rexi_session'

function load(): Session {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as Session
  } catch {}
  return { loggedIn: false, selectedRepo: null }
}

function save(s: Session) {
  localStorage.setItem(KEY, JSON.stringify(s))
}

const SessionContext = createContext<SessionContextValue | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>(load)

  const update = useCallback((next: Session) => {
    save(next)
    setSession(next)
  }, [])

  const login      = useCallback(() => update({ ...session, loggedIn: true }), [session, update])
  const logout     = useCallback(() => update({ loggedIn: false, selectedRepo: null }), [update])
  const selectRepo = useCallback((repo: MockRepo) => update({ ...session, selectedRepo: repo }), [session, update])

  return (
    <SessionContext.Provider value={{ ...session, login, logout, selectRepo }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be used within <SessionProvider>')
  return ctx
}
