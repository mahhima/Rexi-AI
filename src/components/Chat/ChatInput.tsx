import { useState, useRef, useEffect } from 'react'
import { FiArrowUp, FiPaperclip, FiMic, FiMicOff } from 'react-icons/fi'
import type { Persona } from '../../data/mockMessages'
import PersonaSwitcher from './PersonaSwitcher'

interface ChatInputProps {
  persona: Persona
  onPersonaChange: (p: Persona) => void
  onSend: (text: string) => void
  onTyping?: () => void
  disabled?: boolean
}

// SpeechRecognition browser API (prefixed in some browsers)
const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

export default function ChatInput({ persona, onPersonaChange, onSend, onTyping, disabled }: ChatInputProps) {
  const [value, setValue] = useState('')
  const [listening, setListening] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const recognitionRef = useRef<any>(null)

  // Clean up recognition on unmount
  useEffect(() => () => recognitionRef.current?.abort(), [])

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  function submit() {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setValue(e.target.value)
    onTyping?.()
    const el = e.target
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 160) + 'px'
  }

  function toggleMic() {
    if (!SpeechRecognition) return

    if (listening) {
      recognitionRef.current?.stop()
      setListening(false)
      return
    }

    const rec = new SpeechRecognition()
    rec.continuous = false
    rec.interimResults = false
    rec.lang = 'en-US'

    rec.onstart = () => {
      setListening(true)
      onTyping?.() // triggers avatar listening state
    }

    rec.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript
      setValue(transcript)
      onTyping?.()
    }

    rec.onerror = () => setListening(false)
    rec.onend   = () => setListening(false)

    recognitionRef.current = rec
    rec.start()
  }

  const micSupported = !!SpeechRecognition

  return (
    <div className="border-t border-white/6 bg-background/80 backdrop-blur-sm p-4">
      {/* Persona row */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] text-text-secondary/60 uppercase tracking-widest font-medium">Mode</span>
        <PersonaSwitcher value={persona} onChange={onPersonaChange} />
      </div>

      {/* Input box */}
      <div className={`flex items-end gap-3 px-4 py-3 rounded-xl border bg-surface transition-colors duration-200
        ${listening
          ? 'border-accent/60 ring-1 ring-accent/20'
          : 'border-white/8 hover:border-white/14 focus-within:border-accent/40'}`}
      >
        <button
          className="text-text-secondary/50 hover:text-text-secondary transition-colors pb-0.5 shrink-0"
          aria-label="Attach file"
        >
          <FiPaperclip size={15} />
        </button>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={listening ? 'Listening…' : `Ask Rexi as ${persona}…`}
          rows={1}
          disabled={disabled}
          className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-secondary/40 outline-none resize-none leading-relaxed min-h-[20px]"
          style={{ maxHeight: '160px' }}
        />

        {/* Mic button */}
        {micSupported && (
          <button
            onClick={toggleMic}
            disabled={disabled}
            className={`pb-0.5 shrink-0 transition-colors
              ${listening
                ? 'text-accent animate-pulse'
                : 'text-text-secondary/40 hover:text-text-secondary'}`}
            aria-label={listening ? 'Stop listening' : 'Talk to Rexi'}
            title={listening ? 'Stop' : 'Talk to Rexi'}
          >
            {listening ? <FiMicOff size={15} /> : <FiMic size={15} />}
          </button>
        )}

        <button
          onClick={submit}
          disabled={!value.trim() || disabled}
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-150
            disabled:bg-white/8 disabled:text-text-secondary/30
            enabled:bg-accent enabled:text-white enabled:hover:bg-accent-light enabled:shadow-md enabled:shadow-accent/20"
          aria-label="Send message"
        >
          <FiArrowUp size={13} />
        </button>
      </div>

      <p className="mt-2 text-center text-[10px] text-text-secondary/30">
        Shift+Enter for new line · Enter to send · ⌘⇧Space to talk to Rexi
      </p>
    </div>
  )
}
