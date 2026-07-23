import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiGitBranch, FiPlus, FiArrowRight, FiCheck, FiX } from 'react-icons/fi'
import { Avatar } from '../components/Avatar/Avatar'
import { mockRepos, type MockRepo } from '../data/mockFileTree'
import { useSession } from '../hooks/useSession'

// Language → accent color dot
const LANG_COLOR: Record<string, string> = {
  TypeScript: '#3178C6',
  Go:         '#00ADD8',
  React:      '#61DAFB',
  Python:     '#3572A5',
  Rust:       '#DEA584',
  Java:       '#B07219',
}

const STATUS_LABEL: Record<MockRepo['status'], string> = {
  'indexed':       'Indexed',
  'indexing':      'Indexing…',
  'not-connected': 'Not connected',
}

// Simple URL/path validation
function looksLikeRepo(s: string) {
  const t = s.trim()
  return t.length > 2 && (
    t.includes('/') ||
    t.startsWith('http') ||
    t.startsWith('git@')
  )
}

// Fake progress messages shown during indexing
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
  const { selectRepo } = useSession()

  const [phase, setPhase]             = useState<Phase>('pick')
  const [selected, setSelected]       = useState<MockRepo | null>(null)
  const [showCustom, setShowCustom]   = useState(false)
  const [customUrl, setCustomUrl]     = useState('')
  const [urlError, setUrlError]       = useState('')
  const [progressStep, setProgressStep] = useState(0)

  function beginIndexing(repo: MockRepo) {
    setSelected(repo)
    setPhase('indexing')
    setProgressStep(0)

    // Cycle through fake progress steps
    PROGRESS_STEPS.forEach((_, i) => {
      setTimeout(() => setProgressStep(i), i * 600)
    })

    // Finish after all steps + small pause
    setTimeout(() => {
      selectRepo(repo)
      setPhase('done')
      setTimeout(() => navigate('/app'), 700)
    }, PROGRESS_STEPS.length * 600 + 500)
  }

  function handleCustomSubmit() {
    if (!looksLikeRepo(customUrl)) {
      setUrlError('Enter a valid repo URL or path (e.g. github.com/org/repo)')
      return
    }
    setUrlError('')
    const customRepo: MockRepo = {
      id:          'custom-' + Date.now(),
      name:        customUrl.trim().split('/').pop() ?? 'custom-repo',
      lang:        'Unknown',
      status:      'not-connected',
      files:       0,
      description: customUrl.trim(),
      updatedAt:   'just now',
    }
    beginIndexing(customRepo)
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
                Rexi needs a codebase to analyze. Pick one of your repos below or paste a URL.
              </p>
            </div>

            {/* Repo list */}
            <div className="flex flex-col gap-2">
              {mockRepos.map((repo) => (
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
                    style={{ background: LANG_COLOR[repo.lang] ?? '#888' }}
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-text-primary truncate">{repo.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md border border-white/8 text-text-secondary/60 font-mono shrink-0">
                        {repo.lang}
                      </span>
                    </div>
                    <p className="text-[11px] text-text-secondary/60 mt-0.5 truncate">{repo.description}</p>
                  </div>

                  {/* Right meta */}
                  <div className="shrink-0 flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        repo.status === 'indexed'       ? 'bg-green-400'
                        : repo.status === 'indexing'    ? 'bg-yellow-400 animate-pulse'
                        : 'bg-white/20'
                      }`} />
                      <span className={`text-[10px] font-medium ${
                        repo.status === 'indexed'    ? 'text-green-400'
                        : repo.status === 'indexing' ? 'text-yellow-400'
                        : 'text-text-secondary/50'
                      }`}>{STATUS_LABEL[repo.status]}</span>
                    </div>
                    <span className="text-[10px] text-text-secondary/40">{repo.updatedAt}</span>
                  </div>

                  <FiArrowRight size={14} className="text-text-secondary/30 group-hover:text-accent-light transition-colors shrink-0" />
                </motion.button>
              ))}
            </div>

            {/* Connect different repo */}
            <div className="mt-4">
              <button
                onClick={() => { setShowCustom((v) => !v); setUrlError('') }}
                className="w-full flex items-center gap-2 px-4 py-3 rounded-2xl border border-dashed border-white/12 hover:border-accent/30 hover:bg-accent/4 text-sm text-text-secondary/60 hover:text-text-secondary transition-colors"
              >
                {showCustom
                  ? <><FiX size={14} /> Cancel</>
                  : <><FiPlus size={14} /> Connect a different repository</>
                }
              </button>

              <AnimatePresence>
                {showCustom && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 flex flex-col gap-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={customUrl}
                          onChange={(e) => { setCustomUrl(e.target.value); setUrlError('') }}
                          onKeyDown={(e) => e.key === 'Enter' && handleCustomSubmit()}
                          placeholder="github.com/org/repo  or  /path/to/local/repo"
                          className="flex-1 px-3.5 py-2.5 rounded-xl bg-surface border border-white/8 text-sm text-text-primary placeholder:text-text-secondary/30 outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-colors"
                        />
                        <button
                          onClick={handleCustomSubmit}
                          className="px-4 py-2.5 rounded-xl bg-accent hover:bg-accent/90 text-white text-sm font-medium transition-colors shadow-lg shadow-accent/20 shrink-0"
                        >
                          Connect
                        </button>
                      </div>
                      {urlError && (
                        <p className="text-[11px] text-red-400/80 pl-1">{urlError}</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* ── INDEXING phase ─────────────────────────────────────────── */}
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
                    style={{ background: LANG_COLOR[selected.lang] ?? '#888' }}
                  />
                )}
                <span className="text-base font-semibold">{selected?.name}</span>
              </div>
              <p className="text-xs text-text-secondary/50">{selected?.description}</p>
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
                {/* Progress bar */}
                <div className="w-full h-1 rounded-full bg-white/6 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-accent"
                    animate={{ width: `${((progressStep + 1) / PROGRESS_STEPS.length) * 100}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
                {/* Step label */}
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
