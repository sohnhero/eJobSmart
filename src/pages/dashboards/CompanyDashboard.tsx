import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Briefcase, Users, TrendingUp, Clock, Plus, ChevronRight,
  MoreVertical, Star, MessageSquare, Calendar, CheckCircle,
  XCircle, Eye, Filter, Zap, List, LayoutGrid, Sparkles,
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import Badge, { ContractBadge, StatusBadge } from '../../components/ui/Badge'
import MatchScore from '../../components/ui/MatchScore'
import Button from '../../components/ui/Button'
import Avatar from '../../components/ui/Avatar'
import { dashboardStats, applicationsData } from '../../data/stats'
import { jobs } from '../../data/jobs'
import { candidates } from '../../data/candidates'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const kanbanColumns = [
  { id: 'received', label: 'Reçues', color: 'bg-slate-100', count: 47 },
  { id: 'review', label: 'En examen', color: 'bg-amber-50', count: 23 },
  { id: 'shortlisted', label: 'Présélectionnées', color: 'bg-blue-50', count: 12 },
  { id: 'interview', label: 'Entretien', color: 'bg-purple-50', count: 7 },
  { id: 'offer', label: 'Offre émise', color: 'bg-emerald-50', count: 3 },
]

const kanbanCards: Record<string, Array<{id: number; name: string; role: string; score: number; stars: number}>> = {
  received: [
    { id: 1, name: 'Oumar Seck', role: 'Dev Frontend React', score: 87, stars: 0 },
    { id: 2, name: 'Binta Diallo', role: 'UX Designer', score: 92, stars: 0 },
    { id: 3, name: 'Cheikh Tall', role: 'Dev Backend Node', score: 79, stars: 0 },
  ],
  review: [
    { id: 4, name: 'Fatou Ba', role: 'Data Engineer', score: 94, stars: 4 },
    { id: 5, name: 'Ibou Ndiaye', role: 'DevOps Engineer', score: 88, stars: 3 },
  ],
  shortlisted: [
    { id: 6, name: 'Aissa Koné', role: 'Full Stack Senior', score: 96, stars: 5 },
    { id: 7, name: 'Modou Fall', role: 'Tech Lead', score: 91, stars: 4 },
  ],
  interview: [
    { id: 8, name: 'Mame Diop', role: 'CTO', score: 89, stars: 5 },
  ],
  offer: [
    { id: 9, name: 'Seydou Barry', role: 'Architect Cloud', score: 95, stars: 5 },
  ],
}

