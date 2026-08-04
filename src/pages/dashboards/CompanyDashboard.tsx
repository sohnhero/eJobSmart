import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Briefcase, Users, TrendingUp, Clock, Plus, ChevronRight,
  Eye, CheckCircle,
  XCircle, Zap, List, LayoutGrid, Sparkles,
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import { ContractBadge } from '../../components/ui/Badge'
import MatchScore from '../../components/ui/MatchScore'
import Button from '../../components/ui/Button'
import Avatar from '../../components/ui/Avatar'
import KycBanner from '../../components/ui/KycBanner'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../components/ui/Toast'
import { jobsService } from '../../lib/services/jobs'
import { applicationsService } from '../../lib/services/applications'
import { matchingService } from '../../lib/services/matching'
import { extractApiErrorMessage } from '../../lib/api'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import type { Application, ApplicationStatus, CandidateMatch, Job } from '../../lib/types'

const KANBAN_COLUMNS: { id: string; label: string; color: string; statuses: ApplicationStatus[] }[] = [
  { id: 'received', label: 'Reçues', color: 'bg-slate-100', statuses: ['Reçue'] },
  { id: 'review', label: 'En examen', color: 'bg-amber-50', statuses: ["En cours d'examen"] },
  { id: 'shortlisted', label: 'Présélectionnées', color: 'bg-blue-50', statuses: ['Présélectionnée'] },
  { id: 'interview', label: 'Entretien', color: 'bg-purple-50', statuses: ['Entretien planifié', 'Test envoyé'] },
  { id: 'offer', label: 'Offre émise', color: 'bg-emerald-50', statuses: ['Offre émise', 'Acceptée'] },
]

