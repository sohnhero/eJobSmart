import { useEffect, useMemo, useState } from 'react'
import {
  BarChart3, TrendingUp, Users, Briefcase,
  PieChart as PieIcon, LineChart as LineIcon,
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'
import { jobsService } from '../../lib/services/jobs'
import { applicationsService } from '../../lib/services/applications'
import type { Application, Job } from '../../lib/types'

const COLORS = ['#2563eb', '#7c3aed', '#f59e0b', '#10b981', '#ef4444', '#0891b2', '#64748b', '#db2777', '#16a34a']

function isoWeekLabel(date: Date): string {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - d.getDay() + 1)
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

export default function CompanyAnalytics() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    jobsService.mine().then(async (myJobs) => {
      setJobs(myJobs)
      const perJob = await Promise.all(myJobs.map(job => applicationsService.forJob(job._id).then(res => res.items).catch(() => [] as Application[])))
      setApplications(perJob.flat())
    }).finally(() => setLoading(false))
  }, [])

  const activeJobs = jobs.filter(j => j.status === 'active').length
  const decided = applications.filter(a => ['Acceptée', 'Refusée'].includes(a.status))
  const conversionRate = decided.length > 0 ? Math.round((decided.filter(a => a.status === 'Acceptée').length / decided.length) * 1000) / 10 : 0

  const weeklyVolume = useMemo(() => {
    const buckets = new Map<string, number>()
    const now = new Date()
    for (let i = 7; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i * 7)
      buckets.set(isoWeekLabel(d), 0)
    }
    applications.forEach(app => {
      const label = isoWeekLabel(new Date(app.createdAt))
      if (buckets.has(label)) buckets.set(label, (buckets.get(label) ?? 0) + 1)
    })
    return Array.from(buckets.entries()).map(([week, count]) => ({ week, count }))
  }, [applications])

  const statusDistribution = useMemo(() => {
    const counts: Record<string, number> = {}
    applications.forEach(a => { counts[a.status] = (counts[a.status] ?? 0) + 1 })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [applications])

  return (
    <DashboardLayout role="company">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Statistiques de recrutement</h1>
          <p className="text-slate-500 text-sm mt-0.5">Analysez les performances de vos offres</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Offres actives" value={activeJobs} icon={Briefcase} iconBg="bg-blue-50" iconColor="text-blue-600" />
        <StatCard title="Candidatures" value={applications.length} icon={Users} iconBg="bg-purple-50" iconColor="text-purple-600" />
        <StatCard title="Taux de conversion" value={`${conversionRate}%`} icon={TrendingUp} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
        <StatCard title="Offres publiées" value={jobs.length} icon={BarChart3} iconBg="bg-amber-50" iconColor="text-amber-600" />
      </div>

      {loading ? (
        <p className="text-sm text-slate-400 text-center py-16">Chargement…</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Application Volume */}
          <div className="card p-6">
            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
              <LineIcon className="w-5 h-5 text-brand-600" /> Évolution des candidatures (8 dernières semaines)
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={weeklyVolume}>
                <defs>
                  <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorApp)" name="Candidatures" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Status Distribution */}
          <div className="card p-6">
            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-brand-600" /> Répartition par statut
            </h3>
            {statusDistribution.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-12">Aucune candidature pour le moment</p>
            ) : (
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 w-full h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={statusDistribution} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                        {statusDistribution.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3 min-w-[180px]">
                  {statusDistribution.map((item, i) => (
                    <div key={item.name} className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{item.name}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-900">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
