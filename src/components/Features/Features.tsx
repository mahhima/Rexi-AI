import { motion } from 'framer-motion'
import {
  FiFolder, FiUser, FiGrid, FiCheckSquare,
  FiBook, FiCpu, FiZap, FiDatabase,
} from 'react-icons/fi'
import { features } from '../../data/content'

const iconMap: Record<string, React.ElementType> = {
  FiFolder, FiUser, FiGrid, FiCheckSquare,
  FiBook, FiCpu, FiZap, FiDatabase,
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function Features() {
  return (
    <section id="features" className="py-32 px-6 relative overflow-hidden">
      {/* Background accent */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-px opacity-40"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.6), transparent)' }}
      />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-xs uppercase tracking-widest text-accent font-semibold">Capabilities</span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-bold text-gradient leading-tight">
            Everything you need<br />to master any codebase
          </h2>
          <p className="mt-4 text-text-secondary text-lg max-w-xl mx-auto">
            Rexi brings a full suite of AI-powered tools designed for the modern development workflow.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {features.map((feature) => {
            const Icon = iconMap[feature.icon]
            return (
              <motion.div
                key={feature.id}
                variants={item}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group relative p-6 rounded-2xl border border-white/6 bg-surface hover:border-accent/30 transition-colors duration-300 overflow-hidden cursor-default"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                  style={{ background: 'radial-gradient(circle at 50% 0%, rgba(124,58,237,0.08), transparent 70%)' }} />

                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-4 group-hover:bg-accent/15 group-hover:border-accent/30 transition-colors duration-300">
                    {Icon && <Icon size={18} className="text-accent" />}
                  </div>
                  <h3 className="font-semibold text-text-primary mb-2 text-sm">{feature.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
