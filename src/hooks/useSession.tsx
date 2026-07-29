import { createContext, useCallback, useContext, useState } from 'react'
import type { ReactNode } from 'react'

export interface Repo {
  id: number
  name: string
  full_name: string
  description: string | null
  language: string | null
  updated_at: string | null
  clone_url: string
  private: boolean
}

interface Session {
  token: string | null
  hasGitHub: boolean      // true if user authenticated via GitHub OAuth
  selectedRepo: Repo | null
}

interface SessionContextValue {
  loggedIn: boolean
  hasGitHub: boolean
  token: string | null
  selectedRepo: Repo | null
  setToken: (token: string, hasGitHub?: boolean) => void
  logout: () => void
  selectRepo: (repo: Repo) => void
}

const TOKEN_KEY      = 'rexi_session_token'
const REPO_KEY       = 'rexi_selected_repo'
const HAS_GITHUB_KEY = 'rexi_has_github'

function loadSession(): Session {
  try {
    const token        = localStorage.getItem(TOKEN_KEY) ?? null
    const hasGitHub    = localStorage.getItem(HAS_GITHUB_KEY) === 'true'
    const repoRaw      = localStorage.getItem(REPO_KEY)
    const selectedRepo = repoRaw ? (JSON.parse(repoRaw) as Repo) : null
    return { token, hasGitHub, selectedRepo }
  } catch {
    return { token: null, hasGitHub: false, selectedRepo: null }
  }
}

const SessionContext = createContext<SessionContextValue | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>(loadSession)

  const setToken = useCallback((token: string, hasGitHub = false) => {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(HAS_GITHUB_KEY, String(hasGitHub))
    localStorage.removeItem(REPO_KEY)   // never carry over a repo from a previous session
    setSession({ token, hasGitHub, selectedRepo: null })
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REPO_KEY)
    localStorage.removeItem(HAS_GITHUB_KEY)
    setSession({ token: null, hasGitHub: false, selectedRepo: null })
  }, [])

  const selectRepo = useCallback((repo: Repo) => {
    localStorage.setItem(REPO_KEY, JSON.stringify(repo))
    setSession((s) => ({ ...s, selectedRepo: repo }))
  }, [])

  const loggedIn = !!session.token

  return (
    <SessionContext.Provider value={{
      loggedIn,
      hasGitHub: session.hasGitHub,
      token: session.token,
      selectedRepo: session.selectedRepo,
      setToken,
      logout,
      selectRepo,
    }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be used within <SessionProvider>')
  return ctx
}
