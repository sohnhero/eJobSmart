import clsx from 'clsx'
import type { ReactNode, ButtonHTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'white'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  fullWidth?: boolean
}

const variants = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-sm hover:shadow-md',
  secondary: 'bg-white text-brand-600 border-2 border-brand-200 hover:border-brand-400 hover:bg-brand-50',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-800',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  white: 'bg-white text-slate-800 hover:bg-slate-50 shadow-sm',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-5 py-2.5 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2',
  xl: 'px-8 py-4 text-lg gap-2.5',
}

export default function Button({
  children, variant = 'primary', size = 'md', loading, leftIcon, rightIcon,
  fullWidth, className, disabled, ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className,
      )}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  )
}
