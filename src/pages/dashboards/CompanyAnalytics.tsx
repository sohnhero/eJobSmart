import {
  BarChart3, TrendingUp, Users, Eye,
  ArrowUpRight, Download, Calendar,
  PieChart as PieIcon, LineChart as LineIcon,
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import Button from '../../components/ui/Button'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'
import { applicationsData } from '../../data/stats'

const COLORS = ['#2563eb', '#7c3aed', '#f59e0b', '#10b981']

const sourceDistribution = [
  { name: 'Plateforme eJobSmart', value: 65 },
  { name: 'LinkedIn', value: 20 },
  { name: 'Réseaux Sociaux', value: 10 },
  { name: 'Recommandation', value: 5 },
]

export default function CompanyAnalytics() {
  return (
    <DashboardLayout role="company" userName="Sonatel Digital">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Statistiques de recrutement</h1>
          <p className="text-slate-500 text-sm mt-0.5">Analysez les performances de vos offres et de votre marque employeur</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" leftIcon={<Calendar className="w-4 h-4" />}>Derniers 30 jours</Button>
          <Button size="sm" leftIcon={<Download className="w-4 h-4" />}>Exporter CSV</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Vues totales" value="4,829" icon={Eye} trend={12} iconBg="bg-blue-50" iconColor="text-blue-600" />
        <StatCard title="Candidatures" value="247" icon={Users} trend={18} iconBg="bg-purple-50" iconColor="text-purple-600" />
        <StatCard title="Taux de conversion" value="5.1%" icon={TrendingUp} trend={2} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
        <StatCard title="Temps de recrutement" value="24j" icon={BarChart3} trend={-6} iconBg="bg-amber-50" iconColor="text-amber-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Application Volume */}
        <div className="card p-6">
          <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
            <LineIcon className="w-5 h-5 text-brand-600" /> Évolution des candidatures
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={applicationsData}>
              <defs>
                <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Area type="monotone" dataKey="received" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorApp)" name="Reçues" />
              <Area type="monotone" dataKey="shortlisted" stroke="#7c3aed" strokeWidth={3} fill="none" name="Présélectionnées" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Source Distribution */}
        <div className="card p-6">
          <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-brand-600" /> Sources des candidats (%)
          </h3>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 w-full h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceDistribution}
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {sourceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 min-w-[180px]">
              {sourceDistribution.map((item, i) => (
                <div key={item.name} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{item.name}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
