import {
  CreditCard, TrendingUp, DollarSign, Users,
  ArrowUpRight, ArrowDownRight, Download,
  Search, Filter, Plus, Edit3, Trash2,
  CheckCircle, Globe, Briefcase,
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import StatCard from '../../components/ui/StatCard'
import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts'

const revenueData = [
  { month: 'Nov', revenue: 8.2, subscriptions: 5.4, boosts: 2.8 },
  { month: 'Déc', revenue: 9.8, subscriptions: 6.2, boosts: 3.6 },
  { month: 'Jan', revenue: 10.5, subscriptions: 7.1, boosts: 3.4 },
  { month: 'Fév', revenue: 11.2, subscriptions: 7.8, boosts: 3.4 },
  { month: 'Mar', revenue: 13.5, subscriptions: 8.5, boosts: 5.0 },
  { month: 'Avr', revenue: 15.8, subscriptions: 9.2, boosts: 6.6 },
]

const recentTransactions = [
  { id: 'TRX-9821', client: 'Sonatel Digital', plan: 'Entreprise Pro', amount: '120,000 FCFA', date: '2026-04-28', status: 'Succès' },
  { id: 'TRX-9820', client: 'Moussa Sene', plan: 'Formation React', amount: '45,000 FCFA', date: '2026-04-27', status: 'Succès' },
  { id: 'TRX-9819', client: 'Cabinet Excellence', plan: 'Cabinet Avancé', amount: '85,000 FCFA', date: '2026-04-27', status: 'Echoué' },
  { id: 'TRX-9818', client: 'Orange SN', plan: 'Entreprise Elite', amount: '250,000 FCFA', date: '2026-04-26', status: 'Succès' },
]

export default function AdminBilling() {
  return (
    <DashboardLayout role="admin" userName="Super Admin">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Revenus & Plans d'Abonnement</h1>
          <p className="text-slate-500 text-sm mt-0.5">Suivi financier global et gestion des offres commerciales</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" leftIcon={<Download className="w-4 h-4" />}>Exporter Rapport</Button>
          <Button size="sm" leftIcon={<Plus className="w-4 h-4" />}>Nouveau Plan</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Revenu total (Mois)" value="15.8M FCFA" icon={DollarSign} trend={24} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
        <StatCard title="Abonnements actifs" value="1,284" icon={Users} trend={12} iconBg="bg-blue-50" iconColor="text-blue-600" />
        <StatCard title="Ventes de Boosts" value="456" icon={TrendingUp} trend={8} iconBg="bg-purple-50" iconColor="text-purple-600" />
        <StatCard title="Taux de Churn" value="2.4%" icon={ArrowDownRight} trend={-1} iconBg="bg-red-50" iconColor="text-red-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-900">Évolution du Chiffre d'Affaires (Millions FCFA)</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-brand-600" />
                <span className="text-[10px] font-bold text-slate-400 uppercase">Abonnements</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-brand-300" />
                <span className="text-[10px] font-bold text-slate-400 uppercase">Boosts</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              <Area type="monotone" dataKey="subscriptions" stackId="1" stroke="#2563eb" strokeWidth={3} fill="url(#colorRev)" />
              <Area type="monotone" dataKey="boosts" stackId="1" stroke="#93c5fd" strokeWidth={3} fill="#93c5fd" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Plan Distribution */}
        <div className="card p-6">
          <h3 className="font-bold text-slate-900 mb-6 text-sm">Distribution des plans</h3>
          <div className="space-y-6">
            {[
              { label: 'Entreprise Pro', count: 450, color: 'bg-brand-600', percent: 65 },
              { label: 'Cabinet Avancé', count: 180, color: 'bg-purple-600', percent: 25 },
              { label: 'Indépendant Premium', count: 70, color: 'bg-amber-500', percent: 10 },
            ].map(plan => (
              <div key={plan.label}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-700">{plan.label}</span>
                  <span className="text-xs font-black text-slate-900">{plan.count}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${plan.color} rounded-full`} style={{ width: `${plan.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-8 border-t border-slate-100">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-4">Méthodes de paiement</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-[10px] text-slate-500">Orange Money</p>
                <p className="font-bold text-slate-900">42%</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-[10px] text-slate-500">Wave</p>
                <p className="font-bold text-slate-900">38%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <h3 className="font-bold text-slate-900">Transactions récentes</h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Rechercher..." className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none" />
            </div>
            <Button variant="ghost" size="sm" leftIcon={<Filter className="w-4 h-4" />}>Filtrer</Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Transaction</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Produit/Plan</th>
                <th className="px-6 py-4">Montant</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentTransactions.map(trx => (
                <tr key={trx.id} className="hover:bg-slate-50/50 transition-colors group text-sm">
                  <td className="px-6 py-4 font-bold text-slate-700">{trx.id}</td>
                  <td className="px-6 py-4 text-slate-600">{trx.client}</td>
                  <td className="px-6 py-4 text-slate-500">{trx.plan}</td>
                  <td className="px-6 py-4 font-black text-slate-900">{trx.amount}</td>
                  <td className="px-6 py-4 text-slate-400 text-xs">{new Date(trx.date).toLocaleDateString('fr-FR')}</td>
                  <td className="px-6 py-4">
                    <Badge variant={trx.status === 'Succès' ? 'green' : 'red'} size="sm" dot>
                      {trx.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-brand-600"><Download className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
