import { useState } from 'react'
import {
  Users, UserPlus, Search, Filter,
  MoreVertical, Download, Edit3, Trash2,
  CheckCircle, Clock, MapPin, Briefcase,
  Eye, FileText, X, CheckCircle2
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'

interface TalentResource {
  id: number
  name: string
  role: string
  exp: string
  status: 'Disponible' | 'Placé' | 'En entretien' | 'En poste'
  location: string
  rate: string
  skills: string[]
  bio: string
}

export default function AgencyResources() {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('Tous les statuts')
  const [selectedResource, setSelectedResource] = useState<TalentResource | null>(null)
  
  // Talent Onboarding state
  const [showAddModal, setShowAddModal] = useState(false)
  const [newName, setNewName] = useState('')
  const [newRole, setNewRole] = useState('')
  const [newExp, setNewExp] = useState('2 ans')
  const [newLocation, setNewLocation] = useState('Dakar')
  const [newRate, setNewRate] = useState('400k / mois')
  const [newStatus, setNewStatus] = useState<'Disponible' | 'Placé' | 'En entretien' | 'En poste'>('Disponible')

  const [resources, setResources] = useState<TalentResource[]>([
    { id: 1, name: 'Bamba Diop', role: 'Ingénieur DevOps', exp: '8 ans', status: 'Placé', location: 'Dakar', rate: '450k / mois', skills: ['Docker', 'Kubernetes', 'CI/CD', 'AWS'], bio: 'Spécialiste de l\'automatisation infrastructure et du cloud computing.' },
    { id: 2, name: 'Safiétou Kane', role: 'UX Designer', exp: '4 ans', status: 'Disponible', location: 'Saint-Louis', rate: '350k / mois', skills: ['Figma', 'User Research', 'Prototyping'], bio: 'Créatrice d\'expériences centrées sur l\'utilisateur avec une expertise Figma.' },
    { id: 3, name: 'Ibrahima Ndiaye', role: 'Chef de Projet', exp: '12 ans', status: 'En entretien', location: 'Dakar', rate: '750k / mois', skills: ['Agile', 'Scrum', 'Budgeting'], bio: 'Pilote chevronné de projets SI de grande envergure.' },
    { id: 4, name: 'Aminata Diallo', role: 'Dev Fullstack', exp: '5 ans', status: 'Disponible', location: 'Dakar', rate: '550k / mois', skills: ['React', 'Node.js', 'TypeScript'], bio: 'Développeuse full stack spécialisée dans les architectures JS modernes.' },
    { id: 5, name: 'Jean-Pierre Gomis', role: 'Expert Finance', exp: '15 ans', status: 'En poste', location: 'Abidjan', rate: '900k / mois', skills: ['SYSCOHADA', 'Audit', 'Trésorerie'], bio: 'Analyste financier senior, ex-cabinet Big Four.' },
  ])

  const handleDeleteResource = (id: number) => {
    setResources(prev => prev.filter(r => r.id !== id))
  }

  const handleAddResourceSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim() || !newRole.trim()) return

    const newTalent: TalentResource = {
      id: Date.now(),
      name: newName,
      role: newRole,
      exp: newExp,
      status: newStatus,
      location: newLocation,
      rate: newRate,
      skills: ['Général'],
      bio: 'Profil enregistré récemment dans le portefeuille de l\'agence.'
    }

    setResources(prev => [newTalent, ...prev])
    setShowAddModal(false)
    // Reset values
    setNewName('')
    setNewRole('')
    setNewExp('2 ans')
    setNewLocation('Dakar')
    setNewRate('400k / mois')
    setNewStatus('Disponible')
  }

  const filtered = resources.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(query.toLowerCase()) || 
                          r.role.toLowerCase().includes(query.toLowerCase())
    const matchesStatus = statusFilter === 'Tous les statuts' || r.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <DashboardLayout role="agency" userName="Cabinet Excellence RH">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Portefeuille RH</h1>
          <p className="text-slate-500 text-sm mt-0.5">Gérez vos talents et suivez leur statut de placement</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => setShowAddModal(true)} leftIcon={<UserPlus className="w-4 h-4" />}>
            Ajouter une ressource
          </Button>
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
            <select 
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl text-sm px-4 py-2 outline-none cursor-pointer"
            >
              <option value="Tous les statuts">Tous les statuts</option>
              <option value="Disponible">Disponible</option>
              <option value="Placé">Placé</option>
              <option value="En entretien">En entretien</option>
              <option value="En poste">En poste</option>
            </select>
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
                    <Badge variant={res.status === 'Disponible' ? 'green' : res.status === 'Placé' ? 'slate' : 'amber'}>
                      {res.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button 
                        onClick={() => setSelectedResource(res)}
                        title="Voir le dossier" 
                        className="p-2 text-slate-400 hover:text-brand-600 transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteResource(res.id)}
                        title="Supprimer" 
                        className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Talent Detail Drawer */}
      {selectedResource && (
        <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedResource(null)} />
            
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <div className="pointer-events-auto w-screen max-w-md transform bg-white shadow-2xl transition-all duration-300 border-l border-slate-200 flex flex-col">
                {/* Header */}
                <div className="px-6 py-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-slate-900">Dossier Ressource</h2>
                    <p className="text-xs text-slate-400 mt-0.5">{selectedResource.role}</p>
                  </div>
                  <button onClick={() => setSelectedResource(null)} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  <div className="flex items-center gap-4">
                    <Avatar name={selectedResource.name} size="lg" />
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">{selectedResource.name}</h3>
                      <p className="text-xs text-slate-500">{selectedResource.exp} d'expérience</p>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {selectedResource.location}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Tarif mensuel</p>
                      <p className="text-sm font-black text-brand-600 mt-0.5">{selectedResource.rate}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Statut</p>
                      <Badge variant={selectedResource.status === 'Disponible' ? 'green' : 'slate'} className="mt-0.5">
                        {selectedResource.status}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">Description</h4>
                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {selectedResource.bio}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2.5">Compétences</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedResource.skills.map(s => (
                        <span key={s} className="px-2.5 py-1 bg-brand-50 text-brand-700 text-xs font-semibold rounded-lg border border-brand-100">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-slate-200 bg-slate-50">
                  <Button fullWidth onClick={() => setSelectedResource(null)}>Fermer le dossier</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Resource Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative z-10 overflow-hidden border border-slate-100">
            <form onSubmit={handleAddResourceSubmit}>
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-black text-slate-900">Ajouter un candidat</h3>
                <button type="button" onClick={() => setShowAddModal(false)} className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nom complet</label>
                  <input 
                    type="text" placeholder="ex: Safiétou Diop" required
                    value={newName} onChange={e => setNewName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Titre du poste / Spécialité</label>
                  <input 
                    type="text" placeholder="ex: Chef de Projet, UX Designer..." required
                    value={newRole} onChange={e => setNewRole(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Expérience</label>
                    <input 
                      type="text" placeholder="ex: 5 ans"
                      value={newExp} onChange={e => setNewExp(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Localisation</label>
                    <input 
                      type="text" placeholder="ex: Dakar"
                      value={newLocation} onChange={e => setNewLocation(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Rémunération / TJM</label>
                    <input 
                      type="text" placeholder="ex: 450k / mois"
                      value={newRate} onChange={e => setNewRate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Statut initial</label>
                    <select 
                      value={newStatus} onChange={e => setNewStatus(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20 cursor-pointer"
                    >
                      <option value="Disponible">Disponible</option>
                      <option value="Placé">Placé</option>
                      <option value="En entretien">En entretien</option>
                      <option value="En poste">En poste</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddModal(false)}>Annuler</Button>
                <Button type="submit" size="sm">Créer la ressource</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
