import { useEffect, useState } from 'react'
import {
  UserCheck, Users, Briefcase, BookOpen,
  CheckCircle, XCircle,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import Button from '../../components/ui/Button'
import Skeleton from '../../components/ui/Skeleton'
import { useToast } from '../../components/ui/Toast'
import { talentPoolService } from '../../lib/services/talent-pool'
import { jobsService } from '../../lib/services/jobs'
import { trainingsService } from '../../lib/services/trainings'
import { adminService } from '../../lib/services/admin'
import { extractApiErrorMessage } from '../../lib/api'
import type { TalentPoolRequest } from '../../lib/types'

export default function AdminRhDashboard() {
  const navigate = useNavigate()
  const toast = useToast()

  const [isLoading, setIsLoading] = useState(true)
  const [requests, setRequests] = useState<TalentPoolRequest[]>([])
  const [busyId, setBusyId] = useState<string | null>(null)

  const [talentPoolTotal, setTalentPoolTotal] = useState(0)
  const [activeCandidates, setActiveCandidates] = useState(0)
  const [pendingJobsCount, setPendingJobsCount] = useState(0)
  const [publishedTrainingsCount, setPublishedTrainingsCount] = useState(0)

  const loadQueue = () => {
    setIsLoading(true)
    talentPoolService.queue({ status: 'pending', limit: 10 }).then(res => setRequests(res.items)).catch(() => setRequests([])).finally(() => setIsLoading(false))
  }

  useEffect(() => {
    loadQueue()
    talentPoolService.search({ limit: 1 }).then(res => setTalentPoolTotal(res.total)).catch(() => {})
    jobsService.pendingReview().then(jobs => setPendingJobsCount(jobs.length)).catch(() => {})
    trainingsService.list({ limit: 1 }).then(res => setPublishedTrainingsCount(res.total)).catch(() => {})
    Promise.all([
      adminService.listUsers('candidate').catch(() => []),
      adminService.listUsers('freelance').catch(() => []),
    ]).then(([candidates, freelances]) => {
      setActiveCandidates([...candidates, ...freelances].filter(u => u.isActive).length)
    })
  }, [])

  const stats = [
    { title: 'Talents au vivier', value: talentPoolTotal.toLocaleString('fr-FR'), icon: UserCheck, iconColor: 'text-amber-600' },
    { title: 'Candidats actifs', value: activeCandidates.toLocaleString('fr-FR'), icon: Users, iconColor: 'text-blue-600' },
    { title: 'Offres à modérer', value: pendingJobsCount.toString(), icon: Briefcase, iconColor: 'text-purple-600' },
    { title: 'Formations publiées', value: publishedTrainingsCount.toString(), icon: BookOpen, iconColor: 'text-emerald-600' },
  ]

  const handleReview = async (id: string, action: 'approve' | 'reject') => {
    setBusyId(id)
    try {
      await talentPoolService[action](id)
      setRequests(prev => prev.filter(r => r._id !== id))
    } catch (err) {
      toast.error(extractApiErrorMessage(err))
    } finally {
      setBusyId(null)
    }
  }

  return (
    <DashboardLayout role="admin-rh">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Gestion Interne RH</h1>
          <p className="text-slate-500 text-sm mt-0.5">Administration du vivier de talents et modération plateforme</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(stat => <StatCard key={stat.title} {...stat} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main: Talent pool request queue */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-900">Demandes de mise en relation en attente</h2>
            </div>
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="p-4">
                  <Skeleton variant="table" count={1} />
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Candidat</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Demandeur</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Message</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {requests.map(r => {
                      const candidate = typeof r.candidate === 'string' ? null : r.candidate
                      const requester = typeof r.requestedBy === 'string' ? null : r.requestedBy
                      return (
                        <tr key={r._id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-semibold text-slate-800 text-sm">{candidate ? `${candidate.firstName} ${candidate.lastName}` : 'Candidat'}</p>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">{requester?.companyName ?? (requester ? `${requester.firstName} ${requester.lastName}` : '—')}</td>
                          <td className="px-6 py-4 text-xs text-slate-500 max-w-[240px] truncate">{r.message ?? '—'}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-1">
                              <button disabled={busyId === r._id} onClick={() => handleReview(r._id, 'approve')} className="p-2 text-slate-400 hover:text-emerald-600 transition-colors disabled:opacity-40" title="Approuver">
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button disabled={busyId === r._id} onClick={() => handleReview(r._id, 'reject')} className="p-2 text-slate-400 hover:text-red-600 transition-colors disabled:opacity-40" title="Rejeter">
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}

                    {requests.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-slate-400 text-sm">
                          Aucune demande en attente.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
            <div className="px-6 py-3 bg-slate-50/50 border-t border-slate-100 text-center">
              <button onClick={() => navigate('/dashboard/admin-rh/cv-database')} className="text-xs font-semibold text-slate-500 hover:text-brand-600 transition-colors">
                Gérer tout le vivier de talents
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card p-5 border-l-4 border-l-purple-500">
              <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-purple-600" /> Offres à valider
              </h3>
              <p className="text-xs text-slate-500 mb-4">{pendingJobsCount} offre{pendingJobsCount > 1 ? 's' : ''} d'entreprises en attente de modération.</p>
              <Button fullWidth size="sm" variant="secondary" onClick={() => navigate('/dashboard/admin-rh/jobs')}>Accéder à la modération</Button>
            </div>
            <div className="card p-5 border-l-4 border-l-emerald-500">
              <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" /> Formations
              </h3>
              <p className="text-xs text-slate-500 mb-4">Gérez le catalogue et les inscriptions aux formations.</p>
              <Button fullWidth size="sm" variant="secondary" onClick={() => navigate('/dashboard/admin-rh/trainings')}>Catalogue formations</Button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card p-5">
            <h3 className="font-bold text-slate-900 mb-4 text-sm flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-brand-600" /> Vivier de talents
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {talentPoolTotal} profil{talentPoolTotal > 1 ? 's' : ''} actuellement visible{talentPoolTotal > 1 ? 's' : ''} dans le vivier propriétaire eJobSmart.
            </p>
            <Button fullWidth size="sm" variant="secondary" className="mt-4" onClick={() => navigate('/dashboard/admin-rh/cv-database')}>
              Parcourir le vivier
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
