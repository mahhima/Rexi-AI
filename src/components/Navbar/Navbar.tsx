import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiGithub, FiMenu, FiX, FiLogOut, FiLayers } from 'react-icons/fi'
import { useScrollY } from '../../hooks/useScrollY'
import { useSession } from '../../hooks/useSession'

const links = [
  { label: 'Features', href: '#features' },
  { label: 'Roadmap', href: '#roadmap' },
  { label: 'Documentation', href: '#docs' },
]

function UserMenu() {
  const { logout, selectedRepo } = useSession()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function handleLogout() {
    logout()
    setOpen(false)
    navigate('/')
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-surface/60 hover:border-white/20 hover:bg-surface transition-colors"
      >
        {/* Avatar circle */}
        <div className="w-6 h-6 rounded-full bg-accent/30 border border-accent/40 flex items-center justify-center shrink-0">
          <span className="text-[10px] font-bold text-accent-light">R</span>
        </div>
        {selectedRepo && (
          <span className="text-xs text-text-secondary/80 max-w-[120px] truncate hidden sm:block">
            {selectedRepo.name}
          </span>
        )}
        <FiLayers size={12} className="text-text-secondary/50" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.14 }}
            className="absolute right-0 mt-2 w-44 rounded-xl border border-white/8 bg-surface shadow-xl shadow-black/40 overflow-hidden z-50"
          >
            <Link
              to="/app"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-secondary hover:bg-white/5 hover:text-text-primary transition-colors"
            >
              <FiLayers size={13} />
              Open Rexi
            </Link>
            <div className="h-px bg-white/6 mx-2" />
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400/80 hover:bg-red-400/6 hover:text-red-400 transition-colors"
            >
              <FiLogOut size={13} />
              Log out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Navbar() {
  const scrollY = useScrollY()
  const { loggedIn, logout } = useSession()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const scrolled = scrollY > 20

  function handleLogout() {
    logout()
    setOpen(false)
    navigate('/')
  }

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass border-b border-white/5 shadow-xl shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center shadow-lg shadow-accent/30 group-hover:shadow-accent/50 transition-shadow">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <span className="font-semibold text-text-primary tracking-tight">Rexi</span>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="text-text-secondary hover:text-text-primary transition-colors p-2"
            aria-label="GitHub"
          >
            <FiGithub size={18} />
          </a>
          {loggedIn ? (
            <UserMenu />
          ) : (
            <Link
              to="/auth"
              className="px-4 py-2 text-sm font-medium rounded-lg bg-accent hover:bg-accent-light text-white transition-colors duration-200 shadow-lg shadow-accent/20"
            >
              Get Started
            </Link>
          )}
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden text-text-secondary hover:text-text-primary p-1"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden glass border-t border-white/5 overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-text-secondary hover:text-text-primary transition-colors py-1"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="text-text-secondary hover:text-text-primary transition-colors py-1 flex items-center gap-2"
              >
                <FiGithub size={16} /> GitHub
              </a>
              {loggedIn ? (
                <>
                  <Link
                    to="/app"
                    onClick={() => setOpen(false)}
                    className="mt-2 px-4 py-2.5 text-sm font-medium rounded-lg border border-white/10 text-text-secondary text-center transition-colors"
                  >
                    Open Rexi
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2.5 text-sm font-medium rounded-lg text-red-400/80 border border-red-400/20 text-center transition-colors"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="mt-2 px-4 py-2.5 text-sm font-medium rounded-lg bg-accent hover:bg-accent-light text-white transition-colors text-center"
                >
                  Get Started
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
