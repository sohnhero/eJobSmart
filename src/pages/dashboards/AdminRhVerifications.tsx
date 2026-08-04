import { useEffect, useState } from 'react'
import { ShieldCheck, CheckCircle, XCircle, Eye, X } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import Skeleton from '../../components/ui/Skeleton'
import { useToast } from '../../components/ui/Toast'
import { companyVerificationService } from '../../lib/services/company-verification'
import { extractApiErrorMessage } from '../../lib/api'
import type { CompanyVerification } from '../../lib/types'

export default function AdminRhVerifications() {
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [records, setRecords] = useState<CompanyVerification[]>([])
  const [busyId, setBusyId] = useState<string | null>(null)
  const [viewing, setViewing] = useState<CompanyVerification | null>(null)
  const [rejecting, setRejecting] = useState<CompanyVerification | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  const load = () => {
    setLoading(true)
    companyVerificationService.findAll('pending', 1, 50)
      .then(res => setRecords(res.items))
      .catch(() => setRecords([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleApprove = async (record: CompanyVerification) => {
    if (!record._id) return
    setBusyId(record._id)
    try {
      await companyVerificationService.approve(record._id)
      setRecords(prev => prev.filter(r => r._id !== record._id))
      setViewing(null)
      toast.success('Compte vérifié avec succès !')
    } catch (err) {
      toast.error(extractApiErrorMessage(err))
    } finally {
      setBusyId(null)
    }
  }

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rejecting?._id) return
    setBusyId(rejecting._id)
    try {
      await companyVerificationService.reject(rejecting._id, rejectReason)
      setRecords(prev => prev.filter(r => r._id !== rejecting._id))
      toast.info('Dossier rejeté.')
      setRejecting(null)
      setRejectReason('')
      setViewing(null)
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
          Vérifications entreprises <ShieldCheck className="w-5 h-5 text-brand-600" />
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">Validez les dossiers KYC des entreprises et cabinets RH</p>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-4"><Skeleton variant="table" count={1} /></div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Organisation</th>
                  <th className="px-6 py-4">Type de compte</th>
                  <th className="px-6 py-4">Soumis le</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map(r => {
                  const account = typeof r.user === 'string' ? null : r.user
                  return (
                    <tr key={r._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-800">{account?.companyName || `${account?.firstName} ${account?.lastName}`}</p>
                        <p className="text-xs text-slate-400">{account?.email}</p>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600 font-semibold capitalize">{account?.role === 'agency' ? 'Cabinet RH' : 'Entreprise'}</td>
                      <td className="px-6 py-4 text-xs text-slate-400">{r.submittedAt ? new Date(r.submittedAt).toLocaleDateString('fr-FR') : '—'}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button disabled={busyId === r._id} onClick={() => handleApprove(r)} className="p-1 hover:bg-emerald-100 rounded text-emerald-600 disabled:opacity-40" title="Approuver">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button disabled={busyId === r._id} onClick={() => setRejecting(r)} className="p-1 hover:bg-red-100 rounded text-red-500 disabled:opacity-40" title="Rejeter">
                            <XCircle className="w-4 h-4" />
                          </button>
                          <button onClick={() => setViewing(r)} className="p-1.5 text-slate-400 hover:text-slate-600" title="Consulter le dossier"><Eye className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {records.length === 0 && (
                  <tr><td colSpan={4} className="p-12 text-center text-slate-400 text-sm">Aucun dossier en attente de vérification.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* View documents modal */}
      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setViewing(null)} />
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative z-10 overflow-hidden border border-slate-100 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900">Dossier de vérification</h3>
              <button type="button" onClick={() => setViewing(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-xs text-slate-400">NINEA</p><p className="font-semibold text-slate-800">{viewing.ninea || '—'}</p></div>
              <div><p className="text-xs text-slate-400">RCCM</p><p className="font-semibold text-slate-800">{viewing.rccm || '—'}</p></div>
            </div>
            <div className="space-y-2">
              {[
                { label: 'Justificatif NINEA', url: viewing.nineaDocumentUrl },
                { label: 'Justificatif RCCM', url: viewing.rccmDocumentUrl },
                { label: "Pièce d'identité", url: viewing.idDocumentUrl },
              ].filter(d => d.url).map(d => (
                <a key={d.label} href={d.url} target="_blank" rel="noreferrer" className="flex items-center justify-between bg-slate-50 rounded-xl p-3 hover:bg-slate-100 transition-colors">
                  <span className="text-sm text-slate-700">{d.label}</span>
                  <span className="text-xs text-brand-600 font-semibold">Ouvrir</span>
                </a>
              ))}
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="secondary" fullWidth onClick={() => { setRejecting(viewing) }}>Rejeter</Button>
              <Button fullWidth loading={busyId === viewing._id} onClick={() => handleApprove(viewing)}>Approuver</Button>
            </div>
          </div>
        </div>
      )}

      {/* Reject modal */}
      {rejecting && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setRejecting(null)} />
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl relative z-10 overflow-hidden border border-slate-100 p-6">
            <form onSubmit={handleReject} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-slate-900">Rejeter le dossier</h3>
                <button type="button" onClick={() => setRejecting(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Motif du rejet</label>
                <textarea required minLength={5} rows={3} value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Expliquez ce qui doit être corrigé..." className="input-field resize-none" />
              </div>
              <Button type="submit" fullWidth variant="secondary" loading={busyId === rejecting._id}>Confirmer le rejet</Button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
