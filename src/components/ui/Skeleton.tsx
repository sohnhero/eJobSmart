import React from 'react'
import clsx from 'clsx'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'title' | 'avatar' | 'card' | 'list' | 'button' | 'table'
  count?: number
}

export default function Skeleton({ className, variant = 'text', count = 1 }: SkeletonProps) {
  const itemClass = "bg-slate-200/60 animate-pulse rounded-lg"

  const renderSkeleton = () => {
    switch (variant) {
      case 'title':
        return (
          <div className={clsx("h-7 w-2/3 mb-4", itemClass, className)} />
        )
      case 'avatar':
        return (
          <div className={clsx("w-12 h-12 rounded-full", itemClass, className)} />
        )
      case 'button':
        return (
          <div className={clsx("h-10 w-28 rounded-xl", itemClass, className)} />
        )
      case 'card':
        return (
          <div className={clsx("card p-5 space-y-4 border border-slate-100 bg-white shadow-sm", className)}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-200/60 animate-pulse flex-shrink-0" />
              <div className="flex-1 min-w-0 space-y-2">
                <div className="h-4 bg-slate-200/60 animate-pulse rounded w-3/4" />
                <div className="h-3 bg-slate-200/60 animate-pulse rounded w-1/2" />
              </div>
            </div>
            <div className="space-y-2 pt-2">
              <div className="h-3 bg-slate-200/60 animate-pulse rounded w-full" />
              <div className="h-3 bg-slate-200/60 animate-pulse rounded w-5/6" />
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-slate-50">
              <div className="h-6 bg-slate-200/60 animate-pulse rounded-full w-20" />
              <div className="h-8 bg-slate-200/60 animate-pulse rounded-lg w-24" />
            </div>
          </div>
        )
      case 'list':
        return (
          <div className={clsx("flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl", className)}>
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-lg bg-slate-200/60 animate-pulse flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 bg-slate-200/60 animate-pulse rounded w-1/3" />
                <div className="h-2.5 bg-slate-200/60 animate-pulse rounded w-1/4" />
              </div>
            </div>
            <div className="h-5 bg-slate-200/60 animate-pulse rounded w-16" />
          </div>
        )
      case 'table':
        return (
          <div className={clsx("w-full overflow-hidden border border-slate-100 rounded-xl bg-white p-4 space-y-3", className)}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="h-4 bg-slate-200/60 animate-pulse rounded w-1/6" />
              <div className="h-4 bg-slate-200/60 animate-pulse rounded w-1/6" />
              <div className="h-4 bg-slate-200/60 animate-pulse rounded w-1/6" />
              <div className="h-4 bg-slate-200/60 animate-pulse rounded w-1/6" />
            </div>
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center justify-between py-2.5">
                <div className="h-3.5 bg-slate-200/60 animate-pulse rounded w-1/5" />
                <div className="h-3 bg-slate-200/60 animate-pulse rounded w-1/5" />
                <div className="h-3 bg-slate-200/60 animate-pulse rounded w-1/5" />
                <div className="h-5 bg-slate-200/60 animate-pulse rounded-lg w-16" />
              </div>
            ))}
          </div>
        )
      case 'text':
      default:
        return (
          <div className={clsx("h-4 w-full mb-2", itemClass, className)} />
        )
    }
  }

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <React.Fragment key={i}>
          {renderSkeleton()}
        </React.Fragment>
      ))}
    </>
  )
}
