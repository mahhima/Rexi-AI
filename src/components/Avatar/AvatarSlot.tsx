import Avatar from './Avatar'
import { useAvatarState } from '../../hooks/useAvatarState'

export default function AvatarSlot() {
  const { state } = useAvatarState()

  return (
    <div
      id="avatar-slot"
      className="w-full aspect-square rounded-2xl border border-white/8 bg-surface/50 overflow-hidden flex items-center justify-center"
    >
      <Avatar state={state} />
    </div>
  )
}
