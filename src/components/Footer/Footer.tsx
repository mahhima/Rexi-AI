import { FiGithub, FiFileText, FiHeart } from 'react-icons/fi'

const footerLinks = [
  { label: 'GitHub', href: 'https://github.com', icon: FiGithub, external: true },
  { label: 'Documentation', href: '#docs', icon: FiFileText, external: false },
  { label: 'License', href: '#license', icon: null, external: false },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/6 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center shadow-md shadow-accent/20">
            <span className="text-white font-bold text-xs">R</span>
          </div>
          <span className="font-semibold text-text-primary text-sm">Rexi</span>
        </div>

        {/* Links */}
        <nav className="flex items-center gap-6">
          {footerLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noreferrer' : undefined}
              className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              {link.icon && <link.icon size={13} />}
              {link.label}
            </a>
          ))}
        </nav>

        {/* Built with love */}
        <p className="flex items-center gap-1.5 text-sm text-text-secondary">
          Built with
          <FiHeart size={13} className="text-accent" fill="currentColor" />
          by the Rexi team
        </p>
      </div>
    </footer>
  )
}
