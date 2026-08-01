import { useEffect, useState } from 'react'
import {
  TrendingUp, Users, Briefcase, CheckCircle,
  PieChart as PieIcon, BarChart3,
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import {
  BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'
import { adminService } from '../../lib/services/admin'
import type { AdminDashboardOverview } from '../../lib/types'

const COLORS = ['#2563eb', '#7c3aed', '#f59e0b', '#10b981', '#ef4444', '#0891b2', '#64748b']
const ROLE_LABELS_FR: Record<string, string> = {
  candidate: 'Candidats', freelance: 'Freelances', company: 'Entreprises', agency: 'Cabinets RH', admin_rh: 'Admin RH', super_admin: 'Super Admin', trainer: 'Formateurs',
}

export default function AnalyticsPage() {
  const [overview, setOverview] = useState<AdminDashboardOverview | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminService.dashboardOverview().then(setOverview).catch(() => setOverview(null)).finally(() => setLoading(false))
  }, [])

  const totalUsers = overview ? Object.values(overview.usersByRole).reduce((a, b) => a + b, 0) : 0
  const accepted = overview?.applicationsByStatus['Acceptée'] ?? 0
  const userDistribution = overview ? Object.entries(overview.usersByRole).map(([role, value]) => ({ name: ROLE_LABELS_FR[role] ?? role, value })) : []
  const statusDistribution = overview ? Object.entries(overview.applicationsByStatus).map(([status, count]) => ({ status, count })) : []

  return (
    <DashboardLayout role="admin">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Analytique Plateforme</h1>
          <p className="text-slate-500 text-sm mt-0.5">Indicateurs de performance globaux de la plateforme</p>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-slate-400 text-center py-16">Chargement…</p>
      ) : (
        <>
          {/* High Level KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard title="Utilisateurs" value={totalUsers.toLocaleString('fr-FR')} icon={Users} iconBg="bg-blue-50" iconColor="text-blue-600" />
            <StatCard title="Offres publiées" value={(overview?.totalJobs ?? 0).toLocaleString('fr-FR')} icon={Briefcase} iconBg="bg-purple-50" iconColor="text-purple-600" />
            <StatCard title="Placements" value={accepted.toLocaleString('fr-FR')} subtitle="Candidatures acceptées" icon={CheckCircle} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
            <StatCard title="Taux de conversion" value={`${overview?.conversionRate ?? 0}%`} subtitle="Candidatures / offre" icon={TrendingUp} iconBg="bg-amber-50" iconColor="text-amber-600" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Applications by status */}
            <div className="card p-6">
              <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-brand-600" /> Candidatures par statut
              </h3>
              {statusDistribution.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-12">Aucune candidature</p>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={statusDistribution}>
                    <XAxis dataKey="status" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={60} />
                    <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* User Distribution */}
            <div className="card p-6">
              <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                <PieIcon className="w-5 h-5 text-brand-600" /> Répartition des Utilisateurs
              </h3>
              {userDistribution.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-12">Aucune donnée</p>
              ) : (
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1 w-full h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={userDistribution} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                          {userDistribution.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-4 min-w-[150px]">
                    {userDistribution.map((item, i) => (
                      <div key={item.name} className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                          <span className="text-xs text-slate-500">{item.name}</span>
                        </div>
                        <span className="text-xs font-bold text-slate-900">{item.value.toLocaleString('fr-FR')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Top Sectors Activity */}
          <div className="card p-6">
            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-brand-600" /> Volume d'offres par Secteur
            </h3>
            {(overview?.topSectors.length ?? 0) === 0 ? (
              <p className="text-sm text-slate-400 text-center py-12">Aucune donnée</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={overview!.topSectors} layout="vertical" margin={{ left: 20 }}>
                  <XAxis type="number" hide allowDecimals={false} />
                  <YAxis dataKey="sector" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} width={140} />
                  <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="count" fill="#2563eb" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </>
      )}
    </DashboardLayout>
  )
}