export default function CompanyDashboard() {
  const navigate = useNavigate()
  const stats = dashboardStats.company
  const activeJobs = jobs.slice(0, 5)
  const [activeJobTab, setActiveJobTab] = useState<'kanban' | 'list'>('kanban')

  return (
    <DashboardLayout role="company" userName="Sonatel Digital" userTitle="Compte Entreprise">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Tableau de bord</h1>
          <p className="text-slate-500 text-sm mt-0.5 flex items-center gap-1.5">
            Bienvenue, Sonatel Digital · Compte Premium <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </p>
        </div>
        <Button onClick={() => navigate('/dashboard/company/jobs/new')} leftIcon={<Plus className="w-4 h-4" />}>
          Publier une offre
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Offres actives" value={stats.activeJobs} icon={Briefcase} trend={33} trendLabel="ce mois" iconBg="bg-brand-50" iconColor="text-brand-600" />
        <StatCard title="Candidatures" value={stats.totalApplications} icon={Users} trend={18} trendLabel="ce mois" iconBg="bg-purple-50" iconColor="text-purple-600" />
        <StatCard title="Nouvelles" value={stats.newApplications} subtitle="Pas encore examinées" icon={Clock} iconBg="bg-amber-50" iconColor="text-amber-600" />
        <StatCard title="Score moyen" value={`${stats.avgMatchScore}%`} subtitle="Taux de matching" icon={TrendingUp} trend={5} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Chart */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900">Activité des candidatures</h2>
            <select className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 text-slate-600">
              <option>4 dernières semaines</option>
              <option>3 derniers mois</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={applicationsData} barSize={14}>
              <XAxis dataKey="week" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Bar dataKey="received" fill="#bfdbfe" radius={[4, 4, 0, 0]} name="Reçues" />
              <Bar dataKey="shortlisted" fill="#2563eb" radius={[4, 4, 0, 0]} name="Présélectionnées" />
              <Bar dataKey="interviews" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Entretiens" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick stats */}
        <div className="space-y-3">
          <div className="card p-4">
            <p className="text-xs text-slate-400 mb-1">Taux de conversion</p>
            <p className="text-2xl font-black text-slate-900">{stats.conversionRate}%</p>
            <p className="text-xs text-slate-500">Candidatures → Embauches</p>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${stats.conversionRate}%` }} />
            </div>
          </div>
          <div className="card p-4">
            <p className="text-xs text-slate-400 mb-1">Délai moyen de traitement</p>
            <p className="text-2xl font-black text-slate-900">{stats.timeToFill}j</p>
            <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">-6j vs mois précédent <TrendingUp className="w-3 h-3 rotate-180" /></p>
          </div>
          <div className="card p-4">
            <p className="text-xs text-slate-400 mb-1">Entretiens planifiés</p>
            <p className="text-2xl font-black text-slate-900">{stats.interviewsScheduled}</p>
            <p className="text-xs text-slate-500">Cette semaine</p>
          </div>
        </div>
      </div>

      {/* Kanban */}
      <div className="card p-5 mb-6 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="font-bold text-slate-900">Pipeline de recrutement</h2>
            <select className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-600">
              <option>Développeur Full Stack Senior</option>
              <option>Data Scientist</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" leftIcon={<Filter className="w-3.5 h-3.5" />}>Filtrer</Button>
            <div className="flex gap-1">
              <button onClick={() => setActiveJobTab('kanban')}
                className={`p-1.5 rounded-lg transition-colors ${activeJobTab === 'kanban' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button onClick={() => setActiveJobTab('list')}
                className={`p-1.5 rounded-lg transition-colors ${activeJobTab === 'list' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {activeJobTab === 'kanban' ? (
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {kanbanColumns.map(col => (
              <div key={col.id} className="flex-shrink-0 w-56">
                <div className={`${col.color} rounded-2xl p-3`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-700">{col.label}</span>
                    <span className="text-xs bg-white text-slate-600 px-2 py-0.5 rounded-full font-bold shadow-sm">{col.count}</span>
                  </div>
                  <div className="space-y-2">
                    {(kanbanCards[col.id] || []).map(card => (
                      <div key={card.id} className="kanban-card group">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Avatar name={card.name} size="xs" />
                            <div>
                              <p className="text-xs font-semibold text-slate-800 leading-none">{card.name}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5 leading-none">{card.role}</p>
                            </div>
                          </div>
                          <MatchScore score={card.score} size="sm" showLabel={false} />
                        </div>
                        {card.stars > 0 && (
                          <div className="flex items-center gap-0.5 mb-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`w-2.5 h-2.5 ${i < card.stars ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                            ))}
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="flex-1 text-[10px] font-medium py-1 bg-slate-100 hover:bg-brand-100 hover:text-brand-700 rounded-lg transition-colors flex items-center justify-center gap-1">
                            <Eye className="w-2.5 h-2.5" /> Voir
                          </button>
                          <button className="flex-1 text-[10px] font-medium py-1 bg-slate-100 hover:bg-emerald-100 hover:text-emerald-700 rounded-lg transition-colors flex items-center justify-center gap-1">
                            <CheckCircle className="w-2.5 h-2.5" /> OK
                          </button>
                          <button className="flex-1 text-[10px] font-medium py-1 bg-slate-100 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors flex items-center justify-center gap-1">
                            <XCircle className="w-2.5 h-2.5" /> Non
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {Object.values(kanbanCards).flat().map(card => (
              <div key={card.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors">
                <Avatar name={card.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900">{card.name}</p>
                  <p className="text-xs text-slate-500">{card.role}</p>
                </div>
                <MatchScore score={card.score} size="sm" />
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: card.stars }).map((_, i) => <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />)}
                </div>
                <div className="flex items-center gap-1.5">
                  <button className="p-1.5 hover:bg-blue-100 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"><MessageSquare className="w-3.5 h-3.5" /></button>
                  <button className="p-1.5 hover:bg-purple-100 rounded-lg text-slate-400 hover:text-purple-600 transition-colors"><Calendar className="w-3.5 h-3.5" /></button>
                  <button className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 transition-colors"><MoreVertical className="w-3.5 h-3.5" /></button>
                </div>
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
            <Button size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>Nouvelle offre</Button>
          </div>
          <div className="space-y-3">
            {activeJobs.map(job => (
              <div key={job.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group border border-slate-100">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900 group-hover:text-brand-600 transition-colors truncate">{job.title}</p>
                    {job.isBoosted && <Zap className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <ContractBadge type={job.contractType} />
                    <span className="text-xs text-slate-400 flex items-center gap-1"><Users className="w-3 h-3" />{job.applicants} candidats</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-slate-400">Expire</p>
                  <p className="text-xs font-semibold text-slate-700">
                    {new Date(job.expiresAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Suggested profiles from CV database */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900">Profils suggérés</h2>
            <span className="text-xs text-slate-400">Base CV propriétaire</span>
          </div>
          <div className="space-y-3">
            {candidates.slice(0, 4).map(c => (
              <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer border border-slate-100 group">
                <Avatar name={`${c.firstName} ${c.lastName}`} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 group-hover:text-brand-600 transition-colors">{c.firstName} {c.lastName}</p>
                  <p className="text-xs text-slate-500 truncate">{c.headline}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusBadge status={c.status} />
                    <span className="text-xs text-slate-400">{c.experienceYears} ans exp.</span>
                  </div>
                </div>
                <MatchScore score={c.matchScore || 80} size="sm" />
              </div>
            ))}
          </div>
          <button className="mt-3 w-full text-xs text-brand-600 font-medium flex items-center justify-center gap-1 hover:text-brand-800">
            Voir toute la base CV <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}
