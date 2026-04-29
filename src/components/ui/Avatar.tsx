import clsx from 'clsx'

interface AvatarProps {
  src?: string
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizes = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
}

function getColor(name: string) {
  const colors = ['bg-blue-500', 'bg-purple-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-teal-500']
  const idx = name.charCodeAt(0) % colors.length
  return colors[idx]
}

export default function Avatar({ src, name = '', size = 'md', className }: AvatarProps) {
  return (
    <div className={clsx(
      'rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 font-semibold text-white',
      sizes[size],
      !src && getColor(name),
      className,
    )}>
      {src
        ? <img src={src} alt={name} className="w-full h-full object-cover" />
        : <span>{getInitials(name)}</span>
      }
    </div>
  )
}
