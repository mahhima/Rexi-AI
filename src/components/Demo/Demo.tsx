import { motion } from 'framer-motion'
import { FiArrowRight, FiFile, FiShare2 } from 'react-icons/fi'

const conversation = [
  {
    role: 'user' as const,
    content: 'Explain authentication.',
  },
  {
    role: 'rexi' as const,
    content: null,
  },
]

function RexiResponse() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-text-secondary leading-relaxed">
        The authentication system in <span className="text-text-primary font-medium">auth-service</span> follows a stateless JWT approach with refresh token rotation. Here's how it flows:
      </p>

      {/* Flow diagram */}
      <div className="rounded-xl border border-white/8 bg-white/3 p-4">
        <div className="flex items-center gap-1.5 mb-3">
          <FiShare2 size={11} className="text-accent" />
          <span className="text-[10px] text-accent font-medium uppercase tracking-wide">Dependency graph</span>
        </div>
        <div className="flex flex-col gap-2">
          {[
            { file: 'src/routes/auth.ts', desc: 'Entry point — /login, /refresh, /logout' },
            { file: 'src/auth/jwt.ts', desc: 'Signs & verifies tokens (RS256)' },
            { file: 'src/auth/password.ts', desc: 'bcrypt hashing & comparison' },
            { file: 'src/session/store.ts', desc: 'Redis-backed refresh token registry' },
            { file: 'src/middleware/guard.ts', desc: 'Protects routes, validates Bearer tokens' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              {i > 0 && (
                <div className="flex flex-col items-center self-stretch -mt-1 ml-2 mr-1.5">
                  <div className="w-px flex-1 bg-accent/20" />
                  <div className="w-1 h-1 rounded-full bg-accent/40 mb-1.5" />
                </div>
              )}
              <div className={`flex items-start gap-2 flex-1 ${i > 0 ? 'ml-4' : ''}`}>
                <FiFile size={11} className="text-text-secondary mt-0.5 shrink-0" />
                <div>
                  <code className="text-[11px] text-accent-light font-mono">{item.file}</code>
                  <p className="text-[11px] text-text-secondary mt-0.5">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-sm text-text-secondary leading-relaxed">
        On login, credentials are validated in <code className="text-[11px] text-accent-light font-mono bg-white/5 px-1.5 py-0.5 rounded">password.ts</code>, then a short-lived <strong className="text-text-primary font-medium">access token (15m)</strong> and a long-lived <strong className="text-text-primary font-medium">refresh token (7d)</strong> are issued. The refresh token is stored in Redis with a device fingerprint to enable selective revocation.
      </p>

      <div className="flex flex-wrap gap-2">
        {['View jwt.ts', 'Explain refresh flow', 'Find security issues'].map((action) => (
          <button
            key={action}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-text-secondary hover:text-text-primary border border-white/8 hover:border-white/15 bg-white/3 hover:bg-white/5 transition-all"
          >
            {action}
            <FiArrowRight size={10} />
          </button>
        ))}
      </div>
    </div>
  )
}

export default function Demo() {
  return (
    <section id="demo" className="py-32 px-6 relative overflow-hidden">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-px opacity-40"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.6), transparent)' }}
      />

      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.4) 0%, transparent 70%)' }}
      />

      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs uppercase tracking-widest text-accent font-semibold">Demo</span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-bold text-gradient leading-tight">
            See Rexi in action
          </h2>
          <p className="mt-4 text-text-secondary text-lg">
            Ask a question, get expert-level insight — with sources.
          </p>
        </motion.div>

        {/* Chat window */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="rounded-2xl border border-white/8 bg-surface overflow-hidden shadow-2xl shadow-black/40"
        >
          {/* Window chrome */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 bg-black/20">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-accent flex items-center justify-center">
                <span className="text-white font-bold text-[9px]">R</span>
              </div>
              <span className="text-sm font-medium text-text-primary">Rexi</span>
              <span className="text-text-secondary/40 text-sm">·</span>
              <span className="text-xs text-text-secondary">auth-service</span>
            </div>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
            </div>
          </div>

          <div className="p-6 space-y-6">
            {conversation.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs
                  ${msg.role === 'rexi' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-white/10 text-text-secondary'}`}
                >
                  {msg.role === 'rexi' ? 'R' : 'U'}
                </div>

                {/* Bubble */}
                <div className={`max-w-[88%] rounded-2xl px-5 py-4 border
                  ${msg.role === 'user'
                    ? 'rounded-tr-sm bg-accent/12 border-accent/20 text-text-primary'
                    : 'rounded-tl-sm bg-white/3 border-white/6'}`}
                >
                  {msg.role === 'user' ? (
                    <p className="text-sm font-medium">{msg.content}</p>
                  ) : (
                    <RexiResponse />
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Input bar */}
          <div className="px-6 pb-6">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/8 bg-white/3 hover:border-white/12 transition-colors group">
              <input
                readOnly
                placeholder="Ask Rexi about your codebase…"
                className="flex-1 bg-transparent text-sm text-text-secondary placeholder:text-text-secondary/50 outline-none cursor-default"
              />
              <button className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center hover:bg-accent-light transition-colors shadow-md shadow-accent/20">
                <FiArrowRight size={14} className="text-white" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
