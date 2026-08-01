import { useEffect, useState } from 'react'
import {
  Plus, Search,
  Zap, Clock, Users, Trash2, Send, PauseCircle, XCircle
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import { ContractBadge, StatusBadge } from '../../components/ui/Badge'
import { useToast } from '../../components/ui/Toast'
import { jobsService } from '../../lib/services/jobs'
import { JOB_STATUS_LABELS } from '../../lib/job-labels'
import { extractApiErrorMessage } from '../../lib/api'
import type { Job, JobStatus } from '../../lib/types'

export default function CompanyJobs() {
  const navigate = useNavigate()
  const toast = useToast()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'Toutes' | JobStatus>('Toutes')

  const load = () => {
    setLoading(true)
    jobsService.mine().then(setJobs).catch(() => setJobs([])).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || job.city.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'Toutes' || job.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const runAction = async (id: string, action: 'publish' | 'suspend' | 'close' | 'boost' | 'unboost') => {
    setBusyId(id)
    try {
      const updated = await jobsService[action](id)
      setJobs(prev => prev.map(j => j._id === id ? updated : j))
    } catch (err) {
      toast.error(extractApiErrorMessage(err))
    } finally {
      setBusyId(null)
    }
  }

  const handleDeleteJob = async (id: string) => {
    setBusyId(id)
    try {
      await jobsService.remove(id)
      setJobs(prev => prev.filter(j => j._id !== id))
    } catch (err) {
      toast.error(extractApiErrorMessage(err))
    } finally {
      setBusyId(null)
    }
  }

  return (
    <DashboardLayout role="company">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Mes offres d'emploi</h1>
          <p className="text-slate-500 text-sm mt-0.5">Gérez vos publications et suivez les performances</p>
        </div>
        <Button onClick={() => navigate('/dashboard/company/jobs/new')} leftIcon={<Plus className="w-4 h-4" />}>
          Publier une offre
        </Button>
      </div>

      <div className="card">
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher une offre..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as typeof statusFilter)}
              className="bg-white border border-slate-200 rounded-xl text-xs px-3 py-2 outline-none cursor-pointer"
            >
              <option value="Toutes">Toutes les offres</option>
              {(Object.keys(JOB_STATUS_LABELS) as JobStatus[]).map(s => <option key={s} value={s}>{JOB_STATUS_LABELS[s]}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Offre</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4">Candidatures</th>
                <th className="px-6 py-4">Expiration</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={5} className="p-12 text-center text-slate-400 text-sm">Chargement…</td></tr>
              ) : (
                <>
                  {filteredJobs.map(job => (
                    <tr key={job._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-bold text-slate-800 group-hover:text-brand-600 transition-colors">{job.title}</p>
                          {job.isBoosted && <Zap className="w-3.5 h-3.5 text-amber-500 animate-pulse" />}
                        </div>
                        <div className="flex items-center gap-2">
                          <ContractBadge type={job.contractType} />
                          <span className="text-[10px] text-slate-400">{job.city}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={JOB_STATUS_LABELS[job.status]} />
                        {job.status === 'pending_review' && job.moderationNote && (
                          <p className="text-[10px] text-red-500 mt-1 max-w-[160px]">{job.moderationNote}</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 cursor-pointer hover:text-brand-600" onClick={() => navigate('/dashboard/company/applications')}>
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-sm font-semibold text-slate-700">{job.applicantsCount}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {job.expiresAt ? new Date(job.expiresAt).toLocaleDateString('fr-FR') : '—'}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          {(job.status === 'draft' || job.status === 'suspended') && (
                            <button disabled={busyId === job._id} onClick={() => runAction(job._id, 'publish')} className="p-2 text-slate-400 hover:text-emerald-600 transition-colors disabled:opacity-40" title="Publier">
                              <Send className="w-4 h-4" />
                            </button>
                          )}
                          {job.status === 'active' && (
                            <button disabled={busyId === job._id} onClick={() => runAction(job._id, 'suspend')} className="p-2 text-slate-400 hover:text-amber-600 transition-colors disabled:opacity-40" title="Suspendre">
                              <PauseCircle className="w-4 h-4" />
                            </button>
                          )}
                          {job.status === 'active' && (
                            job.isBoosted ? (
                              <button disabled={busyId === job._id} onClick={() => runAction(job._id, 'unboost')} className="p-2 text-amber-500 hover:text-slate-400 transition-colors disabled:opacity-40" title="Retirer la mise en avant">
                                <Zap className="w-4 h-4 fill-amber-500" />
                              </button>
                            ) : (
                              <button disabled={busyId === job._id} onClick={() => runAction(job._id, 'boost')} className="p-2 text-slate-400 hover:text-amber-500 transition-colors disabled:opacity-40" title="Booster l'offre">
                                <Zap className="w-4 h-4" />
                              </button>
                            )
                          )}
                          {(job.status === 'active' || job.status === 'suspended') && (
                            <button disabled={busyId === job._id} onClick={() => runAction(job._id, 'close')} className="p-2 text-slate-400 hover:text-red-600 transition-colors disabled:opacity-40" title="Clôturer">
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button disabled={busyId === job._id} onClick={() => handleDeleteJob(job._id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors disabled:opacity-40" title="Supprimer l'offre">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredJobs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-slate-400 text-sm">
                        Aucune offre d'emploi publiée.
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
