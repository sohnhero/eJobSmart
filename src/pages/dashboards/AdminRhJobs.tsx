import { useEffect, useState } from 'react'
import {
  Briefcase, CheckCircle, XCircle, Eye, Search, Flag, X,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Skeleton from '../../components/ui/Skeleton'
import { useToast } from '../../components/ui/Toast'
import { jobsService } from '../../lib/services/jobs'
import { reportsService } from '../../lib/services/reports'
import { extractApiErrorMessage } from '../../lib/api'
import type { Job, Report } from '../../lib/types'

export default function AdminRhJobs() {
  const navigate = useNavigate()
  const toast = useToast()
  const [tab, setTab] = useState<'pending' | 'reports'>('pending')
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [jobs, setJobs] = useState<Job[]>([])
  const [busyId, setBusyId] = useState<string | null>(null)
  const [rejectingJob, setRejectingJob] = useState<Job | null>(null)
  const [rejectNote, setRejectNote] = useState('')

  const [reports, setReports] = useState<Report[]>([])
  const [loadingReports, setLoadingReports] = useState(true)

  const loadJobs = () => {
    setLoading(true)
    jobsService.pendingReview().then(setJobs).catch(() => setJobs([])).finally(() => setLoading(false))
  }
  const loadReports = () => {
    setLoadingReports(true)
    reportsService.list({ status: 'pending', limit: 50 }).then(res => setReports(res.items)).catch(() => setReports([])).finally(() => setLoadingReports(false))
  }

  useEffect(() => { loadJobs(); loadReports() }, [])

  const filteredJobs = jobs.filter(j =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.companyName.toLowerCase().includes(search.toLowerCase())
  )

  const handleApprove = async (job: Job) => {
    setBusyId(job._id)
    try {
      await jobsService.approve(job._id)
      setJobs(prev => prev.filter(j => j._id !== job._id))
      toast.success(`L'offre "${job.title}" a été approuvée et publiée !`)
    } catch (err) {
      toast.error(extractApiErrorMessage(err))
    } finally {
      setBusyId(null)
    }
  }

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rejectingJob) return
    setBusyId(rejectingJob._id)
    try {
      await jobsService.reject(rejectingJob._id, rejectNote || undefined)
      setJobs(prev => prev.filter(j => j._id !== rejectingJob._id))
      toast.info(`L'offre "${rejectingJob.title}" a été rejetée.`)
      setRejectingJob(null)
      setRejectNote('')
    } catch (err) {
      toast.error(extractApiErrorMessage(err))
    } finally {
      setBusyId(null)
    }
  }

  const handleResolveReport = async (report: Report, action: 'resolve' | 'dismiss') => {
    setBusyId(report._id)
    try {
      await reportsService[action](report._id)
      setReports(prev => prev.filter(r => r._id !== report._id))
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
          Modération des offres <Briefcase className="w-5 h-5 text-brand-600" />
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">Vérifiez et validez les offres d'emploi avant leur publication</p>
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={() => setTab('pending')} className={`text-sm font-semibold px-4 py-2 rounded-xl transition-colors ${tab === 'pending' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
          En attente de modération {jobs.length > 0 && `(${jobs.length})`}
        </button>
        <button onClick={() => setTab('reports')} className={`text-sm font-semibold px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${tab === 'reports' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
          <Flag className="w-3.5 h-3.5" /> Signalements {reports.length > 0 && `(${reports.length})`}
        </button>
      </div>

      {tab === 'pending' && (
        <div className="card">
          <div className="p-4 border-b border-slate-100">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher par poste ou entreprise..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-4"><Skeleton variant="table" count={1} /></div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="px-6 py-4">Offre</th>
                    <th className="px-6 py-4">Entreprise</th>
                    <th className="px-6 py-4">Type de contrat</th>
                    <th className="px-6 py-4">Date de soumission</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredJobs.map(j => (
                    <tr key={j._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800 text-sm">{j.title}</td>
                      <td className="px-6 py-4 text-xs text-slate-600 font-semibold">{j.companyName}</td>
                      <td className="px-6 py-4 text-xs text-slate-500">{j.contractType}</td>
                      <td className="px-6 py-4 text-xs text-slate-400">{new Date(j.createdAt).toLocaleDateString('fr-FR')}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button disabled={busyId === j._id} onClick={() => handleApprove(j)} className="p-1 hover:bg-emerald-100 rounded text-emerald-600 disabled:opacity-40" title="Approuver">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button disabled={busyId === j._id} onClick={() => setRejectingJob(j)} className="p-1 hover:bg-red-100 rounded text-red-500 disabled:opacity-40" title="Rejeter">
                            <XCircle className="w-4 h-4" />
                          </button>
                          <button onClick={() => navigate(`/jobs/${j._id}`)} className="p-1.5 text-slate-400 hover:text-slate-600" title="Consulter l'offre"><Eye className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredJobs.length === 0 && (
                    <tr><td colSpan={5} className="p-12 text-center text-slate-400 text-sm">Aucune offre en attente de modération.</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {tab === 'reports' && (
        <div className="card">
          <div className="overflow-x-auto">
            {loadingReports ? (
              <div className="p-4"><Skeleton variant="table" count={1} /></div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="px-6 py-4">Offre signalée</th>
                    <th className="px-6 py-4">Signalé par</th>
                    <th className="px-6 py-4">Motif</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reports.map(r => {
                    const job = typeof r.job === 'string' ? null : r.job
                    const reporter = typeof r.reportedBy === 'string' ? null : r.reportedBy
                    return (
                      <tr key={r._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 cursor-pointer" onClick={() => job && navigate(`/jobs/${job._id}`)}>
                          <p className="text-sm font-bold text-slate-800">{job?.title ?? 'Offre supprimée'}</p>
                          <p className="text-xs text-slate-400">{job?.companyName}</p>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-600">{reporter ? `${reporter.firstName} ${reporter.lastName}` : '—'}</td>
                        <td className="px-6 py-4 text-xs text-slate-500 max-w-[240px]">{r.reason}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            <button disabled={busyId === r._id} onClick={() => handleResolveReport(r, 'resolve')} className="p-1 hover:bg-emerald-100 rounded text-emerald-600 disabled:opacity-40" title="Traiter (action prise)">
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button disabled={busyId === r._id} onClick={() => handleResolveReport(r, 'dismiss')} className="p-1 hover:bg-slate-200 rounded text-slate-500 disabled:opacity-40" title="Rejeter le signalement">
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                  {reports.length === 0 && (
                    <tr><td colSpan={4} className="p-12 text-center text-slate-400 text-sm">Aucun signalement en attente.</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setRejectingJob(null)} />
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl relative z-10 overflow-hidden border border-slate-100 p-6">
            <form onSubmit={handleReject} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-slate-900">Rejeter l'offre</h3>
                <button type="button" onClick={() => setRejectingJob(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
              </div>
              <p className="text-xs text-slate-500">{rejectingJob.title} — {rejectingJob.companyName}</p>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Motif du rejet</label>
                <textarea rows={3} value={rejectNote} onChange={e => setRejectNote(e.target.value)} placeholder="Expliquez pourquoi cette offre est rejetée..." className="input-field resize-none" />
              </div>
              <Button type="submit" fullWidth variant="secondary" loading={busyId === rejectingJob._id}>Confirmer le rejet</Button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
