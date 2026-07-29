import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import {
  FiMenu, FiX, FiLayers, FiArrowLeft,
  FiGitBranch, FiLink, FiArrowRight, FiMic, FiXCircle, FiMessageSquare,
} from 'react-icons/fi'
import { Avatar } from '../components/Avatar/Avatar'
import ChatPanel from '../components/Chat/ChatPanel'
import RepoPanel from '../components/Sidebar/RepoPanel'
import { AvatarProvider, useAvatarState } from '../hooks/useAvatarState'
import { useSession, type Repo } from '../hooks/useSession'

const BACKEND_URL = 'http://localhost:8000'
const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

// ── Voice mode overlay ────────────────────────────────────────────────────────
function VoiceModeOverlay({ onClose, onTranscript }: {
  onClose: () => void
  onTranscript: (text: string) => void
}) {
  const { state: avatarState, notifyTyping, goIdle } = useAvatarState()
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [recObj, setRecObj] = useState<any>(null)

  function startListening() {
    if (!SpeechRecognition) return
    notifyTyping()
    const rec = new SpeechRecognition()
    rec.continuous = false
    rec.interimResults = true
    rec.lang = 'en-US'
    rec.onstart = () => setListening(true)
    rec.onresult = (e: any) => {
      const t = Array.from(e.results as any[]).map((r: any) => r[0].transcript).join('')
      setTranscript(t)
      notifyTyping()
    }
    rec.onend = () => {
      setListening(false)
      if (transcript.trim()) {
        goIdle()
        onTranscript(transcript.trim())
        setTranscript('')
        onClose()
      }
    }
    rec.onerror = () => { setListening(false); goIdle() }
    setRecObj(rec)
    rec.start()
  }

  function stopListening() { recObj?.stop() }

  return (
    <motion.div
      key="voice-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm"
    >
      {/* Avatar travels here via layoutId */}
      <motion.div
        layoutId="rexi-avatar"
        className="rounded-2xl overflow-hidden"
        style={{ width: 260, height: 260 }}
        transition={{ type: 'spring', stiffness: 200, damping: 28 }}
      >
        <Avatar state={avatarState} />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mt-6 text-sm font-medium text-text-primary"
      >
        {listening ? 'Listening…' : transcript ? 'Got it!' : 'Tap the mic and speak'}
      </motion.p>

      {transcript && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 text-xs text-text-secondary/60 max-w-xs text-center px-4"
        >
          "{transcript}"
        </motion.p>
      )}

      <motion.button
        onClick={listening ? stopListening : startListening}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 260, damping: 22 }}
        whileTap={{ scale: 0.93 }}
        className={`mt-8 w-16 h-16 rounded-full flex items-center justify-center transition-colors shadow-lg
          ${listening
            ? 'bg-red-500 hover:bg-red-400 shadow-red-500/30 animate-pulse'
            : 'bg-accent hover:bg-accent-light shadow-accent/30'}`}
        aria-label={listening ? 'Stop' : 'Start speaking'}
      >
        <FiMic size={24} className="text-white" />
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="mt-4 text-[11px] text-text-secondary/40"
      >
        {listening ? 'Tap to stop' : 'Rexi is ready to listen'}
      </motion.p>

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-text-secondary/40 hover:text-text-secondary transition-colors"
        aria-label="Exit voice mode"
      >
        <FiXCircle size={20} />
      </button>
    </motion.div>
  )
}

