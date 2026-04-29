import {
  Search, Filter, MoreVertical,
  CheckCircle, XCircle, Eye, MessageSquare,
  Calendar, Star,
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import Badge, { StatusBadge } from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import MatchScore from '../../components/ui/MatchScore'

const applications = [
  { id: 1, name: 'Aminata Sow', job: 'Dev Frontend React', date: '2026-04-28', status: 'Vérifié', score: 94 },
  { id: 2, name: 'Jean-Pierre Gomis', job: 'Dev Frontend React', date: '2026-04-27', status: 'En attente', score: 88 },
  { id: 3, name: 'Samba Diouf', job: 'UX Designer', date: '2026-04-27', status: 'Vérifié', score: 82 },
  { id: 4, name: 'Fatou Kane', job: 'Dev Frontend React', date: '2026-04-26', status: 'Inactif', score: 75 },
  { id: 5, name: 'Modou Fall', job: 'Chef de Projet', date: '2026-04-25', status: 'Vérifié', score: 91 },
]

export default function CompanyApplications() {
  return (
    <DashboardLayout role="company" userName="Sonatel Digital">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900">Candidatures reçues</h1>
        <p className="text-slate-500 text-sm mt-0.5">Gérez et évaluez les profils des candidats</p>
      </div>

      <div className="card overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un candidat..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
          <div className="flex items-center gap-2">
            <select className="bg-white border border-slate-200 rounded-xl text-xs px-3 py-2 outline-none">
              <option>Toutes les offres</option>
              <option>Dev Frontend React</option>
              <option>UX Designer</option>
            </select>
            <Button variant="ghost" size="sm" leftIcon={<Filter className="w-4 h-4" />}>Filtres</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Candidat</th>
                <th className="px-6 py-4">Offre visée</th>
                <th className="px-6 py-4">Score Matching</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.map(app => (
                <tr key={app.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={app.name} size="sm" />
                      <p className="text-sm font-bold text-slate-800">{app.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{app.job}</td>
                  <td className="px-6 py-4">
                    <MatchScore score={app.score} size="sm" />
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400">
                    {new Date(app.date).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button title="Voir profil" className="p-2 text-slate-400 hover:text-brand-600 transition-colors"><Eye className="w-4 h-4" /></button>
                      <button title="Envoyer message" className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><MessageSquare className="w-4 h-4" /></button>
                      <button title="Planifier entretien" className="p-2 text-slate-400 hover:text-purple-600 transition-colors"><Calendar className="w-4 h-4" /></button>
                      <button title="Plus d'actions" className="p-2 text-slate-400 hover:text-slate-600 transition-colors"><MoreVertical className="w-4 h-4" /></button>
                    </div>
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
