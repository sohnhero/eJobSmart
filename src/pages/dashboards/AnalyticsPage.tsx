import {
  TrendingUp, Users, Briefcase, CheckCircle,
  Calendar, Download, Filter, ArrowUpRight,
  PieChart as PieIcon, BarChart3, LineChart as LineIcon,
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import Button from '../../components/ui/Button'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'
import { revenueData, topSectors } from '../../data/stats'

const COLORS = ['#2563eb', '#7c3aed', '#f59e0b', '#10b981', '#ef4444']

const userDistribution = [
  { name: 'Candidats', value: 34219 },
  { name: 'Entreprises', value: 847 },
  { name: 'Cabinets RH', value: 124 },
  { name: 'Freelances', value: 1657 },
]

export default function AnalyticsPage() {
  return (
    <DashboardLayout role="admin" userName="Super Admin">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Analytique Plateforme</h1>
          <p className="text-slate-500 text-sm mt-0.5">Rapports détaillés et indicateurs de performance (KPIs)</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" leftIcon={<Calendar className="w-4 h-4" />}>Derniers 30 jours</Button>
          <Button size="sm" leftIcon={<Download className="w-4 h-4" />}>Exporter Rapport</Button>
        </div>
      </div>

      {/* High Level KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Inscriptions" value="1,243" subtitle="+12% vs mois préc." icon={Users} trend={12} iconBg="bg-blue-50" iconColor="text-blue-600" />
        <StatCard title="Publications" value="187" subtitle="Offres & Formations" icon={Briefcase} trend={8} iconBg="bg-purple-50" iconColor="text-purple-600" />
        <StatCard title="Placements" value="45" subtitle="Recrutements confirmés" icon={CheckCircle} trend={15} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
        <StatCard title="Revenu Total" value="18.7M" subtitle="FCFA · Brut" icon={TrendingUp} trend={23} iconBg="bg-amber-50" iconColor="text-amber-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Growth */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <LineIcon className="w-5 h-5 text-brand-600" /> Croissance des Revenus
            </h3>
            <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase">
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-brand-600" /> Abonnements</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-purple-500" /> Formations</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `${v / 1000000}M`} />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                formatter={(v: number) => [`${v.toLocaleString()} FCFA`, '']}
              />
              <Area type="monotone" dataKey="subscriptions" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              <Area type="monotone" dataKey="formations" stroke="#7c3aed" strokeWidth={3} fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* User Distribution */}
        <div className="card p-6">
          <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-brand-600" /> Répartition des Utilisateurs
          </h3>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 w-full h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userDistribution}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {userDistribution.map((entry, index) => (
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
                  <span className="text-xs font-bold text-slate-900">{item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Sectors Activity */}
        <div className="lg:col-span-2 card p-6">
          <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-brand-600" /> Volume par Secteur
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topSectors} layout="vertical" margin={{ left: 20 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} width={100} />
              <Tooltip 
                 cursor={{ fill: 'transparent' }}
                 contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="jobs" fill="#2563eb" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Actionable Insights */}
        <div className="card p-6 bg-slate-50 border-none">
          <h3 className="font-bold text-slate-900 mb-4">Analyses & Insights</h3>
          <div className="space-y-4">
            <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                <p className="text-xs font-bold text-slate-800">Croissance Tech</p>
              </div>
              <p className="text-[10px] text-slate-500">Le secteur numérique a progressé de 18% ce mois. Les besoins en développeurs React sont au plus haut.</p>
            </div>
            <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                <p className="text-xs font-bold text-slate-800">Optimisation Revenus</p>
              </div>
              <p className="text-[10px] text-slate-500">Les abonnements "Elite" représentent 40% du CA mais seulement 5% des clients. Potentiel d'upsell sur le segment Pro.</p>
            </div>
            <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                <p className="text-xs font-bold text-slate-800">Rétention Apprenants</p>
              </div>
              <p className="text-[10px] text-slate-500">85% des apprenants qui terminent un module s'inscrivent à un second dans les 15 jours.</p>
            </div>
          </div>
          <Button fullWidth variant="secondary" className="mt-6" size="sm" rightIcon={<ArrowUpRight className="w-4 h-4" />}>Rapport détaillé IA</Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
