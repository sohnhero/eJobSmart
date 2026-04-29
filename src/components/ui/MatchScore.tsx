import clsx from 'clsx'

interface MatchScoreProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export default function MatchScore({ score, size = 'md', showLabel = true }: MatchScoreProps) {
  const color = score >= 85 ? 'text-emerald-600' : score >= 70 ? 'text-amber-600' : 'text-red-500'
  const bg = score >= 85 ? 'bg-emerald-50 border-emerald-200' : score >= 70 ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'

  const sizeClass = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  }

  return (
    <span className={clsx('inline-flex items-center gap-1 rounded-lg border font-bold', bg, color, sizeClass[size])}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {score}%
      {showLabel && <span className="font-normal text-current/70 text-[10px]">match</span>}
    </span>
  )
}
