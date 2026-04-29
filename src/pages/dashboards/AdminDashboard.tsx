import {
  Users, Briefcase, TrendingUp, DollarSign, AlertTriangle,
  CheckCircle, XCircle, Eye, MoreVertical, UserCheck, BookOpen,
  Building2, Globe, ShieldCheck,
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import Badge, { StatusBadge } from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import { dashboardStats, revenueData, topSectors } from '../../data/stats'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const recentUsers = [
  { id: 1, name: 'Mamadou Kouyaté', email: 'mkouyate@gmail.com', role: 'Candidat', status: 'Vérifié', date: '2026-04-28', country: '🇸🇳' },
  { id: 2, name: 'GIZ Sénégal', email: 'rh@giz.sn', role: 'Entreprise', status: 'En attente', date: '2026-04-28', country: '🇸🇳' },
  { id: 3, name: 'Fatou Jallow', email: 'fjallow@freelance.gm', role: 'Freelance', status: 'Vérifié', date: '2026-04-27', country: '🇬🇲' },
  { id: 4, name: 'Cabinet Talent+', email: 'contact@talentplus.ci', role: 'Cabinet RH', status: 'Vérifié', date: '2026-04-27', country: '🇨🇮' },
  { id: 5, name: 'Boubacar Diallo', email: 'bdiallo@dev.sn', role: 'Candidat', status: 'Inactif', date: '2026-04-26', country: '🇸🇳' },
]

const pendingModeration = [
  { id: 1, type: 'Offre', title: 'Ingénieur Sécurité SI', company: 'AXA Assurances', submittedAt: 'Il y a 2h' },
  { id: 2, type: 'Avis', title: 'Commentaire formation #34', company: 'Utilisateur anonyme', submittedAt: 'Il y a 4h' },
  { id: 3, type: 'Profil', title: 'Vérification Cabinet Alpha RH', company: 'Cabinet Alpha RH', submittedAt: 'Il y a 6h' },
]

export default function AdminDashboard() {
  const stats = dashboardStats.admin

  return (
    <DashboardLayout role="admin" userName="Super Admin" userTitle="Administrateur">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Administration</h1>
          <p className="text-sm text-slate-500 mt-0.5">Vue globale de la plateforme eJobSmart · 28 Avril 2026</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-xl border border-emerald-200">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-semibold text-emerald-700">Plateforme opérationnelle</span>
          </div>
        </div>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Utilisateurs totaux" value={stats.totalUsers.toLocaleString('fr-FR')} subtitle={`+${stats.newUsersThisMonth.toLocaleString()} ce mois`} icon={Users} trend={14} trendLabel="vs mois préc." iconBg="bg-brand-50" iconColor="text-brand-600" />
        <StatCard title="Offres publiées" value={stats.totalJobs.toLocaleString('fr-FR')} subtitle={`+${stats.newJobsThisWeek} cette semaine`} icon={Briefcase} trend={8} iconBg="bg-purple-50" iconColor="text-purple-600" />
        <StatCard title="Revenus (Avr.)" value={`${(stats.revenue / 1000000).toFixed(1)}M FCFA`} icon={DollarSign} trend={stats.revenueGrowth} trendLabel="vs mars" iconBg="bg-emerald-50" iconColor="text-emerald-600" />
        <StatCard title="En modération" value={stats.pendingModeration} subtitle="Éléments à traiter" icon={AlertTriangle} iconBg="bg-amber-50" iconColor="text-amber-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue chart */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900">Revenus mensuels</h2>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-brand-600 inline-block" />Abonnements</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500 inline-block" />Formations</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />Boosts</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorSubs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000000).toFixed(0)}M`} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: 11 }}
                formatter={(v: number) => `${v.toLocaleString('fr-FR')} FCFA`} />
              <Area type="monotone" dataKey="subscriptions" stroke="#2563eb" strokeWidth={2} fill="url(#colorSubs)" name="Abonnements" />
              <Area type="monotone" dataKey="formations" stroke="#7c3aed" strokeWidth={2} fill="none" name="Formations" />
              <Area type="monotone" dataKey="boosts" stroke="#f59e0b" strokeWidth={2} fill="none" name="Boosts" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top sectors */}
        <div className="card p-5">
          <h2 className="font-bold text-slate-900 mb-4">Top secteurs</h2>
          <div className="space-y-3">
            {topSectors.map((s, i) => (
              <div key={s.name} className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-400 w-4">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-semibold text-slate-700 truncate">{s.name}</p>
                    <span className="text-xs text-slate-500">{s.jobs}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="bg-brand-600 h-full rounded-full" style={{ width: `${(s.jobs / 342) * 100}%` }} />
                  </div>
                </div>
                <span className={`text-xs font-bold ${s.growth > 15 ? 'text-emerald-600' : 'text-slate-500'}`}>+{s.growth}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Platform health */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <h2 className="font-bold text-slate-900">Santé plateforme</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: 'API Gateway', value: '99.8%', status: 'ok' },
              { label: 'Base de données', value: '99.9%', status: 'ok' },
              { label: 'Moteur de recherche', value: '98.2%', status: 'ok' },
              { label: 'Passerelle SMS', value: '94.1%', status: 'warn' },
              { label: 'Service emails', value: '99.6%', status: 'ok' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${item.status === 'ok' ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
                  <span className="text-sm text-slate-700">{item.label}</span>
                </div>
                <span className={`text-xs font-bold ${item.status === 'ok' ? 'text-emerald-600' : 'text-amber-600'}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent users */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900">Nouveaux utilisateurs</h2>
            <button className="text-xs text-brand-600 font-medium">Voir tous</button>
          </div>
          <div className="overflow-x-auto">
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
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        <Avatar name={u.name} size="xs" />
                        <div>
                          <p className="font-semibold text-slate-800">{u.country} {u.name}</p>
                          <p className="text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5">
                      <Badge variant={u.role === 'Entreprise' ? 'purple' : u.role === 'Cabinet RH' ? 'teal' : u.role === 'Freelance' ? 'amber' : 'blue'}>
                        {u.role}
                      </Badge>
                    </td>
                    <td className="py-2.5">
                      <StatusBadge status={u.status} />
                    </td>
                    <td className="py-2.5 text-slate-400">{new Date(u.date).toLocaleDateString('fr-FR')}</td>
                    <td className="py-2.5">
                      <div className="flex items-center gap-1">
                        <button className="p-1 hover:bg-slate-100 rounded text-slate-400"><Eye className="w-3 h-3" /></button>
                        {u.status === 'En attente' && (
                          <>
                            <button className="p-1 hover:bg-emerald-100 rounded text-emerald-600"><CheckCircle className="w-3 h-3" /></button>
                            <button className="p-1 hover:bg-red-100 rounded text-red-500"><XCircle className="w-3 h-3" /></button>
                          </>
                        )}
                        <button className="p-1 hover:bg-slate-100 rounded text-slate-400"><MoreVertical className="w-3 h-3" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Moderation queue */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h2 className="font-bold text-slate-900">File de modération</h2>
            <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">{stats.pendingModeration}</span>
          </div>
          <button className="text-xs text-brand-600 font-medium">Voir tout</button>
        </div>
        <div className="space-y-3">
          {pendingModeration.map(item => (
            <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <Badge variant={item.type === 'Offre' ? 'blue' : item.type === 'Avis' ? 'amber' : 'purple'}>{item.type}</Badge>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                <p className="text-xs text-slate-500">{item.company} · {item.submittedAt}</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg hover:bg-emerald-200 transition-colors">
                  <CheckCircle className="w-3 h-3" /> Approuver
                </button>
                <button className="flex items-center gap-1 text-xs font-medium text-red-600 bg-red-100 px-3 py-1.5 rounded-lg hover:bg-red-200 transition-colors">
                  <XCircle className="w-3 h-3" /> Rejeter
                </button>
                <button className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400"><Eye className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
