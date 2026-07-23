import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiMenu, FiX, FiLayers, FiArrowLeft,
  FiGitBranch, FiChevronDown,
} from 'react-icons/fi'
import AvatarSlot from '../components/Avatar/AvatarSlot'
import ChatPanel from '../components/Chat/ChatPanel'
import RepoPanel from '../components/Sidebar/RepoPanel'
import { AvatarProvider } from '../hooks/useAvatarState'
import { useSession } from '../hooks/useSession'
import { mockRepos } from '../data/mockFileTree'

const FALLBACK_REPO = mockRepos[0]

// ---------- Left panel (avatar + repo info) ----------
function LeftPanel() {
  const { selectedRepo } = useSession()
  const initialRepo = selectedRepo ?? FALLBACK_REPO
  const [repoOpen, setRepoOpen] = useState(false)
  const [activeRepo, setActiveRepo] = useState(initialRepo)

  return (
    <div className="flex flex-col h-full">
      {/* Rexi wordmark */}
      <div className="px-5 py-4 border-b border-white/6 flex items-center gap-2 shrink-0">
        <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center shadow-md shadow-accent/20">
          <span className="text-white font-bold text-[10px]">R</span>
        </div>
        <span className="font-semibold text-sm text-text-primary">Rexi</span>
      </div>

      {/* Avatar slot */}
      <div className="px-4 pt-4 shrink-0">
        <AvatarSlot />
      </div>

      {/* Repo selector */}
      <div className="px-4 mt-4 shrink-0">
        <button
          onClick={() => setRepoOpen((v) => !v)}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-white/8 bg-surface hover:border-white/15 transition-colors group"
        >
          <div className="flex items-center gap-2 min-w-0">
            <FiGitBranch size={13} className="text-text-secondary/60 shrink-0" />
            <span className="text-sm font-medium text-text-primary truncate">{activeRepo.name}</span>
          </div>
          <motion.span
            animate={{ rotate: repoOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-text-secondary/40 shrink-0 ml-1"
          >
            <FiChevronDown size={13} />
          </motion.span>
        </button>

        <AnimatePresence>
          {repoOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden mt-1"
            >
              <div className="rounded-xl border border-white/8 bg-surface overflow-hidden py-1">
                {mockRepos.map((repo) => (
                  <button
                    key={repo.id}
                    onClick={() => { setActiveRepo(repo); setRepoOpen(false) }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-left transition-colors
                      ${repo.id === activeRepo.id ? 'bg-accent/10 text-accent-light' : 'hover:bg-white/4 text-text-secondary'}`}
                  >
                    <div className="min-w-0">
                      <div className="text-[11px] font-medium truncate">{repo.name}</div>
                      <div className="text-[10px] text-text-secondary/50 mt-0.5">
                        {repo.lang} · {repo.files > 0 ? `${repo.files.toLocaleString()} files` : 'not indexed'}
                      </div>
                    </div>
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ml-2 ${
                      repo.status === 'indexed' ? 'bg-green-400'
                      : repo.status === 'indexing' ? 'bg-yellow-400'
                      : 'bg-white/20'
                    }`} />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Status pill */}
      <div className="px-4 mt-3 shrink-0">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-[11px] font-medium
          ${activeRepo.status === 'indexed'
            ? 'border-green-400/20 bg-green-400/5 text-green-400'
            : activeRepo.status === 'indexing'
            ? 'border-yellow-400/20 bg-yellow-400/5 text-yellow-400'
            : 'border-white/8 bg-white/3 text-text-secondary'}`}
        >
          <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
            activeRepo.status === 'indexed' ? 'bg-green-400'
            : activeRepo.status === 'indexing' ? 'bg-yellow-400 animate-pulse'
            : 'bg-white/20'
          }`} />
          {activeRepo.status === 'indexed' ? 'Indexed'
            : activeRepo.status === 'indexing' ? 'Indexing…'
            : 'Not connected'}
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Back to landing */}
      <div className="px-4 pb-4 shrink-0">
        <Link
          to="/"
          className="flex items-center gap-2 text-[11px] text-text-secondary/50 hover:text-text-secondary transition-colors"
        >
          <FiArrowLeft size={12} />
          Back to landing
        </Link>
      </div>
    </div>
  )
}

// ---------- Drawer wrapper for mobile ----------
interface DrawerProps {
  open: boolean
  onClose: () => void
  side: 'left' | 'right'
  children: React.ReactNode
  width: number
}

function Drawer({ open, onClose, side, children, width }: DrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 z-30 lg:hidden"
            onClick={onClose}
          />
          {/* Panel */}
          <motion.div
            initial={{ x: side === 'left' ? -width : width }}
            animate={{ x: 0 }}
            exit={{ x: side === 'left' ? -width : width }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            style={{ width }}
            className={`fixed top-0 bottom-0 z-40 bg-surface border-${side === 'left' ? 'r' : 'l'} border-white/8 overflow-hidden lg:hidden`}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1.5 text-text-secondary hover:text-text-primary"
              aria-label="Close drawer"
            >
              <FiX size={16} />
            </button>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ---------- Main AppShell ----------
export default function AppShell() {
  const [leftOpen, setLeftOpen] = useState(false)
  const [rightOpen, setRightOpen] = useState(false)
  const { selectedRepo } = useSession()
  const activeRepo = selectedRepo ?? FALLBACK_REPO

  return (
    <AvatarProvider>
      <div className="h-screen w-screen flex overflow-hidden bg-background text-text-primary font-sans">

        {/* ── LEFT COLUMN (desktop fixed 320px) ── */}
        <aside className="hidden lg:flex flex-col w-80 shrink-0 border-r border-white/6 bg-surface/60 overflow-hidden">
          <LeftPanel />
        </aside>

      {/* ── CENTER COLUMN ── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-white/6 bg-surface/80 backdrop-blur-sm shrink-0">
          <button
            onClick={() => setLeftOpen(true)}
            className="p-1.5 text-text-secondary hover:text-text-primary"
            aria-label="Open left panel"
          >
            <FiMenu size={18} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-accent flex items-center justify-center">
              <span className="text-white font-bold text-[9px]">R</span>
            </div>
            <span className="text-sm font-semibold">Rexi</span>
          </div>
          <button
            onClick={() => setRightOpen(true)}
            className="p-1.5 text-text-secondary hover:text-text-primary"
            aria-label="Open right panel"
          >
            <FiLayers size={18} />
          </button>
        </div>

        {/* Chat takes all remaining height */}
        <div className="flex-1 overflow-hidden">
          <ChatPanel />
        </div>
      </main>

      {/* ── RIGHT COLUMN (desktop fixed 280px) ── */}
      <aside className="hidden lg:flex flex-col w-[280px] shrink-0 border-l border-white/6 bg-surface/60 overflow-hidden">
        <RepoPanel repoName={activeRepo.name} status={activeRepo.status} />
      </aside>

      {/* ── MOBILE DRAWERS ── */}
      <Drawer open={leftOpen} onClose={() => setLeftOpen(false)} side="left" width={300}>
        <LeftPanel />
      </Drawer>

      <Drawer open={rightOpen} onClose={() => setRightOpen(false)} side="right" width={280}>
        <RepoPanel repoName={activeRepo.name} status={activeRepo.status} />
      </Drawer>
      </div>
    </AvatarProvider>
  )
}
