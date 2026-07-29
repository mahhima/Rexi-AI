import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSession } from '../hooks/useSession'

export default function AuthCallbackPage() {
  const navigate = useNavigate()
  const { setToken } = useSession()

  useEffect(() => {
    const hash = window.location.hash
    const params = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash)
    const token = params.get('token')

    if (token) {
      setToken(token, true)  // mark as GitHub user
      window.history.replaceState(null, '', window.location.pathname)
    }

    navigate('/connect-repo', { replace: true })
  }, []) // run once on mount

  return (
    <div className="min-h-screen bg-background flex items-center justify-center text-text-secondary text-sm">
      Signing you in…
    </div>
  )
}
