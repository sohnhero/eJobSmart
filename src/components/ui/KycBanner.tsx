import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShieldAlert, ShieldX, ArrowRight } from 'lucide-react'
import { companyVerificationService } from '../../lib/services/company-verification'
import type { KycStatus } from '../../lib/types'

interface Props {
  role: 'company' | 'agency'
}

// Bannière persistante tant que le compte n'est pas vérifié (KYC) — rappelle la limite d'une
// seule offre active en attendant la validation admin. Ne s'affiche pas une fois approuvé.
export default function KycBanner({ role }: Props) {
  const [status, setStatus] = useState<KycStatus | null>(null)

  useEffect(() => {
    let cancelled = false
    companyVerificationService.findMine()
      .then(data => { if (!cancelled) setStatus(data.status) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  if (!status || status === 'approved') return null

  const content = {
    not_submitted: {
      tone: 'amber',
      title: 'Vérifiez votre compte',
      desc: "Déposez vos justificatifs (NINEA, RCCM) pour lever la limite d'une offre active à la fois.",
    },
    pending: {
      tone: 'amber',
      title: 'Vérification de votre compte en cours',
      desc: 'Une seule offre active tant que votre dossier KYC est en cours de validation.',
    },
    rejected: {
      tone: 'red',
      title: 'Votre dossier de vérification a été rejeté',
      desc: 'Corrigez et redéposez vos documents pour lever la limite de publication.',
    },
  }[status]

  const isRed = content.tone === 'red'
  const Icon = isRed ? ShieldX : ShieldAlert

  return (
    <Link
      to={`/dashboard/${role}/verification`}
      className={`flex items-center gap-3 rounded-2xl p-4 mb-6 border transition-colors ${
        isRed ? 'bg-red-50 border-red-200 hover:bg-red-100' : 'bg-amber-50 border-amber-200 hover:bg-amber-100'
      }`}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 ${isRed ? 'text-red-600' : 'text-amber-600'}`} />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${isRed ? 'text-red-800' : 'text-amber-800'}`}>{content.title}</p>
        <p className={`text-xs ${isRed ? 'text-red-700' : 'text-amber-700'}`}>{content.desc}</p>
      </div>
      <ArrowRight className={`w-4 h-4 flex-shrink-0 ${isRed ? 'text-red-600' : 'text-amber-600'}`} />
    </Link>
  )
}
