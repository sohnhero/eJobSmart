import clsx from 'clsx'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'blue' | 'green' | 'amber' | 'red' | 'slate' | 'purple' | 'teal' | 'orange'
  size?: 'sm' | 'md'
  dot?: boolean
  className?: string
}

const variants = {
  blue:   'bg-blue-100 text-blue-700',
  green:  'bg-emerald-100 text-emerald-700',
  amber:  'bg-amber-100 text-amber-700',
  red:    'bg-red-100 text-red-700',
  slate:  'bg-slate-100 text-slate-600',
  purple: 'bg-purple-100 text-purple-700',
  teal:   'bg-teal-100 text-teal-700',
  orange: 'bg-orange-100 text-orange-700',
}

const dotColors = {
  blue:   'bg-blue-500',
  green:  'bg-emerald-500',
  amber:  'bg-amber-500',
  red:    'bg-red-500',
  slate:  'bg-slate-400',
  purple: 'bg-purple-500',
  teal:   'bg-teal-500',
  orange: 'bg-orange-500',
}

export default function Badge({ children, variant = 'slate', size = 'md', dot, className }: BadgeProps) {
  return (
    <span className={clsx(
      'badge',
      variants[variant],
      size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1',
      className
    )}>
      {dot && <span className={clsx('w-1.5 h-1.5 rounded-full', dotColors[variant])} />}
      {children}
    </span>
  )
}

export function ContractBadge({ type }: { type: string }) {
  const map: Record<string, BadgeProps['variant']> = {
    'CDI': 'green', 'CDD': 'blue', 'Intérim': 'orange',
    'Freelance': 'purple', 'Stage': 'amber', 'Alternance': 'teal',
  }
  return <Badge variant={map[type] ?? 'slate'}>{type}</Badge>
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, BadgeProps['variant']> = {
    'Reçue': 'slate',
    'En cours d\'examen': 'amber',
    'Présélectionnée': 'blue',
    'Entretien planifié': 'green',
    'Test envoyé': 'purple',
    'Offre émise': 'teal',
    'Acceptée': 'green',
    'Refusée': 'red',
    'Annulée': 'slate',
    'Disponible': 'green',
    'En poste': 'blue',
    'Placé': 'teal',
    'Inactif': 'slate',
    'active': 'green',
    'suspended': 'amber',
    'closed': 'red',
  }
  return <Badge variant={map[status] ?? 'slate'} dot>{status}</Badge>
}
