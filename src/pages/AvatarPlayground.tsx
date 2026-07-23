import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft } from 'react-icons/fi'
import { Avatar, type AvatarState } from '../components/Avatar/Avatar'

const STATES: AvatarState[] = ['idle', 'listening', 'thinking', 'speaking', 'greeting']

const DESCRIPTIONS: Record<AvatarState, string> = {
  idle: 'Slow bob + occasional randomized blink.',
  listening: 'Brighter visor, pulsing ring, subtle lean.',
  thinking: 'Narrowed visor, three dots orbiting, slight tilt.',
  speaking: 'Waveform bars dance beneath the visor.',
  greeting: 'One-time arm wave, then settles to idle.',
}

export default function AvatarPlayground() {
  const [state, setState] = useState<AvatarState>('idle')
  // Bumping this key remounts the Avatar so the one-shot greeting can replay.
  const [replayKey, setReplayKey] = useState(0)

  function select(next: AvatarState) {
    setState(next)
    if (next === 'greeting') setReplayKey((k) => k + 1)
  }

  return (
    <div className="min-h-screen bg-background text-text-primary font-sans flex flex-col items-center justify-center p-8">
      {/* Back link */}
      <div className="absolute top-6 left-6">
        <Link
          to="/app"
          className="flex items-center gap-2 text-xs text-text-secondary/60 hover:text-text-secondary transition-colors"
        >
          <FiArrowLeft size={13} />
          Back to app
        </Link>
      </div>

      <div className="flex flex-col items-center gap-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-lg font-semibold">Avatar Playground</h1>
          <p className="mt-1 text-xs text-text-secondary/60">
            Preview and tune Rexi's states before wiring to chat.
          </p>
        </div>

        {/* Stage */}
        <div className="w-full aspect-square max-w-[340px] rounded-3xl border border-white/8 bg-surface/50 overflow-hidden flex items-center justify-center">
          <Avatar key={replayKey} state={state} />
        </div>

        {/* Current state label */}
        <div className="text-center h-10">
          <div className="text-sm font-medium text-accent-light capitalize">{state}</div>
          <div className="text-[11px] text-text-secondary/60 mt-0.5">{DESCRIPTIONS[state]}</div>
        </div>

        {/* State buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {STATES.map((s) => {
            const active = s === state
            return (
              <button
                key={s}
                onClick={() => select(s)}
                className={`relative px-4 py-2 rounded-xl text-xs font-medium capitalize border transition-colors
                  ${active
                    ? 'text-white border-accent/40 bg-accent/15'
                    : 'text-text-secondary border-white/8 bg-surface hover:border-white/20 hover:text-text-primary'}`}
              >
                {active && (
                  <motion.span
                    layoutId="avatar-state-pill"
                    className="absolute inset-0 rounded-xl bg-accent/15 border border-accent/40"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{s}</span>
              </button>
            )
          })}
        </div>

        <p className="text-center text-[10px] text-text-secondary/30 max-w-xs">
          Tip: click <span className="text-text-secondary/60">greeting</span> again to replay the one-time
          intro. All motion respects <span className="text-text-secondary/60">prefers-reduced-motion</span>.
        </p>
      </div>
    </div>
  )
}
