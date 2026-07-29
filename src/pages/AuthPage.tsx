import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiEye, FiEyeOff, FiArrowRight, FiLoader } from 'react-icons/fi'
import AvatarCompanion from '../components/Avatar/AvatarCompanion'
import type { AvatarState } from '../components/Avatar/Avatar'
import { useSession } from '../hooks/useSession'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string

type Tab = 'signin' | 'signup'

export default function AuthPage() {
  const navigate = useNavigate()
  const { setToken } = useSession()
  const panelRef = useRef<HTMLDivElement>(null)

  const [tab, setTab]             = useState<Tab>('signin')
  const [showPass, setShowPass]   = useState(false)
  const [fieldFocused, setFieldFocused] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')

  // form fields
  const [name, setName]           = useState('')
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')

  const companionOverride: AvatarState | undefined = fieldFocused ? 'listening' : undefined

  const fieldProps = {
    onFocus: () => setFieldFocused(true),
    onBlur:  () => setFieldFocused(false),
  }

  function switchTab(t: Tab) {
    setTab(t)
    setError('')
    setName('')
    setEmail('')
    setPassword('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const endpoint = tab === 'signup' ? '/auth/register' : '/auth/login'
    const body = tab === 'signup'
      ? { email, username: name, password }
      : { email, password }

    try {
      const res = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.detail ?? 'Something went wrong.')
        return
      }
      setToken(data.token)           // hasGitHub defaults to false for email users
      navigate('/app', { replace: true })
    } catch {
      setError('Could not reach the server. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  function handleGitHubLogin() {
    window.location.href = `${BACKEND_URL}/auth/github/login`
  }

  return (
    <div className="min-h-screen w-screen flex bg-background text-text-primary font-sans overflow-hidden">

      {/* ── LEFT: Avatar panel ────────────────────────────────────────── */}
      <div ref={panelRef} className="hidden lg:flex flex-col flex-1 items-center justify-center relative overflow-hidden border-r border-white/6 bg-surface/30">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 55% at 50% 52%, rgba(124,58,237,0.12) 0%, transparent 70%)' }}
        />
        <div className="absolute top-6 left-6 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center shadow-lg shadow-accent/30">
            <span className="text-white font-bold text-xs">R</span>
          </div>
          <span className="font-semibold text-sm text-text-primary">Rexi</span>
        </div>
        <div className="flex flex-col items-center gap-8 relative">
          <AvatarCompanion overrideState={companionOverride} size={220} panelRef={panelRef} />
          <div className="text-center px-8">
            <p className="text-base font-semibold text-text-primary">Your AI code companion</p>
            <p className="mt-1 text-sm text-text-secondary/60 max-w-xs">
              Ask anything about your codebase. Rexi knows your repo inside out.
            </p>
          </div>
        </div>
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* ── RIGHT: Form panel ────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 items-center justify-center px-8 py-12 relative">

        <div className="lg:hidden absolute top-6 left-6 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center shadow-lg shadow-accent/30">
            <span className="text-white font-bold text-xs">R</span>
          </div>
          <span className="font-semibold text-sm text-text-primary">Rexi</span>
        </div>

        <div className="w-full max-w-sm">

          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight">
              {tab === 'signin' ? 'Welcome back' : 'Create account'}
            </h1>
            <p className="mt-1.5 text-sm text-text-secondary/60">
              {tab === 'signin' ? 'Sign in to continue with Rexi.' : 'Get started — it only takes a minute.'}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex rounded-xl border border-white/8 bg-surface p-1 mb-7 relative">
            {(['signin', 'signup'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => switchTab(t)}
                className={`relative flex-1 py-2 rounded-lg text-xs font-medium transition-colors z-10
                  ${tab === t ? 'text-white' : 'text-text-secondary hover:text-text-primary'}`}
              >
                {tab === t && (
                  <motion.span
                    layoutId="auth-tab-pill"
                    className="absolute inset-0 rounded-lg bg-accent/20 border border-accent/30"
                    transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                  />
                )}
                <span className="relative">{t === 'signin' ? 'Sign in' : 'Sign up'}</span>
              </button>
            ))}
          </div>

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.form
              key={tab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="flex flex-col gap-4"
              onSubmit={handleSubmit}
            >
              {tab === 'signup' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-text-secondary/80">Full name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ada Lovelace"
                    autoComplete="name"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-white/8 text-sm text-text-primary placeholder:text-text-secondary/30 outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-colors"
                    {...fieldProps}
                  />
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-text-secondary/80">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-white/8 text-sm text-text-primary placeholder:text-text-secondary/30 outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-colors"
                  {...fieldProps}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-text-secondary/80">Password</label>
                  {tab === 'signin' && (
                    <button type="button" className="text-[11px] text-accent-light hover:text-accent transition-colors">
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete={tab === 'signin' ? 'current-password' : 'new-password'}
                    required
                    minLength={tab === 'signup' ? 8 : undefined}
                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-surface border border-white/8 text-sm text-text-primary placeholder:text-text-secondary/30 outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-colors"
                    {...fieldProps}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary/40 hover:text-text-secondary transition-colors"
                    tabIndex={-1}
                  >
                    {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                  </button>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <p className="text-[12px] text-red-400/90 bg-red-400/8 border border-red-400/20 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-accent hover:bg-accent/90 active:bg-accent/80 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors shadow-lg shadow-accent/20"
              >
                {loading
                  ? <FiLoader size={14} className="animate-spin" />
                  : <>{tab === 'signin' ? 'Sign in' : 'Create account'} <FiArrowRight size={14} /></>
                }
              </button>
            </motion.form>
          </AnimatePresence>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/6" />
            <span className="text-[11px] text-text-secondary/40">or continue with</span>
            <div className="flex-1 h-px bg-white/6" />
          </div>

          {/* OAuth buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleGitHubLogin}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/8 bg-surface hover:border-white/15 hover:bg-white/4 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              GitHub
            </button>
            <button
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/8 bg-surface hover:border-white/15 hover:bg-white/4 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              Google
            </button>
          </div>

          <p className="mt-8 text-center text-[11px] text-text-secondary/40">
            <Link to="/" className="hover:text-text-secondary transition-colors">
              ← Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