// ---------- Left panel ----------
function LeftPanel({ voiceMode, onToggleVoice }: {
  voiceMode: boolean
  onToggleVoice: () => void
}) {
  const { state: avatarState } = useAvatarState()
  const { selectedRepo, hasGitHub, selectRepo } = useSession()
  const [repoUrl, setRepoUrl] = useState('')
  const [urlError, setUrlError] = useState('')

  function handleUrlConnect() {
    const trimmed = repoUrl.trim()
    if (!trimmed) { setUrlError('Paste a repo URL first.'); return }
    const match = trimmed.match(/github\.com[/:]([^/]+)\/([^/.]+)/)
    if (!match) { setUrlError('Paste a valid GitHub URL, e.g. github.com/owner/repo'); return }
    setUrlError('')
    const [, owner, name] = match
    const fakeRepo: Repo = {
      id: Date.now(), name, full_name: `${owner}/${name}`,
      description: null, language: null, updated_at: null,
      clone_url: `https://github.com/${owner}/${name}.git`, private: false,
    }
    selectRepo(fakeRepo)
    setRepoUrl('')
  }

  return (
    <div className="flex flex-col h-full">
      {/* Wordmark */}
      <div className="px-5 py-4 border-b border-white/6 flex items-center gap-2 shrink-0">
        <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center shadow-md shadow-accent/20">
          <span className="text-white font-bold text-[10px]">R</span>
        </div>
        <span className="font-semibold text-sm text-text-primary">Rexi</span>
      </div>

      {/* Avatar slot — disappears when voice mode is on (avatar travels to center) */}
      <div className="px-4 pt-4 shrink-0">
        <AnimatePresence>
          {!voiceMode && (
            <motion.div
              layoutId="rexi-avatar"
              className="w-full aspect-square rounded-2xl border border-white/8 bg-surface/50 overflow-hidden flex items-center justify-center"
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 28 }}
            >
              <Avatar state={avatarState} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Placeholder keeps layout stable when avatar is gone */}
        {voiceMode && <div className="w-full aspect-square" />}
      </div>

      {/* Talk / Go back button */}
      <div className="px-4 pt-3 shrink-0">
        <button
          onClick={onToggleVoice}
          className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-medium transition-colors
            ${voiceMode
              ? 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 text-text-secondary'
              : 'bg-accent/10 hover:bg-accent/20 border-accent/25 hover:border-accent/40 text-accent-light'}`}
          title="⌘⇧Space"
        >
          {voiceMode
            ? <><FiMessageSquare size={13} /> Go back to chat</>
            : <><FiMic size={13} /> Talk to Rexi</>}
        </button>
      </div>

      {/* Repo section */}
      {hasGitHub && selectedRepo && (
        <div className="px-4 mt-4 shrink-0 flex flex-col gap-2">
          <div className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border border-white/8 bg-surface">
            <FiGitBranch size={13} className="text-text-secondary/60 shrink-0" />
            <span className="text-sm font-medium text-text-primary truncate">{selectedRepo.name}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-green-400/20 bg-green-400/5 text-green-400 text-[11px] font-medium">
            <div className="w-1.5 h-1.5 rounded-full shrink-0 bg-green-400" />
            Connected
          </div>
          <Link to="/connect-repo" className="text-[11px] text-accent-light hover:text-accent transition-colors pl-1">
            Switch repo →
          </Link>
        </div>
      )}

      {!hasGitHub && (
        <div className="px-4 mt-4 shrink-0 flex flex-col gap-3">
          {selectedRepo && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-white/8 bg-surface">
              <FiGitBranch size={13} className="text-text-secondary/60 shrink-0" />
              <span className="text-sm font-medium text-text-primary truncate">{selectedRepo.full_name}</span>
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] text-text-secondary/60 font-medium flex items-center gap-1.5">
              <FiLink size={11} />
              {selectedRepo ? 'Change repo' : 'Paste a repo URL'}
            </span>
            <div className="flex gap-1.5">
              <input
                type="text" value={repoUrl}
                onChange={(e) => { setRepoUrl(e.target.value); setUrlError('') }}
                onKeyDown={(e) => e.key === 'Enter' && handleUrlConnect()}
                placeholder="github.com/owner/repo"
                className="flex-1 min-w-0 px-3 py-2 rounded-xl bg-surface border border-white/8 text-xs text-text-primary placeholder:text-text-secondary/30 outline-none focus:border-accent/50 transition-colors"
              />
              <button onClick={handleUrlConnect} className="px-2.5 py-2 rounded-xl bg-accent hover:bg-accent/90 text-white shrink-0 transition-colors">
                <FiArrowRight size={13} />
              </button>
            </div>
            {urlError && <p className="text-[10px] text-red-400/80 pl-1">{urlError}</p>}
          </div>
          <button
            onClick={() => { window.location.href = `${BACKEND_URL}/auth/github/login` }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-white/10 hover:border-accent/30 hover:bg-accent/5 text-[11px] text-text-secondary/60 hover:text-text-secondary transition-colors"
          >
            <FiGitBranch size={12} />
            Connect GitHub to browse repos
          </button>
        </div>
      )}

      <div className="flex-1" />

      <div className="px-4 pb-4 shrink-0">
        <Link to="/" className="flex items-center gap-2 text-[11px] text-text-secondary/50 hover:text-text-secondary transition-colors">
          <FiArrowLeft size={12} />
          Back to landing
        </Link>
      </div>
    </div>
  )
}

// ---------- Drawer ----------
interface DrawerProps { open: boolean; onClose: () => void; side: 'left' | 'right'; children: React.ReactNode; width: number }
function Drawer({ open, onClose, side, children, width }: DrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={onClose} />
          <motion.div
            initial={{ x: side === 'left' ? -width : width }} animate={{ x: 0 }} exit={{ x: side === 'left' ? -width : width }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }} style={{ width }}
            className={`fixed top-0 bottom-0 z-40 bg-surface border-${side === 'left' ? 'r' : 'l'} border-white/8 overflow-hidden lg:hidden`}
          >
            <button onClick={onClose} className="absolute top-3 right-3 p-1.5 text-text-secondary hover:text-text-primary" aria-label="Close drawer"><FiX size={16} /></button>
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
  const [voiceMode, setVoiceMode] = useState(false)
  const [pendingTranscript, setPendingTranscript] = useState('')

  // Cmd/Ctrl + Shift + Space toggles voice mode
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.code === 'Space' && e.shiftKey && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setVoiceMode((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  const { selectedRepo } = useSession()
  const repoName = selectedRepo?.name ?? 'Repository'

  return (
    <AvatarProvider>
      <LayoutGroup>
        <div className="h-screen w-screen flex overflow-hidden bg-background text-text-primary font-sans">

          {/* LEFT COLUMN */}
          <aside className="hidden lg:flex flex-col w-80 shrink-0 border-r border-white/6 bg-surface/60 overflow-hidden">
            <LeftPanel voiceMode={voiceMode} onToggleVoice={() => setVoiceMode((v) => !v)} />
          </aside>

          {/* CENTER COLUMN */}
          <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
            <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-white/6 bg-surface/80 backdrop-blur-sm shrink-0">
              <button onClick={() => setLeftOpen(true)} className="p-1.5 text-text-secondary hover:text-text-primary" aria-label="Open left panel"><FiMenu size={18} /></button>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-accent flex items-center justify-center"><span className="text-white font-bold text-[9px]">R</span></div>
                <span className="text-sm font-semibold">Rexi</span>
              </div>
              <button onClick={() => setRightOpen(true)} className="p-1.5 text-text-secondary hover:text-text-primary" aria-label="Open right panel"><FiLayers size={18} /></button>
            </div>

            <div className="flex-1 overflow-hidden">
              <ChatPanel
                pendingTranscript={pendingTranscript}
                onTranscriptConsumed={() => setPendingTranscript('')}
              />
            </div>

            {/* Voice overlay — Rexi travels here */}
            <AnimatePresence>
              {voiceMode && (
                <VoiceModeOverlay
                  onClose={() => setVoiceMode(false)}
                  onTranscript={(t) => { setPendingTranscript(t); setVoiceMode(false) }}
                />
              )}
            </AnimatePresence>
          </main>

          {/* RIGHT COLUMN */}
          <aside className="hidden lg:flex flex-col w-[280px] shrink-0 border-l border-white/6 bg-surface/60 overflow-hidden">
            <RepoPanel repoName={repoName} status="indexed" />
          </aside>

          {/* MOBILE DRAWERS */}
          <Drawer open={leftOpen} onClose={() => setLeftOpen(false)} side="left" width={300}>
            <LeftPanel voiceMode={voiceMode} onToggleVoice={() => { setLeftOpen(false); setVoiceMode((v) => !v) }} />
          </Drawer>
          <Drawer open={rightOpen} onClose={() => setRightOpen(false)} side="right" width={280}>
            <RepoPanel repoName={repoName} status="indexed" />
          </Drawer>
        </div>
      </LayoutGroup>
    </AvatarProvider>
  )
}
