import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import MessageBubble from './MessageBubble'
import ChatInput from './ChatInput'
import { useAvatarState } from '../../hooks/useAvatarState'
import { type ChatMessage, type Persona } from '../../data/mockMessages'
import { FiZap, FiVolume2, FiVolumeX } from 'react-icons/fi'

let nextId = 100

function buildRexiReply(question: string, persona: Persona): ChatMessage {
  const content =
    persona === 'Debugger'
      ? `Let me trace that. In **${question.slice(0, 30)}…**, the likely entry point is \`src/routes/\`. I'd check for unhandled promise rejections first — they're the most common silent failure mode in this service.`
      : persona === 'Mentor'
      ? `Great question. To understand **${question.slice(0, 30)}…** deeply, start by reading \`src/index.ts\` — it's the composition root and will show you how all the pieces wire together.`
      : `The **${question.slice(0, 30)}…** concern spans the \`auth\`, \`session\`, and \`middleware\` modules. The key dependency is \`src/auth/jwt.ts\` → \`src/middleware/guard.ts\`.`
  return {
    id: String(nextId++),
    role: 'rexi',
    persona,
    content,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }
}

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\n+/g, '. ')
}

export default function ChatPanel({
  pendingTranscript = '',
  onTranscriptConsumed,
}: {
  pendingTranscript?: string
  onTranscriptConsumed?: () => void
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [persona, setPersona] = useState<Persona>('Architect')
  const [hasGreeted, setHasGreeted] = useState(false)
  const [ttsEnabled, setTtsEnabled] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  const { state: avatarState, notifyTyping, startGreeting, startThinking, startSpeaking, goIdle } = useAvatarState()
  const thinkTimer  = useRef<ReturnType<typeof setTimeout>>()
  const streamTimer = useRef<ReturnType<typeof setInterval>>()

  const isThinking = avatarState === 'thinking'
  const isBusy     = avatarState === 'thinking' || avatarState === 'speaking'

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, avatarState])

  useEffect(() => () => {
    clearTimeout(thinkTimer.current)
    clearInterval(streamTimer.current)
    window.speechSynthesis?.cancel()
  }, [])

  // When voice mode sends a transcript, auto-send it as a message
  useEffect(() => {
    if (!pendingTranscript) return
    handleSend(pendingTranscript)
    onTranscriptConsumed?.()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingTranscript])

  function handleTyping() {
    if (!hasGreeted) {
      setHasGreeted(true)
      startGreeting()
    } else {
      notifyTyping()
    }
  }

  function speakText(text: string) {
    if (!ttsEnabled || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(stripMarkdown(text))
    utter.rate  = 1.05
    utter.pitch = 1.0
    const voices = window.speechSynthesis.getVoices()
    const preferred = voices.find((v) =>
      v.name.toLowerCase().includes('samantha') ||
      v.name.toLowerCase().includes('google uk english female') ||
      v.lang === 'en-US'
    )
    if (preferred) utter.voice = preferred
    window.speechSynthesis.speak(utter)
  }

  function handleSend(text: string) {
    const userMsg: ChatMessage = {
      id: String(nextId++),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages((prev) => [...prev, userMsg])
    startThinking()

    thinkTimer.current = setTimeout(() => {
      const reply = buildRexiReply(text, persona)
      const words = reply.content.split(' ')
      setMessages((prev) => [...prev, { ...reply, content: '' }])
      startSpeaking()

      let shown = 0
      streamTimer.current = setInterval(() => {
        shown = Math.min(shown + 3, words.length)
        const partial = words.slice(0, shown).join(' ')
        setMessages((prev) =>
          prev.map((m) => (m.id === reply.id ? { ...m, content: partial } : m))
        )
        if (shown >= words.length) {
          clearInterval(streamTimer.current)
          streamTimer.current = undefined
          goIdle()
          speakText(reply.content)
        }
      }, 70)
    }, 900)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/6 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center shadow-md shadow-accent/20">
            <span className="text-white font-bold text-[10px]">R</span>
          </div>
          <span className="font-semibold text-sm text-text-primary">Rexi</span>
          <span className="text-text-secondary/30 text-sm">·</span>
          <span className="text-xs text-text-secondary">auth-service</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setTtsEnabled((v) => !v); window.speechSynthesis?.cancel() }}
            className="text-text-secondary/40 hover:text-text-secondary transition-colors"
            title={ttsEnabled ? 'Mute voice' : 'Unmute voice'}
          >
            {ttsEnabled ? <FiVolume2 size={14} /> : <FiVolumeX size={14} />}
          </button>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span className="text-[11px] text-text-secondary">Ready</span>
          </div>
        </div>
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto px-5 py-5 scroll-smooth">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center gap-3 text-center pointer-events-none select-none">
            <p className="text-sm font-medium text-text-primary">Ask me anything about your repo</p>
            <p className="text-xs text-text-secondary/50">Architecture · Debugging · Code review</p>
          </div>
        )}

        <div className="space-y-6">
          {messages.map((msg, i) => (
            <MessageBubble key={msg.id} message={msg} index={i} />
          ))}
        </div>

        <AnimatePresence>
          {isThinking && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25 }}
              className="flex gap-3 items-center mt-6"
            >
              <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center shadow-md shadow-accent/25 shrink-0">
                <span className="text-white font-bold text-[10px]">R</span>
              </div>
              <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-tl-sm bg-white/4 border border-white/6">
                <FiZap size={11} className="text-accent mr-1" />
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-accent"
                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.18 }}
                  />
                ))}
                <span className="text-[11px] text-text-secondary ml-1">Thinking…</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      <ChatInput
        persona={persona}
        onPersonaChange={setPersona}
        onSend={handleSend}
        onTyping={handleTyping}
        disabled={isBusy}
      />
    </div>
  )
}
