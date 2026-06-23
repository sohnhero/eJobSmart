import { useState } from 'react'
import {
  Plus, Search, Filter, Briefcase,
  Users, CheckCircle, Clock, MoreVertical, Trash2, X
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'

interface PlacementOffer {
  id: number
  title: string
  client: string
  positions: number
  applicants: number
  status: 'Active' | 'Fermée'
}

export default function AgencyJobs() {
  const [query, setQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newClient, setNewClient] = useState('')
  const [newPositions, setNewPositions] = useState(1)

  const [offers, setOffers] = useState<PlacementOffer[]>([
    { id: 1, title: 'Architecte Cloud', client: 'Bank of Africa', positions: 2, applicants: 15, status: 'Active' },
    { id: 2, title: 'Directeur Commercial', client: 'Teyliom', positions: 1, applicants: 8, status: 'Active' },
    { id: 3, title: 'Analyste Cyber', client: 'Orange SN', positions: 3, applicants: 24, status: 'Fermée' },
  ])

  const handleDeleteOffer = (id: number) => {
    setOffers(prev => prev.filter(o => o.id !== id))
  }

  const handleToggleStatus = (id: number) => {
    setOffers(prev => prev.map(o => o.id === id ? { ...o, status: o.status === 'Active' ? 'Fermée' : 'Active' } : o))
  }

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim() || !newClient.trim()) return

    const newOffer: PlacementOffer = {
      id: Date.now(),
      title: newTitle,
      client: newClient,
      positions: newPositions,
      applicants: 0,
      status: 'Active'
    }

    setOffers(prev => [newOffer, ...prev])
    setShowAddModal(false)
    setNewTitle('')
    setNewClient('')
    setNewPositions(1)
  }

  const filtered = offers.filter(o => 
    o.title.toLowerCase().includes(query.toLowerCase()) ||
    o.client.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <DashboardLayout role="agency" userName="Cabinet Excellence RH">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Offres de placement</h1>
          <p className="text-slate-500 text-sm mt-0.5">Gérez les besoins en recrutement de vos clients</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} leftIcon={<Plus className="w-4 h-4" />}>
          Nouvelle offre client
        </Button>
      </div>

      <div className="card">
        {/* Search bar */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Rechercher par client ou poste..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Poste & Client</th>
                <th className="px-6 py-4">Besoins</th>
                <th className="px-6 py-4">Candidats</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(offer => (
                <tr key={offer.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-800">{offer.title}</p>
                    <p className="text-xs text-slate-400">{offer.client}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{offer.positions} poste(s)</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-sm font-semibold text-slate-700">{offer.applicants}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleToggleStatus(offer.id)}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all ${
                        offer.status === 'Active' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {offer.status}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleDeleteOffer(offer.id)}
                        title="Supprimer la mission"
                        className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-400 text-sm">
                    Aucune offre trouvée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Client Offer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative z-10 overflow-hidden border border-slate-100">
            <form onSubmit={handleAddSubmit}>
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-black text-slate-900">Nouvelle offre client</h3>
                <button type="button" onClick={() => setShowAddModal(false)} className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Intitulé du poste</label>
                  <input 
                    type="text" placeholder="ex: Architecte Solutions Senior" required
                    value={newTitle} onChange={e => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Client (Entreprise)</label>
                  <input 
                    type="text" placeholder="ex: Wave, Orange, Banque..." required
                    value={newClient} onChange={e => setNewClient(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nombre de postes requis</label>
                  <input 
                    type="number" min="1" max="50" required
                    value={newPositions} onChange={e => setNewPositions(Number(e.target.value))}
                    className="w-20 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddModal(false)}>Annuler</Button>
                <Button type="submit" size="sm">Enregistrer l'offre</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
