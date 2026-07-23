import { motion } from 'framer-motion'
import type { ChatMessage, Persona } from '../../data/mockMessages'

const personaBadge: Record<Persona, string> = {
  Architect: 'text-violet-400 bg-violet-400/10 border-violet-400/25',
  Mentor: 'text-sky-400 bg-sky-400/10 border-sky-400/25',
  Debugger: 'text-rose-400 bg-rose-400/10 border-rose-400/25',
}

function renderContent(content: string) {
  // Bold **text** and inline `code`
  const parts = content.split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-text-primary font-semibold">{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="font-mono text-[11px] text-accent-light bg-white/6 px-1.5 py-0.5 rounded">
          {part.slice(1, -1)}
        </code>
      )
    }
    // Handle \n as line breaks
    return part.split('\n').map((line, j) => (
      <span key={`${i}-${j}`}>
        {line}
        {j < part.split('\n').length - 1 && <br />}
      </span>
    ))
  })
}

interface MessageBubbleProps {
  message: ChatMessage
  index: number
}

export default function MessageBubble({ message, index }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: 'easeOut' }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div
        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold
          ${isUser ? 'bg-white/10 text-text-secondary' : 'bg-accent text-white shadow-md shadow-accent/25'}`}
      >
        {isUser ? 'U' : 'R'}
      </div>

      {/* Content */}
      <div className={`flex flex-col gap-1.5 max-w-[82%] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Meta row */}
        <div className={`flex items-center gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="text-[10px] text-text-secondary/50">{message.timestamp}</span>
          {message.persona && (
            <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded border ${personaBadge[message.persona]}`}>
              {message.persona}
            </span>
          )}
        </div>

        {/* Bubble */}
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed border
            ${isUser
              ? 'rounded-tr-sm bg-accent/12 border-accent/20 text-text-primary'
              : 'rounded-tl-sm bg-white/4 border-white/6 text-text-secondary'
            }`}
        >
          {renderContent(message.content)}
        </div>

        {/* Code block */}
        {message.codeBlock && (
          <div className="w-full rounded-xl overflow-hidden border border-white/8">
            <div className="flex items-center justify-between px-4 py-2 bg-white/3 border-b border-white/6">
              <span className="text-[10px] text-text-secondary font-mono">{message.codeBlock.lang}</span>
              <button className="text-[10px] text-text-secondary hover:text-text-primary transition-colors">
                Copy
              </button>
            </div>
            <pre className="p-4 overflow-x-auto bg-black/30">
              <code className="font-mono text-[11px] text-text-secondary leading-relaxed whitespace-pre">
                {message.codeBlock.code}
              </code>
            </pre>
          </div>
        )}

        {/* Tags */}
        {message.tags && message.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {message.tags.map((tag) => (
              <span
                key={tag}
                className="text-[9px] px-2 py-0.5 rounded-full border border-white/8 text-text-secondary bg-white/3"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
