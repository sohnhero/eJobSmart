import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users, Briefcase, TrendingUp, AlertTriangle,
  CheckCircle, XCircle, Globe,
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import Badge, { StatusBadge } from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import Skeleton from '../../components/ui/Skeleton'
import { useToast } from '../../components/ui/Toast'
import { adminService } from '../../lib/services/admin'
import { jobsService } from '../../lib/services/jobs'
import { reportsService } from '../../lib/services/reports'
import { extractApiErrorMessage } from '../../lib/api'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import type { AdminDashboardOverview, Job, Report, User } from '../../lib/types'

const JOB_STATUS_LABELS_FR: Record<string, string> = {
  draft: 'Brouillon', pending_review: 'En attente', active: 'Active', suspended: 'Suspendue', closed: 'Clôturée', expired: 'Expirée',
}
const ROLE_LABELS_FR: Record<string, string> = {
  candidate: 'Candidat', freelance: 'Freelance', company: 'Entreprise', agency: 'Cabinet RH', admin_rh: 'Admin RH', super_admin: 'Super Admin', trainer: 'Formateur',
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [overview, setOverview] = useState<AdminDashboardOverview | null>(null)
  const [recentUsers, setRecentUsers] = useState<User[]>([])
  const [pendingJobs, setPendingJobs] = useState<Job[]>([])
  const [pendingReports, setPendingReports] = useState<Report[]>([])
  const [busyId, setBusyId] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      adminService.dashboardOverview().catch(() => null),
      adminService.listUsers().catch(() => []),
      jobsService.pendingReview().catch(() => []),
      reportsService.list({ status: 'pending', limit: 5 }).then(res => res.items).catch(() => []),
    ]).then(([ov, users, jobs, reports]) => {
      setOverview(ov)
      setRecentUsers([...users].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 6))
      setPendingJobs(jobs.slice(0, 5))
      setPendingReports(reports)
      setIsLoading(false)
    })
  }, [])

  const totalUsers = overview ? Object.values(overview.usersByRole).reduce((a, b) => a + b, 0) : 0
  const moderationCount = pendingJobs.length + pendingReports.length

  const jobsStatusChart = overview ? Object.entries(overview.jobsByStatus).map(([status, count]) => ({ status: JOB_STATUS_LABELS_FR[status] ?? status, count })) : []

  const handleToggleUser = async (user: User) => {
    setBusyId(user._id)
    try {
      const updated = user.isActive ? await adminService.deactivateUser(user._id) : await adminService.activateUser(user._id)
      setRecentUsers(prev => prev.map(u => u._id === user._id ? updated : u))
      toast.success(updated.isActive ? `${user.firstName} réactivé` : `${user.firstName} désactivé`)
    } catch (err) {
      toast.error(extractApiErrorMessage(err))
    } finally {
      setBusyId(null)
    }
  }

  const handleApproveJob = async (job: Job) => {
    setBusyId(job._id)
    try {
      await jobsService.approve(job._id)
      setPendingJobs(prev => prev.filter(j => j._id !== job._id))
      toast.success(`Offre "${job.title}" approuvée`)
    } catch (err) {
      toast.error(extractApiErrorMessage(err))
    } finally {
      setBusyId(null)
    }
  }

  const handleRejectJob = async (job: Job) => {
    setBusyId(job._id)
    try {
      await jobsService.reject(job._id)
      setPendingJobs(prev => prev.filter(j => j._id !== job._id))
      toast.info(`Offre "${job.title}" rejetée`)
    } catch (err) {
      toast.error(extractApiErrorMessage(err))
    } finally {
      setBusyId(null)
    }
  }

  const handleReport = async (report: Report, action: 'resolve' | 'dismiss') => {
    setBusyId(report._id)
    try {
      await reportsService[action](report._id)
      setPendingReports(prev => prev.filter(r => r._id !== report._id))
    } catch (err) {
      toast.error(extractApiErrorMessage(err))
    } finally {
      setBusyId(null)
    }
  }

  return (
    <DashboardLayout role="admin">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Administration</h1>
          <p className="text-sm text-slate-500 mt-0.5">Vue globale de la plateforme eJobSmart</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-xl border border-emerald-200">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs font-semibold text-emerald-700">Plateforme opérationnelle</span>
        </div>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Utilisateurs totaux" value={totalUsers.toLocaleString('fr-FR')} icon={Users} iconBg="bg-brand-50" iconColor="text-brand-600" />
        <StatCard title="Offres publiées" value={(overview?.totalJobs ?? 0).toLocaleString('fr-FR')} icon={Briefcase} iconBg="bg-purple-50" iconColor="text-purple-600" />
        <StatCard title="Taux de conversion" value={`${overview?.conversionRate ?? 0}%`} subtitle="Candidatures / offre" icon={TrendingUp} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
        <StatCard title="En modération" value={moderationCount.toString()} subtitle="Éléments à traiter" icon={AlertTriangle} iconBg="bg-amber-50" iconColor="text-amber-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Jobs by status chart */}
        <div className="lg:col-span-2 card p-5">
          <h2 className="font-bold text-slate-900 mb-4">Offres par statut</h2>
          {isLoading ? (
            <div className="h-[200px] flex items-center justify-center"><Skeleton variant="text" count={3} /></div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={jobsStatusChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="status" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: 11 }} />
                <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} name="Offres" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top sectors */}
        <div className="card p-5">
          <h2 className="font-bold text-slate-900 mb-4">Top secteurs</h2>
          {(overview?.topSectors.length ?? 0) === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">Aucune donnée</p>
          ) : (
            <div className="space-y-3">
              {overview!.topSectors.map((s, i) => {
                const max = overview!.topSectors[0]?.count || 1
                return (
                  <div key={s.sector} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-400 w-4">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-semibold text-slate-700 truncate">{s.sector}</p>
                        <span className="text-xs text-slate-500">{s.count}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div className="bg-brand-600 h-full rounded-full" style={{ width: `${(s.count / max) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent users */}
      <div className="card p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-slate-900">Nouveaux utilisateurs</h2>
          <button onClick={() => navigate('/dashboard/admin/users')} className="text-xs font-semibold text-brand-600 hover:text-brand-800">Tout voir</button>
        </div>
        <div className="overflow-x-auto">
          {isLoading ? (
            <Skeleton variant="table" count={1} />
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="text-slate-400 text-left">
                  <th className="pb-2 font-medium">Utilisateur</th>
                  <th className="pb-2 font-medium">Rôle</th>
                  <th className="pb-2 font-medium">Statut</th>
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentUsers.map(u => (
                  <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        <Avatar name={`${u.firstName} ${u.lastName}`} size="xs" />
                        <div>
                          <p className="font-semibold text-slate-800 flex items-center gap-1.5">{u.firstName} {u.lastName}</p>
                          <p className="text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5">
                      <Badge variant={u.role === 'company' ? 'purple' : u.role === 'agency' ? 'teal' : u.role === 'freelance' ? 'amber' : 'blue'}>
                        {ROLE_LABELS_FR[u.role] ?? u.role}
                      </Badge>
                    </td>
                    <td className="py-2.5">
                      <StatusBadge status={u.isActive ? 'active' : 'closed'} />
                    </td>
                    <td className="py-2.5 text-slate-400">{new Date(u.createdAt).toLocaleDateString('fr-FR')}</td>
                    <td className="py-2.5">
                      <button
                        disabled={busyId === u._id}
                        onClick={() => handleToggleUser(u)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-lg disabled:opacity-40 ${u.isActive ? 'text-red-600 hover:bg-red-50' : 'text-emerald-600 hover:bg-emerald-50'}`}
                      >
                        {u.isActive ? 'Désactiver' : 'Réactiver'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Moderation queue */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <h2 className="font-bold text-slate-900">File de modération</h2>
          <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">{moderationCount}</span>
        </div>

        {isLoading ? (
          <Skeleton variant="list" count={2} />
        ) : (
          <div className="space-y-3">
            {pendingJobs.map(job => (
              <div key={job._id} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <Badge variant="blue">Offre</Badge>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900">{job.title}</p>
                  <p className="text-xs text-slate-500">{job.companyName}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button disabled={busyId === job._id} onClick={() => handleApproveJob(job)} className="flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg hover:bg-emerald-200 transition-colors disabled:opacity-40">
                    <CheckCircle className="w-3 h-3" /> Approuver
                  </button>
                  <button disabled={busyId === job._id} onClick={() => handleRejectJob(job)} className="flex items-center gap-1 text-xs font-medium text-red-600 bg-red-100 px-3 py-1.5 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-40">
                    <XCircle className="w-3 h-3" /> Rejeter
                  </button>
                </div>
              </div>
            ))}
            {pendingReports.map(report => {
              const job = typeof report.job === 'string' ? null : report.job
              return (
                <div key={report._id} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <Badge variant="amber">Signalement</Badge>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{job?.title ?? 'Offre'}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1"><Globe className="w-3 h-3" />{report.reason}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button disabled={busyId === report._id} onClick={() => handleReport(report, 'resolve')} className="flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg hover:bg-emerald-200 transition-colors disabled:opacity-40">
                      <CheckCircle className="w-3 h-3" /> Traiter
                    </button>
                    <button disabled={busyId === report._id} onClick={() => handleReport(report, 'dismiss')} className="flex items-center gap-1 text-xs font-medium text-red-600 bg-red-100 px-3 py-1.5 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-40">
                      <XCircle className="w-3 h-3" /> Rejeter
                    </button>
                  </div>
                </div>
              )
            })}

            {moderationCount === 0 && (
              <p className="text-xs text-slate-400 text-center py-4">Aucun élément en attente de modération.</p>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
