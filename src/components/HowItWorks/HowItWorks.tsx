import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { FiGithub, FiCode, FiShare2, FiCpu, FiZap, FiUser } from 'react-icons/fi'
import { flowSteps } from '../../data/content'

const iconMap: Record<string, React.ElementType> = {
  FiGithub, FiCode, FiShare2, FiCpu, FiZap, FiUser,
}

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="how-it-works" className="py-32 px-6 relative overflow-hidden">
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
          <span className="text-xs uppercase tracking-widest text-accent font-semibold">Architecture</span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-bold text-gradient leading-tight">
            How Rexi works
          </h2>
          <p className="mt-4 text-text-secondary text-lg max-w-xl mx-auto">
            From raw source code to actionable intelligence — a multi-stage pipeline designed for depth.
          </p>
        </motion.div>

        {/* Flow diagram */}
        <div ref={ref} className="relative flex flex-col items-center">
          {flowSteps.map((step, index) => {
            const Icon = iconMap[step.icon]
            const isLast = index === flowSteps.length - 1
            const isRexi = step.id === 'rexi'

            return (
              <div key={step.id} className="flex flex-col items-center">
                {/* Node */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.12, ease: 'easeOut' }}
                  whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                  className={`relative flex items-center gap-5 px-8 py-5 rounded-2xl border transition-colors duration-300 cursor-default group
                    ${isRexi
                      ? 'bg-accent/15 border-accent/40 shadow-lg shadow-accent/10 w-72 sm:w-96'
                      : 'bg-surface border-white/8 hover:border-accent/25 w-64 sm:w-80'
                    }`}
                >
                  {isRexi && (
                    <div className="absolute inset-0 rounded-2xl pointer-events-none"
                      style={{ background: 'radial-gradient(circle at 50% 50%, rgba(124,58,237,0.08), transparent 70%)' }} />
                  )}
                  <div className={`relative w-11 h-11 rounded-xl flex items-center justify-center shrink-0
                    ${isRexi ? 'bg-accent/20 border border-accent/30' : 'bg-white/5 border border-white/8 group-hover:border-accent/25'}`}
                  >
                    {Icon && <Icon size={20} className={isRexi ? 'text-accent' : 'text-text-secondary group-hover:text-accent transition-colors'} />}
                  </div>
                  <div className="relative">
                    <div className={`font-semibold ${isRexi ? 'text-accent-light' : 'text-text-primary'}`}>
                      {step.label}
                    </div>
                    <div className="text-sm text-text-secondary mt-0.5">{step.description}</div>
                  </div>
                  <div className={`absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-8 rounded-full transition-opacity duration-300
                    ${isRexi ? 'bg-accent opacity-100' : 'bg-accent/40 opacity-0 group-hover:opacity-100'}`} />
                </motion.div>

                {/* Connector */}
                {!isLast && (
                  <div className="relative flex flex-col items-center my-1">
                    <motion.div
                      initial={{ scaleY: 0, opacity: 0 }}
                      animate={inView ? { scaleY: 1, opacity: 1 } : {}}
                      transition={{ duration: 0.4, delay: index * 0.12 + 0.3 }}
                      className="w-px h-8 origin-top"
                      style={{ background: 'linear-gradient(180deg, rgba(124,58,237,0.5), rgba(124,58,237,0.2))' }}
                    />
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={inView ? { opacity: 1 } : {}}
                      transition={{ delay: index * 0.12 + 0.5 }}
                      className="w-2 h-2 rotate-45 border-r-2 border-b-2 -mt-1"
                      style={{ borderColor: 'rgba(124,58,237,0.5)' }}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
