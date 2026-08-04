import { useEffect, useState } from 'react'
import { Star, Clock, CheckCircle2, XCircle } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import { useToast } from '../../components/ui/Toast'
import { reviewsService } from '../../lib/services/reviews'
import { extractApiErrorMessage } from '../../lib/api'
import type { Review } from '../../lib/types'

interface MyReviewProps {
  role?: 'candidate' | 'freelance' | 'company' | 'agency'
}

const STATUS_META = {
  pending: { label: 'En attente de modération', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', icon: Clock },
  approved: { label: 'Publié sur la page d’accueil', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', icon: CheckCircle2 },
  rejected: { label: 'Non retenu', color: 'text-red-700', bg: 'bg-red-50 border-red-200', icon: XCircle },
} as const

export default function MyReview({ role = 'candidate' }: MyReviewProps) {
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [existing, setExisting] = useState<Review | null>(null)
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [text, setText] = useState('')

  useEffect(() => {
    let cancelled = false
    reviewsService.findMine()
      .then(review => {
        if (cancelled) return
        setExisting(review)
        if (review) {
          setRating(review.rating)
          setText(review.text)
        }
      })
      .catch(err => toast.error(extractApiErrorMessage(err, 'Impossible de charger votre avis')))
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- toast n'est pas stable entre renders
  }, [])

  const handleSubmit = async () => {
    if (text.trim().length < 10) {
      toast.error('Votre avis doit contenir au moins 10 caractères')
      return
    }
    setSaving(true)
    try {
      const review = await reviewsService.submitMine(rating, text.trim())
      setExisting(review)
      toast.success(existing ? 'Avis mis à jour — il repasse en modération' : 'Merci pour votre avis ! Il sera visible après validation par notre équipe.')
    } catch (err) {
      toast.error(extractApiErrorMessage(err, "Impossible d'envoyer votre avis"))
    } finally {
      setSaving(false)
    }
  }

  const meta = existing ? STATUS_META[existing.status] : null

  if (loading) {
    return (
      <DashboardLayout role={role}>
        <p className="text-sm text-slate-400 text-center py-16">Chargement…</p>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role={role}>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900">Votre avis sur EurekaJob</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Partagez votre expérience — les avis validés par notre équipe sont mis en avant sur notre page d'accueil.
        </p>
      </div>

      {meta && existing && (
        <div className={`card p-4 mb-6 flex items-start gap-3 border ${meta.bg}`}>
          <meta.icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${meta.color}`} />
          <div>
            <p className={`text-sm font-semibold ${meta.color}`}>{meta.label}</p>
            {existing.status === 'rejected' && existing.rejectionReason && (
              <p className="text-xs text-red-700 mt-0.5">Motif : {existing.rejectionReason}</p>
            )}
            {existing.status === 'pending' && (
              <p className="text-xs text-amber-700 mt-0.5">Notre équipe l'examine avant publication.</p>
            )}
          </div>
        </div>
      )}

      <div className="card p-6 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Votre note</label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(n => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                onMouseEnter={() => setHoverRating(n)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-0.5"
                aria-label={`${n} étoile${n > 1 ? 's' : ''}`}
              >
                <Star
                  className={`w-7 h-7 transition-colors ${
                    n <= (hoverRating || rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Votre témoignage</label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            maxLength={500}
            rows={5}
            placeholder="Racontez votre expérience avec EurekaJob : ce qui vous a aidé, ce que vous avez apprécié…"
            className="input-field resize-none"
          />
          <p className="text-xs text-slate-400 mt-1 text-right">{text.length}/500</p>
        </div>

        <Button loading={saving} onClick={handleSubmit}>
          {existing ? 'Mettre à jour mon avis' : 'Envoyer mon avis'}
        </Button>
      </div>
    </DashboardLayout>
  )
}
