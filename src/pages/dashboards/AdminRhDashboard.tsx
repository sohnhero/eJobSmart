import { useState, useEffect } from 'react'
import {
  UserCheck, Users, Briefcase, BookOpen, Search,
  Plus, Upload, Filter, Star, CheckCircle, Clock, X,
  TrendingUp, MessageSquare
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Skeleton from '../../components/ui/Skeleton'
import { useToast } from '../../components/ui/Toast'

interface TalentItem {
  id: number
  name: string
  role: string
  score: number
  status: 'Disponible' | 'En poste'
}

export default function AdminRhDashboard() {
  const navigate = useNavigate()
  const toast = useToast()

  // Skeletons state
  const [isLoading, setIsLoading] = useState(true)

  // Search & data state
  const [searchQuery, setSearchQuery] = useState('')
  const [talents, setTalents] = useState<TalentItem[]>([
    { id: 1, name: 'Aminata Sow', role: 'Expert Finance', score: 98, status: 'Disponible' },
    { id: 2, name: 'Jean-Pierre Gomis', role: 'Ingénieur BTP', score: 95, status: 'En poste' },
    { id: 3, name: 'Samba Diouf', role: 'Architecte Cloud', score: 92, status: 'Disponible' },
  ])

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false)
  const [newName, setNewName] = useState('')
  const [newRole, setNewRole] = useState('')
  const [newScore, setNewScore] = useState(90)
  const [newStatus, setNewStatus] = useState<'Disponible' | 'En poste'>('Disponible')

  // Propose Modal State
  const [proposingTalent, setProposingTalent] = useState<TalentItem | null>(null)
  const [selectedCompany, setSelectedCompany] = useState('Sonatel Digital')
  const [proposalNotes, setProposalNotes] = useState('')

  // Batch import state
  const [showImportModal, setShowImportModal] = useState(false)
  const [importing, setImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  const stats = [
    { title: 'Talents au vivier', value: (12450 + (talents.length - 3)).toLocaleString('fr-FR'), icon: UserCheck, iconColor: 'text-amber-600', trend: 12, trendLabel: 'ce mois' },
    { title: 'Candidats actifs', value: '3,842', icon: Users, iconColor: 'text-blue-600' },
    { title: 'Offres à modérer', value: '18', icon: Briefcase, iconColor: 'text-purple-600' },
    { title: 'Formations actives', value: '45', icon: BookOpen, iconColor: 'text-emerald-600' },
  ]

  const filteredTalents = talents.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddTalentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim() || !newRole.trim()) return

    const newTalent: TalentItem = {
      id: Date.now(),
      name: newName,
      role: newRole,
      score: Number(newScore),
      status: newStatus,
    }

    setTalents(prev => [newTalent, ...prev])
    setShowAddModal(false)
    setNewName('')
    setNewRole('')
    setNewScore(90)
    setNewStatus('Disponible')
    toast.success(`Talent ${newName} ajouté au vivier avec succès !`)
  }

  const handleProposeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!proposingTalent) return

    toast.success(`Candidature de ${proposingTalent.name} proposée avec succès à ${selectedCompany} !`)
    setProposingTalent(null)
    setProposalNotes('')
  }

  const handleBatchImport = () => {
    setImporting(true)
    setImportProgress(0)

    const interval = setInterval(() => {
      setImportProgress(p => {
        if (p >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setImporting(false)
            setShowImportModal(false)
            setImportProgress(0)
            toast.success('Importation de 45 CV effectuée avec succès ! Le matching AI a été lancé.')
          }, 400)
          return 100
        }
        return p + 10
      })
    }, 150)
  }

  return (
    <DashboardLayout role="admin-rh" userName="Admin RH eJobSmart">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Gestion Interne RH</h1>
          <p className="text-slate-500 text-sm mt-0.5">Administration du vivier de talents et modération plateforme</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={() => setShowImportModal(true)} leftIcon={<Upload className="w-4 h-4" />}>Import CV Masse</Button>
          <Button size="sm" onClick={() => setShowAddModal(true)} leftIcon={<Plus className="w-4 h-4" />}>Ajouter Talent</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(stat => <StatCard key={stat.title} {...stat} />)}
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
                  <input 
                    type="text" 
                    placeholder="Rechercher..." 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-1.5 bg-slate-50 border-none text-xs rounded-lg outline-none w-40" 
                  />
                </div>
                <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400"><Filter className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="p-4">
                  <Skeleton variant="table" count={1} />
                </div>
              ) : (
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
                    {filteredTalents.map(t => (
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
                          <Badge variant={t.status === 'Disponible' ? 'green' : 'slate'}>{t.status}</Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => setProposingTalent(t)}
                            className="text-xs font-bold text-brand-600 hover:underline"
                          >
                            Proposer
                          </button>
                        </td>
                      </tr>
                    ))}

                    {filteredTalents.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-400 text-sm">
                          Aucun talent trouvé.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
            <div className="px-6 py-3 bg-slate-50/50 border-t border-slate-100 text-center">
              <button 
                onClick={() => navigate('/dashboard/admin-rh/candidates')}
                className="text-xs font-semibold text-slate-500 hover:text-brand-600 transition-colors"
              >
                Gérer tout le vivier de talents
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card p-5 border-l-4 border-l-purple-500">
              <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-purple-600" /> Offres à valider
              </h3>
              <p className="text-xs text-slate-500 mb-4">18 offres d'entreprises attendent votre modération.</p>
              <Button fullWidth size="sm" variant="secondary" onClick={() => navigate('/dashboard/admin/settings')}>Accéder à la modération</Button>
            </div>
            <div className="card p-5 border-l-4 border-l-emerald-500">
              <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" /> Formations
              </h3>
              <p className="text-xs text-slate-500 mb-4">Gérez le catalogue et les inscriptions aux formations.</p>
              <Button fullWidth size="sm" variant="secondary" onClick={() => navigate('/trainings')}>Catalogue formations</Button>
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

      {/* Propose Talent Modal */}
      {proposingTalent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setProposingTalent(null)} />
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl relative z-10 overflow-hidden border border-slate-100">
            <form onSubmit={handleProposeSubmit}>
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-black text-slate-900">Proposer un candidat</h3>
                <button type="button" onClick={() => setProposingTalent(null)} className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-xs text-slate-500 leading-relaxed">
                  Proposez le profil de <strong>{proposingTalent.name}</strong> ({proposingTalent.role}) à un partenaire.
                </p>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Entreprise partenaire</label>
                  <select 
                    value={selectedCompany} 
                    onChange={e => setSelectedCompany(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20 cursor-pointer"
                  >
                    <option value="Sonatel Digital">Sonatel Digital</option>
                    <option value="Wave Senegal">Wave Sénégal</option>
                    <option value="Orange SN">Orange Sénégal</option>
                    <option value="Ecobank">Ecobank</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Message d'accompagnement</label>
                  <textarea 
                    rows={3}
                    placeholder="ex: Profil excellent correspondant aux besoins de votre équipe..."
                    value={proposalNotes}
                    onChange={e => setProposalNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20 resize-none"
                  />
                </div>
              </div>
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                <Button type="button" variant="ghost" size="sm" onClick={() => setProposingTalent(null)}>Annuler</Button>
                <Button type="submit" size="sm">Envoyer la proposition</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Talent Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl relative z-10 overflow-hidden border border-slate-100">
            <form onSubmit={handleAddTalentSubmit}>
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-black text-slate-900">Ajouter un Talent</h3>
                <button type="button" onClick={() => setShowAddModal(false)} className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nom Complet</label>
                  <input 
                    type="text" placeholder="ex: Samba Diouf" required
                    value={newName} onChange={e => setNewName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Métier / Rôle</label>
                  <input 
                    type="text" placeholder="ex: Architecte Cloud" required
                    value={newRole} onChange={e => setNewRole(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Score Matching (%)</label>
                    <input 
                      type="number" min="10" max="100" required
                      value={newScore} onChange={e => setNewScore(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Statut</label>
                    <select 
                      value={newStatus} onChange={e => setNewStatus(e.target.value as 'Disponible' | 'En poste')}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20 cursor-pointer"
                    >
                      <option value="Disponible">Disponible</option>
                      <option value="En poste">En poste</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddModal(false)}>Annuler</Button>
                <Button type="submit" size="sm">Ajouter</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Batch Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => !importing && setShowImportModal(false)} />
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl relative z-10 overflow-hidden border border-slate-100 p-6 text-center">
            {importing ? (
              <div className="space-y-4 py-4">
                <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto" />
                <h4 className="font-bold text-slate-900 text-sm">Importation en cours...</h4>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-brand-600 h-full rounded-full transition-all duration-150" style={{ width: `${importProgress}%` }} />
                </div>
                <p className="text-[10px] text-slate-400 font-semibold">{importProgress}% complété</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Import de CV en masse</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Téléchargez un fichier ZIP contenant plusieurs CV pour alimenter automatiquement le vivier.
                  </p>
                </div>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                  <p className="text-xs font-semibold text-slate-700">Sélectionner ou glisser un fichier ZIP</p>
                  <p className="text-[10px] text-slate-400 mt-1">zip, rar max. 50 Mo</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setShowImportModal(false)} className="flex-1">Annuler</Button>
                  <Button size="sm" onClick={handleBatchImport} className="flex-1">Lancer l'import</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
