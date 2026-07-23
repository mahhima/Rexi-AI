import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiGithub, FiArrowRight, FiFolder, FiMessageSquare, FiCode, FiShare2, FiZap } from 'react-icons/fi'

function AppPreview() {
  return (
    <div className="relative w-full max-w-[580px] rounded-2xl overflow-hidden shadow-2xl shadow-black/60 border border-white/8"
      style={{ background: '#0D0D0F' }}>

      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5" style={{ background: '#0A0A0C' }}>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div className="w-3 h-3 rounded-full bg-green-500/70" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="px-4 py-1 rounded-md text-xs text-text-secondary bg-white/5 border border-white/5">
            rexi.app — auth-service
          </div>
        </div>
      </div>

      <div className="flex h-[400px]">
        {/* Sidebar */}
        <div className="w-48 border-r border-white/5 flex flex-col" style={{ background: '#0A0A0C' }}>
          {/* Search */}
          <div className="px-3 py-3 border-b border-white/5">
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/5">
              <FiFolder size={11} className="text-text-secondary" />
              <span className="text-[10px] text-text-secondary">Search repos…</span>
            </div>
          </div>

          {/* Repo list */}
          <div className="flex-1 overflow-hidden">
            <div className="px-3 pt-3 pb-1">
              <span className="text-[9px] text-text-secondary uppercase tracking-widest font-medium">Repositories</span>
            </div>
            {[
              { name: 'auth-service', lang: 'TS', active: true },
              { name: 'api-gateway', lang: 'Go', active: false },
              { name: 'web-client', lang: 'TSX', active: false },
              { name: 'ml-pipeline', lang: 'Py', active: false },
            ].map((repo) => (
              <div
                key={repo.name}
                className={`mx-2 mb-0.5 px-2 py-1.5 rounded-md flex items-center justify-between cursor-pointer ${
                  repo.active
                    ? 'bg-accent/15 border border-accent/20'
                    : 'hover:bg-white/4'
                }`}
              >
                <span className={`text-[10px] font-medium truncate ${repo.active ? 'text-accent-light' : 'text-text-secondary'}`}>
                  {repo.name}
                </span>
                <span className="text-[9px] text-text-secondary/60 ml-1 shrink-0">{repo.lang}</span>
              </div>
            ))}

            <div className="px-3 pt-4 pb-1">
              <span className="text-[9px] text-text-secondary uppercase tracking-widest font-medium">Recent</span>
            </div>
            {[
              { label: 'Auth flow', icon: FiShare2 },
              { label: 'JWT middleware', icon: FiCode },
              { label: 'Architecture', icon: FiZap },
            ].map((item) => (
              <div key={item.label} className="mx-2 mb-0.5 px-2 py-1.5 rounded-md flex items-center gap-1.5 hover:bg-white/4 cursor-pointer">
                <item.icon size={10} className="text-text-secondary/60 shrink-0" />
                <span className="text-[10px] text-text-secondary truncate">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tab bar */}
          <div className="flex border-b border-white/5 px-2 pt-2 gap-1">
            {[
              { label: 'Chat', icon: FiMessageSquare, active: true },
              { label: 'Architecture', icon: FiShare2, active: false },
              { label: 'Code', icon: FiCode, active: false },
            ].map((tab) => (
              <button
                key={tab.label}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-md text-[10px] font-medium border-b-2 transition-colors ${
                  tab.active
                    ? 'text-accent-light border-accent bg-accent/8'
                    : 'text-text-secondary border-transparent hover:text-text-primary'
                }`}
              >
                <tab.icon size={10} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Chat area */}
          <div className="flex-1 overflow-hidden flex flex-col p-3 gap-2">
            {/* Rexi message */}
            <div className="flex gap-2">
              <div className="w-5 h-5 rounded-md bg-accent flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-white font-bold text-[8px]">R</span>
              </div>
              <div className="flex-1 rounded-xl rounded-tl-sm px-3 py-2.5 bg-white/5 border border-white/6">
                <div className="text-[10px] text-accent-light font-medium mb-1">Rexi</div>
                <p className="text-[10px] text-text-secondary leading-relaxed">
                  I've mapped <span className="text-text-primary font-medium">auth-service</span>. The authentication flow spans 3 main modules:
                </p>
                <div className="mt-2 space-y-1">
                  {[
                    { file: 'src/auth/jwt.ts', desc: 'Token generation & validation' },
                    { file: 'src/middleware/guard.ts', desc: 'Route protection' },
                    { file: 'src/session/store.ts', desc: 'Session persistence' },
                  ].map((f) => (
                    <div key={f.file} className="flex items-start gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-accent/60 mt-[5px] shrink-0" />
                      <div>
                        <code className="text-[9px] text-accent-light font-mono">{f.file}</code>
                        <span className="text-[9px] text-text-secondary ml-1">— {f.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* User message */}
            <div className="flex gap-2 flex-row-reverse">
              <div className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-white font-bold text-[8px]">U</span>
              </div>
              <div className="rounded-xl rounded-tr-sm px-3 py-2 bg-accent/15 border border-accent/20">
                <p className="text-[10px] text-text-primary">Where is the token refresh logic?</p>
              </div>
            </div>

            {/* Typing indicator */}
            <div className="flex gap-2">
              <div className="w-5 h-5 rounded-md bg-accent flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-[8px]">R</span>
              </div>
              <div className="px-3 py-2.5 rounded-xl rounded-tl-sm bg-white/5 border border-white/6 flex items-center gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1 h-1 rounded-full bg-accent"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Input area */}
          <div className="p-3 border-t border-white/5">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/8">
              <span className="text-[10px] text-text-secondary flex-1">Ask Rexi anything about this repo…</span>
              <div className="w-5 h-5 rounded-md bg-accent/80 flex items-center justify-center">
                <FiArrowRight size={10} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-1.5 border-t border-white/5" style={{ background: '#0A0A0C' }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span className="text-[9px] text-text-secondary">Connected</span>
          </div>
          <span className="text-[9px] text-text-secondary/50">auth-service · 2,847 files indexed</span>
        </div>
        <span className="text-[9px] text-text-secondary/50">GPT-4o · 8k ctx</span>
      </div>
    </div>
  )
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.4) 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.18, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute top-1/3 -right-48 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)' }}
        />
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center w-full">
        {/* Left: copy */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/30 bg-accent/8 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-xs text-accent-light font-medium">Now in early access</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-6xl sm:text-7xl font-bold tracking-tight leading-none mb-4"
          >
            <span className="text-gradient">Meet Rexi.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-2xl sm:text-3xl font-semibold text-gradient-accent mb-6"
          >
            Your AI Software Engineer.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-text-secondary text-lg leading-relaxed mb-10 max-w-md"
          >
            Understand any codebase.<br />
            Ship features faster.<br />
            Learn from your projects.<br />
            <span className="text-text-primary font-medium">Rexi becomes your teammate.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              to="/auth"
              className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-accent hover:bg-accent-light text-white font-medium transition-all duration-200 shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:-translate-y-0.5"
            >
              Get Started
              <FiArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 hover:border-white/20 text-text-secondary hover:text-text-primary font-medium transition-all duration-200 hover:-translate-y-0.5 bg-white/3 hover:bg-white/5"
            >
              <FiGithub size={16} />
              View GitHub
            </a>
          </motion.div>
        </div>

        {/* Right: app preview */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative flex justify-center lg:justify-end"
        >
          <div className="absolute inset-0 bg-gradient-radial from-accent/10 to-transparent rounded-3xl blur-3xl scale-110 pointer-events-none" />
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <AppPreview />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
