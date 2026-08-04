import { useEffect, useState } from 'react'
import { Star, CheckCircle, XCircle, X } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import Skeleton from '../../components/ui/Skeleton'
import { useToast } from '../../components/ui/Toast'
import { reviewsService } from '../../lib/services/reviews'
import { extractApiErrorMessage } from '../../lib/api'
import { roleToLabel } from '../../lib/roles'
import type { Review } from '../../lib/types'

export default function AdminRhReviews() {
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [records, setRecords] = useState<Review[]>([])
  const [busyId, setBusyId] = useState<string | null>(null)
  const [rejecting, setRejecting] = useState<Review | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  const load = () => {
    setLoading(true)
    reviewsService.findQueue({ status: 'pending', limit: 50 })
      .then(res => setRecords(res.items))
      .catch(() => setRecords([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleApprove = async (review: Review) => {
    setBusyId(review._id)
    try {
      await reviewsService.approve(review._id)
      setRecords(prev => prev.filter(r => r._id !== review._id))
      toast.success('Avis publié sur la page d’accueil !')
    } catch (err) {
      toast.error(extractApiErrorMessage(err))
    } finally {
      setBusyId(null)
    }
  }

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rejecting) return
    setBusyId(rejecting._id)
    try {
      await reviewsService.reject(rejecting._id, rejectReason || undefined)
      setRecords(prev => prev.filter(r => r._id !== rejecting._id))
      toast.info('Avis rejeté.')
      setRejecting(null)
      setRejectReason('')
    } catch (err) {
      toast.error(extractApiErrorMessage(err))
    } finally {
      setBusyId(null)
    }
  }

  return (
    <DashboardLayout role="admin-rh">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          Avis clients <Star className="w-5 h-5 text-brand-600" />
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">Validez les témoignages avant publication sur la page d'accueil</p>
      </div>

      <div className="card">
        {loading ? (
          <div className="p-4"><Skeleton variant="table" count={1} /></div>
        ) : records.length === 0 ? (
          <p className="p-12 text-center text-slate-400 text-sm">Aucun avis en attente de modération.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {records.map(r => {
              const author = typeof r.user === 'string' ? null : r.user
              return (
                <div key={r._id} className="p-5 flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-bold text-slate-800">
                        {author?.companyName || `${author?.firstName ?? ''} ${author?.lastName ?? ''}`.trim() || 'Utilisateur'}
                      </p>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                        {author ? roleToLabel(author.role) : ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-0.5 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                      ))}
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{r.text}</p>
                    <p className="text-xs text-slate-400 mt-2">Soumis le {new Date(r.createdAt).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div className="flex sm:flex-col gap-2 flex-shrink-0">
                    <Button size="sm" loading={busyId === r._id} onClick={() => handleApprove(r)} leftIcon={<CheckCircle className="w-4 h-4" />}>
                      Approuver
                    </Button>
                    <Button size="sm" variant="secondary" disabled={busyId === r._id} onClick={() => setRejecting(r)} leftIcon={<XCircle className="w-4 h-4 text-red-500" />}>
                      Rejeter
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {rejecting && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setRejecting(null)} />
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl relative z-10 overflow-hidden border border-slate-100 p-6">
            <form onSubmit={handleReject} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-slate-900">Rejeter l'avis</h3>
                <button type="button" onClick={() => setRejecting(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Motif (optionnel)</label>
                <textarea rows={3} value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Pourquoi cet avis n'est pas publié..." className="input-field resize-none" />
              </div>
              <Button type="submit" fullWidth variant="secondary" loading={busyId === rejecting._id}>Confirmer le rejet</Button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
