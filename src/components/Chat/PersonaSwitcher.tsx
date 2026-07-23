import type { Persona } from '../../data/mockMessages'

const personas: Persona[] = ['Architect', 'Mentor', 'Debugger']

const personaColors: Record<Persona, string> = {
  Architect: 'text-violet-400 border-violet-400/40 bg-violet-400/10',
  Mentor: 'text-sky-400 border-sky-400/40 bg-sky-400/10',
  Debugger: 'text-rose-400 border-rose-400/40 bg-rose-400/10',
}

const personaActive: Record<Persona, string> = {
  Architect: 'bg-violet-500/20 border-violet-400/60 text-violet-300',
  Mentor: 'bg-sky-500/20 border-sky-400/60 text-sky-300',
  Debugger: 'bg-rose-500/20 border-rose-400/60 text-rose-300',
}

interface PersonaSwitcherProps {
  value: Persona
  onChange: (p: Persona) => void
}

export default function PersonaSwitcher({ value, onChange }: PersonaSwitcherProps) {
  return (
    <div className="flex items-center gap-1.5">
      {personas.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all duration-150
            ${value === p ? personaActive[p] : `${personaColors[p]} hover:bg-white/5`}`}
        >
          {p}
        </button>
      ))}
    </div>
  )
}
