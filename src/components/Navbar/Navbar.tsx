import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiGithub, FiMenu, FiX } from 'react-icons/fi'
import { useScrollY } from '../../hooks/useScrollY'

const links = [
  { label: 'Features', href: '#features' },
  { label: 'Roadmap', href: '#roadmap' },
  { label: 'Documentation', href: '#docs' },
]

export default function Navbar() {
  const scrollY = useScrollY()
  const [open, setOpen] = useState(false)
  const scrolled = scrollY > 20

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
          <Link
            to="/auth"
            className="px-4 py-2 text-sm font-medium rounded-lg bg-accent hover:bg-accent-light text-white transition-colors duration-200 shadow-lg shadow-accent/20"
          >
            Get Started
          </Link>
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
              <Link
                to="/auth"
                className="mt-2 px-4 py-2.5 text-sm font-medium rounded-lg bg-accent hover:bg-accent-light text-white transition-colors text-center"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
