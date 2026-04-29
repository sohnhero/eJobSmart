import {
  Users, Briefcase, TrendingUp, Search,
  CheckCircle, Clock, AlertCircle, Plus,
  BarChart3, MessageSquare, ExternalLink,
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'

export default function AgencyDashboard() {
  const stats = [
    { title: 'Ressources actives', value: '42', icon: Users, iconColor: 'text-emerald-600', trend: 12, trendLabel: 'ce mois' },
    { title: 'Placements réussis', value: '18', icon: CheckCircle, iconColor: 'text-brand-600', trend: 85, trendLabel: 'taux' },
    { title: 'Offres en cours', value: '7', icon: Briefcase, iconColor: 'text-purple-600' },
    { title: 'Candidatures reçues', value: '156', icon: TrendingUp, iconColor: 'text-blue-600' },
  ]

  const recentResources = [
    { id: 1, name: 'Bamba Diop', role: 'Ingénieur DevOps', exp: '8 ans', status: 'Placé', company: 'Sonatel' },
    { id: 2, name: 'Safiétou Kane', role: 'UX Designer', exp: '4 ans', status: 'Disponible', company: '-' },
    { id: 3, name: 'Ibrahima Ndiaye', role: 'Chef de Projet', exp: '12 ans', status: 'En entretien', company: 'Ecobank' },
  ]

  return (
    <DashboardLayout role="agency" userName="Cabinet Excellence RH">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Cabinet Excellence RH</h1>
          <p className="text-slate-500 text-sm mt-0.5">Gestion de votre portefeuille de talents et placements</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" leftIcon={<Search className="w-4 h-4" />}>Trouver des offres</Button>
          <Button size="sm" leftIcon={<Plus className="w-4 h-4" />}>Ajouter une ressource</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(stat => <StatCard key={stat.title} {...stat} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main: Resources */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-900">Portefeuille RH récent</h2>
              <button className="text-xs font-semibold text-brand-600 hover:text-brand-800 transition-colors">Tout voir</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Candidat</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rôle & Exp</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentResources.map(res => (
                    <tr key={res.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-800 text-sm">{res.name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-600">{res.role}</p>
                        <p className="text-[10px] text-slate-400">{res.exp}</p>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={res.status === 'Disponible' ? 'green' : res.status === 'Placé' ? 'slate' : 'amber'}>
                          {res.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <button className="p-2 text-slate-400 hover:text-brand-600 transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card p-6 bg-gradient-to-br from-emerald-600 to-emerald-800 text-white">
            <h3 className="text-lg font-bold mb-2 text-white">Prêt à placer de nouveaux talents ?</h3>
            <p className="text-emerald-100 text-sm mb-4">Parcourez les offres d'entreprises qui recherchent des ressources externes ou de l'intérim.</p>
            <Button variant="white" size="sm">Consulter les appels d'offres</Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card p-5">
            <h3 className="font-bold text-slate-900 mb-4 text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-600" /> Performance du Cabinet
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Taux de placement</span>
                <span className="text-sm font-bold text-slate-900">72%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div className="bg-emerald-500 h-full rounded-full w-[72%]" />
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-500">Satisfaction entreprises</span>
                <span className="text-sm font-bold text-slate-900">4.8/5</span>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-bold text-slate-900 mb-4 text-sm">Prochains Entretiens</h3>
            <div className="space-y-4">
              {[
                { time: '14:30', candidate: 'Fatou Ndiaye', client: 'Wave' },
                { time: 'Demain', candidate: 'Moussa Sall', client: 'BCEAO' },
              ].map((ent, i) => (
                <div key={i} className="flex items-start gap-3 pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-[10px] font-bold text-slate-500 flex-shrink-0">
                    {ent.time}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{ent.candidate}</p>
                    <p className="text-[10px] text-slate-400">vs {ent.client}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
