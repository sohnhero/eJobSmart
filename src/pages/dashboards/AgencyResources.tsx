import { useState } from 'react'
import {
  Users, UserPlus, Search, Filter,
  MoreVertical, Download, Edit3, Trash2,
  CheckCircle, Clock, MapPin, Briefcase,
  Eye, FileText,
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'

const resources = [
  { id: 1, name: 'Bamba Diop', role: 'Ingénieur DevOps', exp: '8 ans', status: 'Placé', location: 'Dakar', rate: '450k / mois' },
  { id: 2, name: 'Safiétou Kane', role: 'UX Designer', exp: '4 ans', status: 'Disponible', location: 'Saint-Louis', rate: '350k / mois' },
  { id: 3, name: 'Ibrahima Ndiaye', role: 'Chef de Projet', exp: '12 ans', status: 'En entretien', location: 'Dakar', rate: '750k / mois' },
  { id: 4, name: 'Aminata Diallo', role: 'Dev Fullstack', exp: '5 ans', status: 'Disponible', location: 'Dakar', rate: '550k / mois' },
  { id: 5, name: 'Jean-Pierre Gomis', role: 'Expert Finance', exp: '15 ans', status: 'En poste', location: 'Abidjan', rate: '900k / mois' },
]

export default function AgencyResources() {
  const [query, setQuery] = useState('')

  const filtered = resources.filter(r => 
    r.name.toLowerCase().includes(query.toLowerCase()) || 
    r.role.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <DashboardLayout role="agency" userName="Cabinet Excellence RH">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Portefeuille RH</h1>
          <p className="text-slate-500 text-sm mt-0.5">Gérez vos talents et suivez leur statut de placement</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" leftIcon={<Download className="w-4 h-4" />}>Exporter</Button>
          <Button size="sm" leftIcon={<UserPlus className="w-4 h-4" />}>Ajouter une ressource</Button>
        </div>
      </div>

      <div className="card">
        {/* Search & Filter */}
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher une ressource..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
          <div className="flex items-center gap-3">
            <select className="bg-white border border-slate-200 rounded-xl text-sm px-4 py-2 outline-none">
              <option>Tous les statuts</option>
              <option>Disponible</option>
              <option>Placé</option>
              <option>En entretien</option>
            </select>
            <Button variant="ghost" size="sm" leftIcon={<Filter className="w-4 h-4" />}>Filtres</Button>
          </div>
        </div>

        {/* List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Ressource</th>
                <th className="px-6 py-4">Spécialité & Exp</th>
                <th className="px-6 py-4">Localisation</th>
                <th className="px-6 py-4">TJM / Salaire</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(res => (
                <tr key={res.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={res.name} size="sm" />
                      <p className="text-sm font-bold text-slate-800">{res.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-700 font-medium">{res.role}</p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Briefcase className="w-3 h-3" /> {res.exp} d'expérience
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {res.location}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-700">
                    {res.rate}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={res.status === 'Disponible' ? 'success' : res.status === 'Placé' ? 'secondary' : 'warning'}>
                      {res.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button title="Voir CV" className="p-2 text-slate-400 hover:text-brand-600 transition-colors"><FileText className="w-4 h-4" /></button>
                      <button title="Proposer" className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><CheckCircle className="w-4 h-4" /></button>
                      <button title="Modifier" className="p-2 text-slate-400 hover:text-brand-600 transition-colors"><Edit3 className="w-4 h-4" /></button>
                      <button title="Supprimer" className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
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
