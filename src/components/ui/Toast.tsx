import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { CheckCircle2, AlertOctagon, Info, AlertTriangle, X } from 'lucide-react'
import clsx from 'clsx'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

interface ToastContextType {
  toast: {
    success: (msg: string) => void
    error: (msg: string) => void
    info: (msg: string) => void
    warning: (msg: string) => void
  }
}

const ToastContext = createContext<ToastContextType | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((message: string, type: ToastType, duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts(prev => [...prev, { id, message, type, duration }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const toast = {
    success: (msg: string) => addToast(msg, 'success'),
    error: (msg: string) => addToast(msg, 'error'),
    info: (msg: string) => addToast(msg, 'info'),
    warning: (msg: string) => addToast(msg, 'warning'),
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-5 right-5 z-[10000] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map(t => (
          <ToastItem key={t.id} toast={t} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context.toast
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: (id: string) => void }) {
  const [exit, setExit] = useState(false)
  const [progress, setProgress] = useState(100)

  const handleClose = useCallback(() => {
    setExit(true)
    setTimeout(() => {
      onClose(toast.id)
    }, 300) // matches fade-out duration
  }, [onClose, toast.id])

  useEffect(() => {
    const duration = toast.duration || 4000
    const step = 100 / (duration / 50)
    
    const interval = setInterval(() => {
      setProgress(p => {
        if (p <= 0) {
          clearInterval(interval)
          return 0
        }
        return p - step
      })
    }, 50)

    const timer = setTimeout(() => {
      handleClose()
    }, duration)

    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [toast.duration, handleClose])

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />,
    error: <AlertOctagon className="w-5 h-5 text-red-500 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />,
  }

  const borderColors = {
    success: 'border-emerald-100 dark:border-emerald-900 bg-emerald-50/90 dark:bg-emerald-950/90 text-emerald-800 dark:text-emerald-200',
    error: 'border-red-100 dark:border-red-900 bg-red-50/90 dark:bg-red-950/90 text-red-800 dark:text-red-200',
    info: 'border-blue-100 dark:border-blue-900 bg-blue-50/90 dark:bg-blue-950/90 text-blue-800 dark:text-blue-200',
    warning: 'border-amber-100 dark:border-amber-900 bg-amber-50/90 dark:bg-amber-950/90 text-amber-800 dark:text-amber-200',
  }

  const progressBg = {
    success: 'bg-emerald-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-amber-500',
  }

  return (
    <div
      className={clsx(
        "pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-xl backdrop-blur-md transition-all duration-300 relative overflow-hidden",
        borderColors[toast.type],
        exit ? "opacity-0 translate-x-10 scale-95" : "opacity-100 translate-x-0 scale-100 animate-slide-in"
      )}
      style={{
        animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}
    >
      {icons[toast.type]}
      <div className="flex-1 text-sm font-semibold pr-2 leading-relaxed">
        {toast.message}
      </div>
      <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-0.5 rounded-lg">
        <X className="w-4 h-4" />
      </button>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/5 dark:bg-white/5">
        <div 
          className={clsx("h-full transition-all duration-50 linear", progressBg[toast.type])}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
