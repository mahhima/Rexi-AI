import { motion } from 'framer-motion'
import { FiCheck } from 'react-icons/fi'
import { roadmapPhases } from '../../data/content'

const statusStyles = {
  completed: {
    dot: 'bg-green-400',
    ring: 'border-green-400/40',
    badge: 'text-green-400 bg-green-400/10 border-green-400/20',
    label: 'Completed',
    line: 'bg-green-400/40',
  },
  active: {
    dot: 'bg-accent animate-pulse',
    ring: 'border-accent/60',
    badge: 'text-accent-light bg-accent/10 border-accent/20',
    label: 'In Progress',
    line: 'bg-accent/40',
  },
  upcoming: {
    dot: 'bg-white/20',
    ring: 'border-white/10',
    badge: 'text-text-secondary bg-white/5 border-white/8',
    label: 'Upcoming',
    line: 'bg-white/10',
  },
}

export default function Roadmap() {
  return (
    <section id="roadmap" className="py-32 px-6 relative overflow-hidden">
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
          <span className="text-xs uppercase tracking-widest text-accent font-semibold">Roadmap</span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-bold text-gradient leading-tight">
            Where we're headed
          </h2>
          <p className="mt-4 text-text-secondary text-lg max-w-xl mx-auto">
            A clear path from foundation to the most powerful AI engineering platform ever built.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical spine (desktop) */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px bg-white/8" />

          <div className="flex flex-col gap-0">
            {roadmapPhases.map((phase, index) => {
              const styles = statusStyles[phase.status]
              const isLeft = index % 2 === 0

              return (
                <motion.div
                  key={phase.phase}
                  initial={{ opacity: 0, x: isLeft ? -24 : 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.55, delay: index * 0.08 }}
                  className={`relative flex lg:items-center gap-8 mb-8
                    ${isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'}
                    flex-row`}
                >
                  {/* Card side */}
                  <div className="lg:w-[calc(50%-32px)] w-full">
                    <div className={`group p-6 rounded-2xl border bg-surface transition-all duration-300 hover:-translate-y-1
                      ${phase.status === 'active' ? 'border-accent/30 shadow-lg shadow-accent/5' : 'border-white/6 hover:border-white/12'}`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <span className="text-[10px] uppercase tracking-widest text-text-secondary font-medium">Phase {phase.phase}</span>
                          <h3 className="text-lg font-semibold text-text-primary mt-1">{phase.title}</h3>
                        </div>
                        <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full border ${styles.badge}`}>
                          {styles.label}
                        </span>
                      </div>

                      <ul className="space-y-2">
                        {phase.items.map((item) => (
                          <li key={item} className="flex items-center gap-2.5">
                            <div className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0
                              ${phase.status === 'completed' ? 'bg-green-400/15' : phase.status === 'active' ? 'bg-accent/15' : 'bg-white/5'}`}
                            >
                              {phase.status === 'completed'
                                ? <FiCheck size={10} className="text-green-400" />
                                : <div className={`w-1.5 h-1.5 rounded-full ${phase.status === 'active' ? 'bg-accent' : 'bg-white/20'}`} />
                              }
                            </div>
                            <span className={`text-sm ${phase.status === 'upcoming' ? 'text-text-secondary' : 'text-text-primary'}`}>
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 items-center justify-center">
                    <div className={`w-4 h-4 rounded-full border-2 ${styles.ring} bg-background`}>
                      <div className={`w-full h-full rounded-full scale-50 ${styles.dot}`} />
                    </div>
                  </div>

                  {/* Empty spacer for alternating layout */}
                  <div className="hidden lg:block lg:w-[calc(50%-32px)]" />
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
