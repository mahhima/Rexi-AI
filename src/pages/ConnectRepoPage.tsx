import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiGitBranch, FiArrowRight, FiCheck } from 'react-icons/fi'
import { Avatar } from '../components/Avatar/Avatar'
import { useSession, type Repo } from '../hooks/useSession'

const BACKEND_URL = 'http://localhost:8000'

const LANG_COLOR: Record<string, string> = {
  TypeScript: '#3178C6',
  JavaScript: '#F7DF1E',
  Go:         '#00ADD8',
  Python:     '#3572A5',
  Rust:       '#DEA584',
  Java:       '#B07219',
  Ruby:       '#CC342D',
  Swift:      '#F05138',
  Kotlin:     '#7F52FF',
  'C++':      '#F34B7D',
  C:          '#555555',
  CSS:        '#563D7C',
  HTML:       '#E34C26',
  Shell:      '#89E051',
}

function formatDate(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  const now = Date.now()
  const diff = now - d.getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins  < 60)  return `${mins}m ago`
  if (hours < 24)  return `${hours}h ago`
  if (days  < 30)  return `${days}d ago`
  return d.toLocaleDateString()
}

const PROGRESS_STEPS = [
  'Cloning repository…',
  'Parsing file structure…',
  'Indexing symbols…',
  'Building semantic graph…',
  'Almost there…',
]

type Phase = 'pick' | 'indexing' | 'done'

export default function ConnectRepoPage() {
  const navigate = useNavigate()
  const { token, selectRepo } = useSession()

  const [repos, setRepos]         = useState<Repo[]>([])
  const [loading, setLoading]     = useState(true)
  const [fetchError, setFetchError] = useState('')

  const [phase, setPhase]           = useState<Phase>('pick')
  const [selected, setSelected]     = useState<Repo | null>(null)
  const [progressStep, setProgressStep] = useState(0)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${BACKEND_URL}/repos`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.status === 401) {
          navigate('/auth', { replace: true })
          return
        }
        if (!res.ok) throw new Error(`Server error ${res.status}`)
        const data = await res.json()
        setRepos(data as Repo[])
      } catch (err) {
        setFetchError(err instanceof Error ? err.message : 'Failed to load repos')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [token, navigate])

  function beginIndexing(repo: Repo) {
    setSelected(repo)
    setPhase('indexing')
    setProgressStep(0)

    PROGRESS_STEPS.forEach((_, i) => {
      setTimeout(() => setProgressStep(i), i * 600)
    })

    setTimeout(() => {
      selectRepo(repo)
      setPhase('done')
      setTimeout(() => navigate('/app'), 700)
    }, PROGRESS_STEPS.length * 600 + 500)
  }

  return (
    <div className="min-h-screen bg-background text-text-primary font-sans flex flex-col items-center justify-center px-6 py-12">

      {/* Wordmark */}
      <div className="absolute top-6 left-6 flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center shadow-lg shadow-accent/30">
          <span className="text-white font-bold text-xs">R</span>
        </div>
        <span className="font-semibold text-sm">Rexi</span>
      </div>

      <AnimatePresence mode="wait">

        {/* ── PICK phase ─────────────────────────────────────────────── */}
        {phase === 'pick' && (
          <motion.div
            key="pick"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="w-full max-w-lg"
          >
            {/* Heading */}
            <div className="mb-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-accent/15 border border-accent/25 mb-4">
                <FiGitBranch size={20} className="text-accent-light" />
              </div>
              <h1 className="text-2xl font-semibold tracking-tight">Connect a repository</h1>
              <p className="mt-2 text-sm text-text-secondary/60 max-w-sm mx-auto">
                Rexi needs a codebase to analyze. Pick one of your repos below.
              </p>
            </div>

            {/* Loading / error / list */}
            {loading && (
              <div className="text-center py-12 text-sm text-text-secondary/50">
                Loading your repositories…
              </div>
            )}

            {!loading && fetchError && (
              <div className="text-center py-8 text-sm text-red-400/80">
                {fetchError}
              </div>
            )}

            {!loading && !fetchError && repos.length === 0 && (
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <p className="text-sm text-text-secondary/60">
                  No repositories found. Connect your GitHub account to import your repos.
                </p>
                <button
                  onClick={() => { window.location.href = 'http://localhost:8000/auth/github/login' }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent hover:bg-accent/90 text-white text-sm font-medium transition-colors shadow-lg shadow-accent/20"
                >
                  Connect GitHub
                </button>
              </div>
            )}

            {!loading && !fetchError && repos.length > 0 && (
              <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-1">
                {repos.map((repo) => (
                  <motion.button
                    key={repo.id}
                    onClick={() => beginIndexing(repo)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl border border-white/8 bg-surface hover:border-accent/30 hover:bg-accent/5 transition-colors text-left group"
                  >
                    {/* Language dot */}
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0 ring-2 ring-black/30"
                      style={{ background: LANG_COLOR[repo.language ?? ''] ?? '#888' }}
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-text-primary truncate">{repo.name}</span>
                        {repo.private && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md border border-white/8 text-text-secondary/60 font-mono shrink-0">
                            private
                          </span>
                        )}
                        {repo.language && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md border border-white/8 text-text-secondary/60 font-mono shrink-0">
                            {repo.language}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-text-secondary/60 mt-0.5 truncate">
                        {repo.description ?? repo.full_name}
                      </p>
                    </div>

                    {/* Updated at */}
                    <span className="text-[10px] text-text-secondary/40 shrink-0">
                      {formatDate(repo.updated_at)}
                    </span>

                    <FiArrowRight size={14} className="text-text-secondary/30 group-hover:text-accent-light transition-colors shrink-0" />
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ── INDEXING / DONE phase ───────────────────────────────────── */}
        {(phase === 'indexing' || phase === 'done') && (
          <motion.div
            key="indexing"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="flex flex-col items-center gap-6 text-center"
          >
            {/* Avatar */}
            <div className="w-36 h-36">
              <Avatar state={phase === 'done' ? 'greeting' : 'thinking'} />
            </div>

            {/* Repo name */}
            <div>
              <div className="flex items-center justify-center gap-2 mb-1">
                {selected && (
                  <div
                    className="w-2.5 h-2.5 rounded-full ring-2 ring-black/30"
                    style={{ background: LANG_COLOR[selected.language ?? ''] ?? '#888' }}
                  />
                )}
                <span className="text-base font-semibold">{selected?.name}</span>
              </div>
              <p className="text-xs text-text-secondary/50">{selected?.description ?? selected?.full_name}</p>
            </div>

            {phase === 'done' ? (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-400/10 border border-green-400/20 text-green-400 text-sm font-medium"
              >
                <FiCheck size={14} />
                Indexed — launching Rexi…
              </motion.div>
            ) : (
              <div className="w-56 flex flex-col items-center gap-3">
                <div className="w-full h-1 rounded-full bg-white/6 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-accent"
                    animate={{ width: `${((progressStep + 1) / PROGRESS_STEPS.length) * 100}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={progressStep}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="text-xs text-text-secondary/60"
                  >
                    {PROGRESS_STEPS[progressStep]}
                  </motion.p>
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
