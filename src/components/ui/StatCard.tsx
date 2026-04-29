import clsx from 'clsx'
import type { LucideIcon } from 'lucide-react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  iconColor?: string
  iconBg?: string
  trend?: number
  trendLabel?: string
  className?: string
}

export default function StatCard({
  title, value, subtitle, icon: Icon, iconColor = 'text-brand-600',
  iconBg = 'bg-brand-50', trend, trendLabel, className,
}: StatCardProps) {
  const isPositive = trend !== undefined && trend >= 0

  return (
    <div className={clsx('card p-5 flex flex-col gap-4', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        <div className={clsx('w-11 h-11 rounded-xl flex items-center justify-center', iconBg)}>
          <Icon className={clsx('w-5 h-5', iconColor)} />
        </div>
      </div>
      {trend !== undefined && (
        <div className="flex items-center gap-1.5">
          {isPositive
            ? <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            : <TrendingDown className="w-3.5 h-3.5 text-red-500" />
          }
          <span className={clsx('text-xs font-semibold', isPositive ? 'text-emerald-600' : 'text-red-600')}>
            {isPositive ? '+' : ''}{trend}%
          </span>
          {trendLabel && <span className="text-xs text-slate-400">{trendLabel}</span>}
        </div>
      )}
    </div>
  )
}
