import { useEffect, useState } from 'react'
import { motion, useReducedMotion, type TargetAndTransition, type Transition } from 'framer-motion'

export type AvatarState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'greeting'

const ACCENT = '#7C3AED'
const ACCENT_LIGHT = '#9D5CF6'
const PANEL = '#141417'
const PANEL_STROKE = 'rgba(255,255,255,0.08)'
const FACE = '#1C1C22'

const MOUTH: Record<string, string> = {
  smile:   'M 88 124 Q 100 132 112 124',
  neutral: 'M 90 126 Q 100 128 110 126',
  flat:    'M 90 126 Q 100 126 110 126',
  open:    'M 88 124 Q 100 134 112 124',
  closed:  'M 89 125 Q 100 130 111 125',
}

const EYE_SCALE: Record<AvatarState, { left: number; right: number }> = {
  idle:      { left: 1,    right: 1    },
  listening: { left: 1.25, right: 1.25 },
  thinking:  { left: 0.55, right: 1.0  },
  speaking:  { left: 1,    right: 1    },
  greeting:  { left: 0.1,  right: 0.1  },
}

const BROW: Record<AvatarState, { ty: number; rot: number }> = {
  idle:      { ty: 0,  rot: 0  },
  listening: { ty: -3, rot: 0  },
  thinking:  { ty: -1, rot: -8 },
  speaking:  { ty: 0,  rot: 0  },
  greeting:  { ty: -2, rot: 0  },
}