export default function CompanyDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const toast = useToast()
  const [activeJobTab, setActiveJobTab] = useState<'kanban' | 'list'>('kanban')

  const [jobs, setJobs] = useState<Job[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [applicationJobId, setApplicationJobId] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [selectedJobId, setSelectedJobId] = useState<string>('')
  const [suggested, setSuggested] = useState<CandidateMatch[]>([])
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    jobsService.mine().then(async (myJobs) => {
      setJobs(myJobs)
      if (myJobs.length > 0) setSelectedJobId(myJobs[0]._id)
      const perJob = await Promise.all(
        myJobs.map(job => applicationsService.forJob(job._id).then(res => ({ job, items: res.items })).catch(() => ({ job, items: [] as Application[] })))
      )
      const allApps: Application[] = []
      const jobIdByApp: Record<string, string> = {}
      perJob.forEach(({ job, items }) => items.forEach(app => { allApps.push(app); jobIdByApp[app._id] = job._id }))
      setApplications(allApps)
      setApplicationJobId(jobIdByApp)
    }).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!selectedJobId) return
    matchingService.recommendedCandidates(selectedJobId, 4).then(setSuggested).catch(() => setSuggested([]))
  }, [selectedJobId])

  const activeJobs = jobs.filter(j => j.status === 'active')
  const totalApplications = applications.length
  const newApplications = applications.filter(a => a.status === 'Reçue').length
  const interviewsScheduled = applications.filter(a => a.status === 'Entretien planifié').length
  const decided = applications.filter(a => ['Acceptée', 'Refusée'].includes(a.status)).length
  const accepted = applications.filter(a => a.status === 'Acceptée').length
  const conversionRate = decided > 0 ? Math.round((accepted / decided) * 100) : 0

  const statusChartData = useMemo(() => {
    const counts: Record<string, number> = {}
    applications.forEach(a => { counts[a.status] = (counts[a.status] ?? 0) + 1 })
    return Object.entries(counts).map(([status, count]) => ({ status, count }))
  }, [applications])

  const pipelineApps = selectedJobId ? applications.filter(a => applicationJobId[a._id] === selectedJobId) : applications

  const handleQuickAction = async (app: Application, status: 'Présélectionnée' | 'Refusée') => {
    setUpdatingId(app._id)
    try {
      const updated = await applicationsService.updateStatus(app._id, { status })
      setApplications(prev => prev.map(a => a._id === app._id ? updated : a))
    } catch (err) {
      toast.error(extractApiErrorMessage(err))
    } finally {
      setUpdatingId(null)
    }
  }

  const candidateName = (app: Application) => {
    const c = typeof app.candidate === 'string' ? null : app.candidate
    return c ? `${c.firstName} ${c.lastName}` : 'Candidat'
  }
  const jobTitle = (app: Application) => jobs.find(j => j._id === applicationJobId[app._id])?.title ?? ''

  return (
    <DashboardLayout role="company">
      <KycBanner role="company" />
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Tableau de bord</h1>
          <p className="text-slate-500 text-sm mt-0.5 flex items-center gap-1.5">
            Bienvenue, {user?.companyName ?? user?.firstName} <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </p>
        </div>
        <Button onClick={() => navigate('/dashboard/company/jobs/new')} leftIcon={<Plus className="w-4 h-4" />}>
          Publier une offre
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Offres actives" value={activeJobs.length} icon={Briefcase} iconBg="bg-brand-50" iconColor="text-brand-600" />
        <StatCard title="Candidatures" value={totalApplications} icon={Users} iconBg="bg-purple-50" iconColor="text-purple-600" />
        <StatCard title="Nouvelles" value={newApplications} subtitle="Pas encore examinées" icon={Clock} iconBg="bg-amber-50" iconColor="text-amber-600" />
        <StatCard title="Entretiens planifiés" value={interviewsScheduled} icon={TrendingUp} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Chart */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900">Répartition des candidatures par statut</h2>
          </div>
          {statusChartData.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-12">Aucune candidature pour le moment</p>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={statusChartData} barSize={24}>
                <XAxis dataKey="status" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} name="Candidatures" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Quick stats */}
        <div className="space-y-3">
          <div className="card p-4">
            <p className="text-xs text-slate-400 mb-1">Taux de conversion</p>
            <p className="text-2xl font-black text-slate-900">{conversionRate}%</p>
            <p className="text-xs text-slate-500">Candidatures décidées → Embauches</p>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${conversionRate}%` }} />
            </div>
          </div>
          <div className="card p-4">
            <p className="text-xs text-slate-400 mb-1">Offres publiées</p>
            <p className="text-2xl font-black text-slate-900">{jobs.length}</p>
            <p className="text-xs text-slate-500">Toutes offres confondues</p>
          </div>
          <div className="card p-4">
            <p className="text-xs text-slate-400 mb-1">Entretiens planifiés</p>
            <p className="text-2xl font-black text-slate-900">{interviewsScheduled}</p>
            <p className="text-xs text-slate-500">Total en cours</p>
          </div>
        </div>
      </div>

      {/* Kanban */}
      <div className="card p-5 mb-6 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="font-bold text-slate-900">Pipeline de recrutement</h2>
            {jobs.length > 0 && (
              <select value={selectedJobId} onChange={e => setSelectedJobId(e.target.value)} className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-600">
                {jobs.map(j => <option key={j._id} value={j._id}>{j.title}</option>)}
              </select>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <button onClick={() => setActiveJobTab('kanban')} className={`p-1.5 rounded-lg transition-colors ${activeJobTab === 'kanban' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button onClick={() => setActiveJobTab('list')} className={`p-1.5 rounded-lg transition-colors ${activeJobTab === 'list' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-slate-400 text-center py-8">Chargement…</p>
        ) : pipelineApps.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">Aucune candidature pour cette offre</p>
        ) : activeJobTab === 'kanban' ? (
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {KANBAN_COLUMNS.map(col => {
              const colApps = pipelineApps.filter(a => col.statuses.includes(a.status))
              return (
                <div key={col.id} className="flex-shrink-0 w-56">
                  <div className={`${col.color} rounded-2xl p-3`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-700">{col.label}</span>
                      <span className="text-xs bg-white text-slate-600 px-2 py-0.5 rounded-full font-bold shadow-sm">{colApps.length}</span>
                    </div>
                    <div className="space-y-2">
                      {colApps.map(app => (
                        <div key={app._id} className="kanban-card group">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Avatar name={candidateName(app)} size="xs" />
                              <div>
                                <p className="text-xs font-semibold text-slate-800 leading-none">{candidateName(app)}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => navigate('/dashboard/company/applications')} className="flex-1 text-[10px] font-medium py-1 bg-slate-100 hover:bg-brand-100 hover:text-brand-700 rounded-lg transition-colors flex items-center justify-center gap-1">
                              <Eye className="w-2.5 h-2.5" /> Voir
                            </button>
                            <button disabled={updatingId === app._id} onClick={() => handleQuickAction(app, 'Présélectionnée')} className="flex-1 text-[10px] font-medium py-1 bg-slate-100 hover:bg-emerald-100 hover:text-emerald-700 rounded-lg transition-colors flex items-center justify-center gap-1 disabled:opacity-50">
                              <CheckCircle className="w-2.5 h-2.5" /> OK
                            </button>
                            <button disabled={updatingId === app._id} onClick={() => handleQuickAction(app, 'Refusée')} className="flex-1 text-[10px] font-medium py-1 bg-slate-100 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors flex items-center justify-center gap-1 disabled:opacity-50">
                              <XCircle className="w-2.5 h-2.5" /> Non
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {pipelineApps.map(app => (
              <div key={app._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors">
                <Avatar name={candidateName(app)} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900">{candidateName(app)}</p>
                  <p className="text-xs text-slate-500">{jobTitle(app)}</p>
                </div>
                <span className="text-xs text-slate-400">{app.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active jobs + CV suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active jobs */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900">Mes offres actives</h2>
            <Button size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => navigate('/dashboard/company/jobs/new')}>Nouvelle offre</Button>
          </div>
          <div className="space-y-3">
            {activeJobs.slice(0, 5).map(job => (
              <div key={job._id} onClick={() => navigate('/dashboard/company/jobs')} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group border border-slate-100">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900 group-hover:text-brand-600 transition-colors truncate">{job.title}</p>
                    {job.isBoosted && <Zap className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <ContractBadge type={job.contractType} />
                    <span className="text-xs text-slate-400 flex items-center gap-1"><Users className="w-3 h-3" />{job.applicantsCount} candidats</span>
                  </div>
                </div>
                {job.expiresAt && (
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-slate-400">Expire</p>
                    <p className="text-xs font-semibold text-slate-700">
                      {new Date(job.expiresAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                )}
              </div>
            ))}
            {activeJobs.length === 0 && <p className="text-sm text-slate-400 text-center py-6">Aucune offre active</p>}
          </div>
        </div>

        {/* Suggested profiles from CV database */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900">Profils suggérés</h2>
            <span className="text-xs text-slate-400">Base CV propriétaire</span>
          </div>
          <div className="space-y-3">
            {suggested.map(({ profile, score }) => {
              const owner = typeof profile.user === 'string' ? null : profile.user
              return (
                <div key={profile._id} onClick={() => navigate('/dashboard/company/cv-database')} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer border border-slate-100 group">
                  <Avatar name={owner ? `${owner.firstName} ${owner.lastName}` : 'Candidat'} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 group-hover:text-brand-600 transition-colors">{owner ? `${owner.firstName} ${owner.lastName}` : 'Candidat'}</p>
                    <p className="text-xs text-slate-500 truncate">{profile.headline}</p>
                  </div>
                  <MatchScore score={Math.round(score * 100)} size="sm" />
                </div>
              )
            })}
            {suggested.length === 0 && <p className="text-sm text-slate-400 text-center py-6">Aucune suggestion pour le moment</p>}
          </div>
          <button onClick={() => navigate('/dashboard/company/cv-database')} className="mt-3 w-full text-xs text-brand-600 font-medium flex items-center justify-center gap-1 hover:text-brand-800">
            Voir toute la base CV <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}
