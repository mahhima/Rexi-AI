import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Avatar, type AvatarState } from './Avatar'

// All possible ambient tricks — one plays every ~2s, cycling in order
type Trick =
  | 'slideRight'   // slide to divider border
  | 'slideLeft'    // slide to left edge of screen
  | 'jump'         // hop up with wave + twist
  | 'drop'         // fall to bottom, squash, bounce back
  | 'exitTop'      // shoot off top, peek from one side, return

const TRICKS: Trick[] = ['slideRight', 'slideLeft', 'jump', 'drop', 'exitTop']

// Avatar state shown for each trick
const TRICK_AVATAR: Record<Trick, AvatarState> = {
  slideRight: 'idle',
  slideLeft:  'idle',
  jump:       'greeting',
  drop:       'idle',
  exitTop:    'idle',
}

interface AvatarCompanionProps {
  overrideState?: AvatarState
  size?: number
  className?: string
  /** Ref to the panel this companion lives inside — used to calculate slide distances */
  panelRef?: React.RefObject<HTMLDivElement | null>
}

export default function AvatarCompanion({
  overrideState,
  size = 200,
  className = '',
  panelRef,
}: AvatarCompanionProps) {
  const reduce = useReducedMotion()

  const [avatarState, setAvatarState] = useState<AvatarState>('greeting')
  const [greetingDone, setGreetingDone] = useState(false)
  // panelW: measured width of the panel container
  const [panelW, setPanelW] = useState(600)
  // Current animated position/transform
  const [pos, setPos] = useState({ x: 0, y: 0, rotate: 0, scaleY: 1, scaleX: 1 })
  const [transition, setTransition] = useState<object>({ duration: 0.6, ease: 'easeInOut' })

  const cycleTimer = useRef<ReturnType<typeof setTimeout>>()
  const trickIndex = useRef(0)

  // Measure panel width
  useEffect(() => {
    const panel = panelRef?.current
    if (!panel) return
    const measure = () => setPanelW(panel.offsetWidth)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(panel)
    return () => ro.disconnect()
  }, [panelRef])

  // Greeting on mount, then start cycling tricks
  useEffect(() => {
    setAvatarState('greeting')
    const t = setTimeout(() => {
      setGreetingDone(true)
      setAvatarState('idle')
    }, 2200)
    return () => clearTimeout(t)
  }, [])

  // Freeze when overrideState is set
  useEffect(() => {
    if (!greetingDone) return
    if (overrideState !== undefined) {
      clearTimeout(cycleTimer.current)
      setPos({ x: 0, y: 0, rotate: 0, scaleY: 1, scaleX: 1 })
      setAvatarState(overrideState)
    }
  }, [overrideState, greetingDone])

  // Cycle tricks every ~2s
  useEffect(() => {
    if (!greetingDone || overrideState !== undefined) return

    const playNext = () => {
      const trick = TRICKS[trickIndex.current % TRICKS.length]
      trickIndex.current++
      if (!reduce) runTrick(trick)

      cycleTimer.current = setTimeout(playNext, 2200 + Math.random() * 600)
    }

    cycleTimer.current = setTimeout(playNext, 1500)
    return () => clearTimeout(cycleTimer.current)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [greetingDone, overrideState, reduce, panelW])

  function runTrick(trick: Trick) {
    // Distance from center to right edge (panel) minus half avatar = pixels to divider
    const toRight = panelW / 2 - size / 2
    // Distance from center to left edge of viewport (panel sits centered in its flex half)
    const toLeft = -(panelW / 2 + size / 2)

    setAvatarState(TRICK_AVATAR[trick])

    switch (trick) {
      case 'slideRight': {
        // Slide right until avatar right edge touches divider, hold, return
        setTransition({ duration: 0.55, ease: 'easeInOut' })
        setPos({ x: toRight, y: 0, rotate: 4, scaleY: 1, scaleX: 1 })
        setTimeout(() => {
          setTransition({ duration: 0.55, ease: 'easeInOut' })
          setPos({ x: 0, y: 0, rotate: 0, scaleY: 1, scaleX: 1 })
          setAvatarState('idle')
        }, 1100)
        break
      }

      case 'slideLeft': {
        // Slide left until fully off-screen
        setTransition({ duration: 0.55, ease: 'easeIn' })
        setPos({ x: toLeft, y: 0, rotate: -6, scaleY: 1, scaleX: 1 })
        setTimeout(() => {
          setTransition({ duration: 0.55, ease: 'easeOut' })
          setPos({ x: 0, y: 0, rotate: 0, scaleY: 1, scaleX: 1 })
          setAvatarState('idle')
        }, 1100)
        break
      }

      case 'jump': {
        // Hop up with twist, come back
        setTransition({ duration: 0.35, ease: [0.22, 1.2, 0.36, 1] })
        setPos({ x: 0, y: -80, rotate: 20, scaleY: 1.08, scaleX: 0.94 })
        setTimeout(() => {
          setTransition({ duration: 0.4, ease: [0.33, 0, 0.66, 0] })
          setPos({ x: 0, y: 0, rotate: 0, scaleY: 0.85, scaleX: 1.15 }) // squash on land
        }, 380)
        setTimeout(() => {
          setTransition({ duration: 0.25, ease: 'easeOut' })
          setPos({ x: 0, y: 0, rotate: 0, scaleY: 1, scaleX: 1 })
          setAvatarState('idle')
        }, 750)
        break
      }

      case 'drop': {
        // Fall to bottom, squash, bounce back
        const screenH = window.innerHeight
        const toBottom = screenH / 2 - size / 2 + 20 // near bottom of viewport
        setTransition({ duration: 0.5, ease: [0.55, 0, 1, 0.45] })
        setPos({ x: 0, y: toBottom, rotate: 0, scaleY: 1, scaleX: 1 })
        setTimeout(() => {
          // squash on impact
          setTransition({ duration: 0.12, ease: 'easeOut' })
          setPos({ x: 0, y: toBottom + 4, rotate: 0, scaleY: 0.6, scaleX: 1.5 })
        }, 520)
        setTimeout(() => {
          // bounce back up
          setTransition({ duration: 0.55, ease: [0.22, 1.4, 0.36, 1] })
          setPos({ x: 0, y: 0, rotate: 0, scaleY: 1, scaleX: 1 })
          setAvatarState('idle')
        }, 680)
        break
      }

      case 'exitTop': {
        // Shoot off top, peek from right side, slide back to center
        const toTop = -(window.innerHeight / 2 + size)
        const peekSide = toRight + size * 0.5 // half-visible from right
        setTransition({ duration: 0.4, ease: 'easeIn' })
        setPos({ x: 0, y: toTop, rotate: 0, scaleY: 1, scaleX: 1 })
        setTimeout(() => {
          // instantly reposition to right edge, off-screen horizontally
          setTransition({ duration: 0 })
          setPos({ x: peekSide, y: 0, rotate: -8, scaleY: 1, scaleX: 1 })
        }, 420)
        setTimeout(() => {
          // slide back to center
          setTransition({ duration: 0.55, ease: 'easeOut' })
          setPos({ x: 0, y: 0, rotate: 0, scaleY: 1, scaleX: 1 })
          setAvatarState('idle')
        }, 480)
        break
      }
    }
  }

  const displayPos = overrideState !== undefined
    ? { x: 0, y: 0, rotate: 0, scaleY: 1, scaleX: 1 }
    : pos

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <motion.div
        style={{ width: size, height: size, transformOrigin: '50% 100%' }}
        animate={displayPos}
        transition={transition as never}
      >
        <Avatar state={avatarState} />
      </motion.div>
    </div>
  )
}
