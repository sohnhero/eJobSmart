import {
  LayoutDashboard, UserCheck, Users, Briefcase,
  BookOpen, MessageSquare, TrendingUp, Search,
  Plus, Upload, Filter, ExternalLink, Star,
  CheckCircle, Clock,
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'

export default function AdminRhDashboard() {
  const stats = [
    { label: 'Talents au vivier', value: '12,450', icon: UserCheck, color: 'text-amber-600', trend: '+124 ce mois' },
    { label: 'Candidats actifs', value: '3,842', icon: Users, color: 'text-blue-600' },
    { label: 'Offres à modérer', value: '18', icon: Briefcase, color: 'text-purple-600', trend: 'Priorité haute' },
    { label: 'Formations actives', value: '45', icon: BookOpen, color: 'text-emerald-600' },
  ]

  const talentHighlights = [
    { id: 1, name: 'Aminata Sow', role: 'Expert Finance', score: 98, status: 'Disponible' },
    { id: 2, name: 'Jean-Pierre Gomis', role: 'Ingénieur BTP', score: 95, status: 'En poste' },
    { id: 3, name: 'Samba Diouf', role: 'Architecte Cloud', score: 92, status: 'Disponible' },
  ]

  return (
    <DashboardLayout role="admin-rh" userName="Admin RH eJobSmart">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Gestion Interne RH</h1>
          <p className="text-slate-500 text-sm mt-0.5">Administration du vivier de talents et modération plateforme</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" leftIcon={<Upload className="w-4 h-4" />}>Import CV Masse</Button>
          <Button size="sm" leftIcon={<Plus className="w-4 h-4" />}>Ajouter Talent</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(stat => <StatCard key={stat.label} {...stat} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main: Vivier Highlights */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-900 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" /> Talents à fort potentiel (AI Matching)
              </h2>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input type="text" placeholder="Rechercher..." className="pl-9 pr-4 py-1.5 bg-slate-50 border-none text-xs rounded-lg outline-none w-40" />
                </div>
                <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400"><Filter className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Talent</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Métier</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Score Matching</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {talentHighlights.map(t => (
                    <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-800 text-sm">{t.name}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{t.role}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xs font-bold text-brand-600">{t.score}%</span>
                          <div className="w-16 bg-slate-100 rounded-full h-1">
                            <div className="bg-brand-600 h-full rounded-full" style={{ width: `${t.score}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-500">
                        <Badge variant={t.status === 'Disponible' ? 'success' : 'secondary'}>{t.status}</Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-xs font-bold text-brand-600 hover:underline">Proposer</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 bg-slate-50/50 border-t border-slate-100 text-center">
              <button className="text-xs font-semibold text-slate-500 hover:text-brand-600 transition-colors">Gérer tout le vivier de talents</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card p-5 border-l-4 border-l-purple-500">
              <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-purple-600" /> Offres à valider
              </h3>
              <p className="text-xs text-slate-500 mb-4">18 offres d'entreprises attendent votre modération.</p>
              <Button fullWidth size="sm" variant="secondary">Accéder à la modération</Button>
            </div>
            <div className="card p-5 border-l-4 border-l-emerald-500">
              <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" /> Formations
              </h3>
              <p className="text-xs text-slate-500 mb-4">Gérez le catalogue et les inscriptions aux formations.</p>
              <Button fullWidth size="sm" variant="secondary">Catalogue formations</Button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card p-5">
            <h3 className="font-bold text-slate-900 mb-4 text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-600" /> Activité vivier (30j)
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-end h-20 gap-1.5 px-2">
                {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                  <div key={i} className="flex-1 bg-brand-100 rounded-t-sm hover:bg-brand-500 transition-colors cursor-pointer" style={{ height: `${h}%` }} />
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-medium pt-2 border-t border-slate-50">
                <span>Lun</span><span>Mar</span><span>Mer</span><span>Jeu</span><span>Ven</span><span>Sam</span><span>Dim</span>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-bold text-slate-900 mb-4 text-sm">Alertes Système</h3>
            <div className="space-y-3">
              {[
                { type: 'warning', text: 'Document entreprise expiré : Sonatel', time: '10m' },
                { type: 'info', text: 'Nouveau partenaire école : UCAD', time: '2h' },
                { type: 'success', text: 'Matching réussi : 45 profils / Offre Wave', time: '5h' },
              ].map((alert, i) => (
                <div key={i} className="flex gap-3 text-xs">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${alert.type === 'warning' ? 'bg-amber-500' : alert.type === 'info' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
                  <div className="flex-1">
                    <p className="text-slate-700 font-medium leading-snug">{alert.text}</p>
                    <span className="text-[10px] text-slate-400">{alert.time}</span>
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
