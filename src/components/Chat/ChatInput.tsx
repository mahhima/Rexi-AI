import { useState, useRef } from 'react'
import { FiArrowUp, FiPaperclip } from 'react-icons/fi'
import type { Persona } from '../../data/mockMessages'
import PersonaSwitcher from './PersonaSwitcher'

interface ChatInputProps {
  persona: Persona
  onPersonaChange: (p: Persona) => void
  onSend: (text: string) => void
  onTyping?: () => void
  disabled?: boolean
}

export default function ChatInput({ persona, onPersonaChange, onSend, onTyping, disabled }: ChatInputProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setValue(e.target.value)
    onTyping?.()
    // Auto-grow
    const el = e.target
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 160) + 'px'
  }

  return (
    <div className="border-t border-white/6 bg-background/80 backdrop-blur-sm p-4">
      {/* Persona row */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] text-text-secondary/60 uppercase tracking-widest font-medium">Mode</span>
        <PersonaSwitcher value={persona} onChange={onPersonaChange} />
      </div>

      {/* Input box */}
      <div className="flex items-end gap-3 px-4 py-3 rounded-xl border border-white/8 bg-surface hover:border-white/14 focus-within:border-accent/40 transition-colors duration-200">
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
          placeholder={`Ask Rexi as ${persona}…`}
          rows={1}
          disabled={disabled}
          className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-secondary/40 outline-none resize-none leading-relaxed min-h-[20px]"
          style={{ maxHeight: '160px' }}
        />

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
        Shift+Enter for new line · Enter to send
      </p>
    </div>
  )
}