export function Avatar({ state }: { state: AvatarState }) {
  const reduce = useReducedMotion()
  const [blinking, setBlinking] = useState(false)
  const [speakFrame, setSpeakFrame] = useState(false)

  useEffect(() => {
    if (reduce || state !== 'idle') { setBlinking(false); return }
    let alive = true
    let timer: ReturnType<typeof setTimeout>
    const scheduleBlink = () => {
      const delay = 4000 + Math.random() * 2000
      timer = setTimeout(() => {
        if (!alive) return
        setBlinking(true)
        setTimeout(() => {
          if (!alive) return
          setBlinking(false)
          scheduleBlink()
        }, 130)
      }, delay)
    }
    scheduleBlink()
    return () => { alive = false; clearTimeout(timer) }
  }, [state, reduce])

  useEffect(() => {
    if (reduce || state !== 'speaking') { setSpeakFrame(false); return }
    let alive = true
    const cycle = () => {
      const dur = 200 + Math.random() * 220
      setTimeout(() => {
        if (!alive) return
        setSpeakFrame((f) => !f)
        cycle()
      }, dur)
    }
    cycle()
    return () => { alive = false }
  }, [state, reduce])

  // ── Body bob / lean / tilt ──────────────────────────────────────────────
  let bodyAnimate: TargetAndTransition
  let bodyTransition: Transition
  switch (state) {
    case 'listening':
      bodyAnimate = { y: 3, rotate: 0, scaleY: 1, scaleX: 1 }
      bodyTransition = { duration: 0.4, ease: 'easeOut' }
      break
    case 'thinking':
      bodyAnimate = { y: 0, rotate: -5, scaleY: 1, scaleX: 1 }
      bodyTransition = { duration: 0.5, ease: 'easeOut' }
      break
    case 'speaking':
      bodyAnimate = reduce
        ? { y: 0, rotate: 0, scaleY: 1, scaleX: 1 }
        : { y: [0, -3, 0], rotate: 0, scaleY: 1, scaleX: 1 }
      bodyTransition = reduce ? { duration: 0.3 } : { y: { duration: 0.45, repeat: Infinity, ease: 'easeInOut' } }
      break
    case 'greeting':
      bodyAnimate = reduce
        ? { y: 0, rotate: 0, scaleY: 1, scaleX: 1 }
        : { y: [0, -18, -16, 2, -5, 0], scaleY: [1, 1.09, 1.07, 0.87, 1.03, 1], scaleX: [1, 0.93, 0.94, 1.09, 0.98, 1], rotate: 0 }
      bodyTransition = reduce
        ? { duration: 0.3 }
        : { duration: 1.6, times: [0, 0.2, 0.35, 0.55, 0.7, 1.0], ease: 'easeOut' }
      break
    case 'idle':
    default:
      bodyAnimate = reduce ? { y: 0, rotate: 0, scaleY: 1, scaleX: 1 } : { y: [0, -5, 0], rotate: 0, scaleY: 1, scaleX: 1 }
      bodyTransition = reduce ? { duration: 0.3 } : { y: { duration: 3, repeat: Infinity, ease: 'easeInOut' } }
  }

  const eyeScale = blinking ? { left: 0.08, right: 0.08 } : EYE_SCALE[state]

  const mouthD =
    state === 'speaking'  ? (speakFrame ? MOUTH.closed : MOUTH.open)
    : state === 'listening' ? MOUTH.neutral
    : state === 'thinking'  ? MOUTH.flat
    : MOUTH.smile

  const brow = BROW[state]

  const glowOpacity = state === 'listening' ? 0.9 : state === 'speaking' ? 0.8 : state === 'thinking' ? 0.5 : 0.65

  return (
    <svg
      viewBox="0 0 200 260"
      className="w-full h-full"
      role="img"
      aria-label={`Rexi avatar, ${state}`}
    >
      <defs>
        <radialGradient id="rexiGlow" cx="50%" cy="44%" r="44%">
          <stop offset="0%"   stopColor={ACCENT} stopOpacity="0.5" />
          <stop offset="55%"  stopColor={ACCENT} stopOpacity="0.1" />
          <stop offset="100%" stopColor={ACCENT} stopOpacity="0"   />
        </radialGradient>
        <filter id="antennaTip" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* ── Background glow ─────────────────────────────────────────── */}
      <motion.ellipse
        cx={100} cy={110} rx={90} ry={85}
        fill="url(#rexiGlow)"
        initial={{ opacity: 0.65 }}
        animate={{ opacity: glowOpacity }}
        transition={{ duration: 0.5 }}
      />

      {/* ── Listening pulse rings ────────────────────────────────────── */}
      {[0, 1].map((i) => (
        <motion.circle
          key={i}
          cx={100} cy={90} r={52}
          fill="none" stroke={ACCENT} strokeWidth={1.5}
          style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={state === 'listening'
            ? (reduce ? { opacity: 0.35, scale: 1.05 } : { opacity: [0.5, 0], scale: [0.9, 1.35] })
            : { opacity: 0, scale: 0.9 }}
          transition={state === 'listening'
            ? (reduce ? { duration: 0.3 } : { duration: 1.8, repeat: Infinity, ease: 'easeOut', delay: i * 0.9 })
            : { duration: 0.3 }}
        />
      ))}

      {/* ── Everything that bobs together ───────────────────────────── */}
      <motion.g
        style={{ transformBox: 'view-box', transformOrigin: '100px 160px' }}
        initial={{ y: 0, rotate: 0, scaleY: 1, scaleX: 1 }}
        animate={bodyAnimate}
        transition={bodyTransition}
      >
        {/* Antenna stem */}
        <line x1={100} y1={30} x2={100} y2={52} stroke={ACCENT} strokeWidth={3} strokeLinecap="round" />
        <circle cx={100} cy={26} r={7} fill={ACCENT} opacity={0.25} />

        {/* Antenna tip */}
        <motion.circle
          cx={100} cy={26} r={4.5}
          fill={ACCENT_LIGHT}
          filter="url(#antennaTip)"
          initial={{ opacity: 1 }}
          animate={{ opacity: state === 'thinking' ? [1, 0.4, 1] : 1 }}
          transition={state === 'thinking'
            ? { duration: 1.1, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 0.3 }}
        />

        {/* ── Head group: nod on listening, shake on thinking ───────── */}
        <motion.g
          style={{ transformBox: 'view-box', transformOrigin: '100px 92px' }}
          initial={{ rotate: 0 }}
          animate={state === 'thinking'
            ? { rotate: reduce ? -5 : [-5, 5, -4, 4, -3, -6] }
            : state === 'listening'
            ? { rotate: reduce ? -3 : [0, -4, 0, -3, 0] }
            : { rotate: 0 }}
          transition={state === 'thinking'
            ? (reduce
                ? { duration: 0.4, ease: 'easeOut' }
                : { duration: 0.7, times: [0, 0.2, 0.4, 0.6, 0.8, 1], ease: 'easeInOut' })
            : state === 'listening'
            ? (reduce ? { duration: 0.3 } : { duration: 1.6, repeat: Infinity, ease: 'easeInOut' })
            : { duration: 0.35, ease: 'easeOut' }}
        >
          {/* Head */}
          <rect x={52} y={50} width={96} height={84} rx={28} fill={PANEL} stroke={PANEL_STROKE} strokeWidth={1.5} />
          {/* Face */}
          <rect x={60} y={62} width={80} height={62} rx={20} fill={FACE} />

          {/* Left eyebrow */}
          <motion.line
            x1={74} y1={82} x2={88} y2={80}
            stroke={ACCENT_LIGHT} strokeWidth={2.5} strokeLinecap="round"
            style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}
            initial={{ y: 0, rotate: 0, opacity: 0.7 }}
            animate={{
              y: state === 'thinking'
                ? (reduce ? brow.ty : [brow.ty, brow.ty - 2, brow.ty + 1, brow.ty - 2, brow.ty])
                : brow.ty,
              rotate: state === 'thinking' ? -10 : brow.rot,
              opacity: state === 'greeting' ? 0 : 0.7,
            }}
            transition={state === 'thinking'
              ? { duration: 0.7, times: [0, 0.2, 0.5, 0.75, 1], ease: 'easeInOut' }
              : { duration: 0.25, ease: 'easeOut' }}
          />
          {/* Right eyebrow */}
          <motion.line
            x1={112} y1={80} x2={126} y2={82}
            stroke={ACCENT_LIGHT} strokeWidth={2.5} strokeLinecap="round"
            style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}
            initial={{ y: 0, rotate: 0, opacity: 0.7 }}
            animate={{
              y: state === 'thinking'
                ? (reduce ? brow.ty : [brow.ty, brow.ty - 2, brow.ty + 1, brow.ty - 2, brow.ty])
                : brow.ty,
              rotate: brow.rot,
              opacity: state === 'greeting' ? 0 : 0.7,
            }}
            transition={state === 'thinking'
              ? { duration: 0.7, times: [0, 0.2, 0.5, 0.75, 1], ease: 'easeInOut' }
              : { duration: 0.25, ease: 'easeOut' }}
          />

          {/* Left eye */}
          <motion.g
            style={{ transformBox: 'view-box', transformOrigin: '81px 93px' }}
            initial={{ scaleY: 1 }}
            animate={{ scaleY: eyeScale.left }}
            transition={{ duration: blinking ? 0.08 : 0.2, ease: 'easeOut' }}
          >
            <ellipse cx={81} cy={93} rx={9} ry={9.5} fill="#0A0A0F" />
            <circle cx={84.5} cy={90} r={2.5} fill="white" opacity={0.9} />
          </motion.g>

          {/* Right eye */}
          <motion.g
            style={{ transformBox: 'view-box', transformOrigin: '119px 93px' }}
            initial={{ scaleY: 1 }}
            animate={{ scaleY: eyeScale.right }}
            transition={{ duration: blinking ? 0.08 : 0.2, ease: 'easeOut' }}
          >
            <ellipse cx={119} cy={93} rx={9} ry={9.5} fill="#0A0A0F" />
            <circle cx={122.5} cy={90} r={2.5} fill="white" opacity={0.9} />
          </motion.g>

          {/* Cheek blush */}
          <ellipse cx={68}  cy={105} rx={7} ry={4.5} fill={ACCENT} opacity={state === 'greeting' ? 0.28 : 0.13} />
          <ellipse cx={132} cy={105} rx={7} ry={4.5} fill={ACCENT} opacity={state === 'greeting' ? 0.28 : 0.13} />

          {/* Mouth */}
          <motion.path
            fill="none"
            stroke={ACCENT_LIGHT}
            strokeWidth={2.5}
            strokeLinecap="round"
            initial={{ d: MOUTH.smile }}
            animate={{ d: mouthD }}
            transition={{ duration: state === 'speaking' ? 0.1 : 0.25, ease: 'easeOut' }}
          />
        </motion.g>{/* end head group */}

        {/* Neck */}
        <rect x={90} y={132} width={20} height={16} rx={8} fill={PANEL} stroke={PANEL_STROKE} strokeWidth={1.5} />

        {/* Torso */}
        <rect x={62} y={146} width={76} height={52} rx={20} fill={PANEL} stroke={PANEL_STROKE} strokeWidth={1.5} />

        {/* Left arm (static) */}
        <rect x={38} y={152} width={26} height={13} rx={6.5} fill={PANEL} stroke={PANEL_STROKE} strokeWidth={1.5} />
        <circle cx={38} cy={158} r={8} fill={PANEL} stroke={PANEL_STROKE} strokeWidth={1.5} />

        {/* Right arm / greeting wave */}
        <motion.g
          style={{ transformBox: 'view-box', transformOrigin: '162px 158px' }}
          initial={{ rotate: 0 }}
          animate={state === 'greeting'
            ? { rotate: reduce ? -18 : [0, -28, 6, -28, 6, -26, 4, -18] }
            : { rotate: 0 }}
          transition={state === 'greeting'
            ? (reduce
                ? { duration: 0.3 }
                : { duration: 1.5, ease: 'easeInOut', times: [0, 0.15, 0.3, 0.45, 0.6, 0.72, 0.85, 1] })
            : { duration: 0.35, ease: 'easeOut' }}
        >
          <rect x={136} y={152} width={26} height={13} rx={6.5} fill={PANEL} stroke={PANEL_STROKE} strokeWidth={1.5} />
          <circle cx={162} cy={158} r={8} fill={PANEL} stroke={PANEL_STROKE} strokeWidth={1.5} />
        </motion.g>

        {/* Chest accent dot */}
        <circle cx={100} cy={168} r={4} fill={ACCENT} opacity={0.6} />
        <circle cx={100} cy={168} r={2} fill={ACCENT_LIGHT} opacity={0.9} />

        {/* Thinking: three dots orbiting the head */}
        <motion.g
          style={{ transformBox: 'view-box', transformOrigin: '100px 90px' }}
          initial={{ opacity: 0, rotate: 0 }}
          animate={state === 'thinking'
            ? { opacity: 1, rotate: reduce ? 0 : 360 }
            : { opacity: 0, rotate: 0 }}
          transition={state === 'thinking'
            ? { rotate: reduce ? { duration: 0 } : { duration: 3.4, repeat: Infinity, ease: 'linear' }, opacity: { duration: 0.3 } }
            : { duration: 0.3 }}
        >
          {[0, 1, 2].map((i) => {
            const ang = (i / 3) * Math.PI * 2 - Math.PI / 2
            const rr = 60
            return (
              <circle
                key={i}
                cx={100 + rr * Math.cos(ang)}
                cy={90 + rr * Math.sin(ang)}
                r={i === 0 ? 4.5 : i === 1 ? 3.5 : 2.8}
                fill={ACCENT_LIGHT}
                opacity={i === 0 ? 0.9 : i === 1 ? 0.65 : 0.4}
              />
            )
          })}
        </motion.g>
      </motion.g>
    </svg>
  )
}

export default Avatar
