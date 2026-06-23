import { useState } from 'react'
import {
  Settings, Briefcase, Users, CreditCard,
  Plus, Edit3, Trash2, Save, X,
  Globe, Bell, Shield, Database,
  FileText, CheckCircle,
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'

interface SectorItem {
  id: number
  label: string
  icon: string
  count: number
  status: string
}

export default function PlatformSettings() {
  const [activeTab, setActiveTab] = useState('sectors')

  // Reactive state for sectors
  const [sectorsList, setSectorsList] = useState<SectorItem[]>([
    { id: 1, label: 'Technologie & Numérique', icon: '💻', count: 342, status: 'Actif' },
    { id: 2, label: 'Banque & Finance', icon: '🏦', count: 218, status: 'Actif' },
    { id: 3, label: 'Santé & Pharmaceutique', icon: '🏥', count: 189, status: 'Actif' },
    { id: 4, label: 'BTP & Immobilier', icon: '🏗️', count: 156, status: 'Actif' },
  ])

  // Reactive state for contracts
  const [contractsList, setContractsList] = useState<string[]>([
    'CDI', 'CDD', 'Intérim', 'Freelance', 'Stage', 'Alternance'
  ])

  // Modal State
  const [showAddSector, setShowAddSector] = useState(false)
  const [newSectorLabel, setNewSectorLabel] = useState('')
  const [newSectorIcon, setNewSectorIcon] = useState('💻')

  const handleDeleteSector = (id: number) => {
    setSectorsList(prev => prev.filter(s => s.id !== id))
  }

  const handleAddSectorSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSectorLabel.trim()) return

    const newSec: SectorItem = {
      id: Date.now(),
      label: newSectorLabel,
      icon: newSectorIcon,
      count: 0,
      status: 'Actif'
    }

    setSectorsList(prev => [...prev, newSec])
    setShowAddSector(false)
    setNewSectorLabel('')
    setNewSectorIcon('💻')
  }

  const handleDeleteContract = (name: string) => {
    setContractsList(prev => prev.filter(c => c !== name))
  }

  const [newContractName, setNewContractName] = useState('')
  const [showAddContractInput, setShowAddContractInput] = useState(false)

  const handleAddContractSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newContractName.trim() || contractsList.includes(newContractName.trim())) return
    setContractsList(prev => [...prev, newContractName.trim()])
    setNewContractName('')
    setShowAddContractInput(false)
  }

  return (
    <DashboardLayout role="admin" userName="Super Admin">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900">Paramétrage Système</h1>
        <p className="text-slate-500 text-sm mt-0.5">Configuration globale de la plateforme eJobSmart</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="card overflow-hidden">
            <nav className="flex flex-col">
              {[
                { id: 'sectors', label: 'Secteurs d\'activité', icon: Briefcase },
                { id: 'contracts', label: 'Types de contrats', icon: FileText },
                { id: 'plans', label: 'Plans & Abonnements', icon: CreditCard },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-l-2 ${
                    activeTab === tab.id
                      ? 'bg-brand-50 text-brand-600 border-brand-600'
                      : 'text-slate-500 border-transparent hover:bg-slate-50 hover:text-slate-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {activeTab === 'sectors' && (
            <div className="card">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-bold text-slate-900">Gestion des Secteurs</h2>
                <Button size="sm" onClick={() => setShowAddSector(true)} leftIcon={<Plus className="w-4 h-4" />}>Nouveau Secteur</Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="px-6 py-3">Secteur</th>
                      <th className="px-6 py-3">Offres liées</th>
                      <th className="px-6 py-3">Statut</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sectorsList.map(s => (
                      <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <span className="text-xl">{s.icon}</span>
                          <span className="text-sm font-semibold text-slate-800">{s.label}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">{s.count}</td>
                        <td className="px-6 py-4">
                          <Badge variant="green">{s.status}</Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => handleDeleteSector(s.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
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
          )}

          {activeTab === 'contracts' && (
            <div className="card p-6">
              <h2 className="font-bold text-slate-900 mb-4">Types de Contrats</h2>
              <div className="flex flex-wrap gap-3">
                {contractsList.map(c => (
                  <div key={c} className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-sm font-medium text-slate-700">{c}</span>
                    <button onClick={() => handleDeleteContract(c)} className="text-slate-400 hover:text-red-500"><X className="w-3 h-3" /></button>
                  </div>
                ))}
                
                {showAddContractInput ? (
                  <form onSubmit={handleAddContractSubmit} className="flex items-center gap-2">
                    <input 
                      type="text" 
                      placeholder="Nom du contrat" 
                      required
                      value={newContractName}
                      onChange={e => setNewContractName(e.target.value)}
                      className="px-2.5 py-1.5 border border-slate-200 rounded-xl text-xs outline-none"
                    />
                    <Button type="submit" size="sm">OK</Button>
                    <button type="button" onClick={() => setShowAddContractInput(false)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
                  </form>
                ) : (
                  <button onClick={() => setShowAddContractInput(true)} className="flex items-center gap-2 px-3 py-2 border border-dashed border-slate-300 text-slate-400 rounded-xl hover:bg-slate-50 transition-colors">
                    <Plus className="w-3 h-3" />
                    <span className="text-sm font-medium">Ajouter</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === 'plans' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: 'Entreprise Standard', price: '45,000', features: ['5 offres/mois', 'Base CV (limité)', 'Stats basiques'] },
                { name: 'Entreprise Premium', price: '120,000', features: ['Offres illimitées', 'Base CV complète', 'Matching AI', 'Support 24/7'] },
              ].map(plan => (
                <div key={plan.name} className="card p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-slate-900">{plan.name}</h3>
                    <Badge variant="green">Actif</Badge>
                  </div>
                  <p className="text-2xl font-black text-slate-900 mb-4">{plan.price} <span className="text-xs font-normal text-slate-500">FCFA / mois</span></p>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map(f => (
                      <li key={f} className="text-xs text-slate-600 flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-emerald-500" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Sector Modal */}
      {showAddSector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowAddSector(false)} />
          
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl relative z-10 overflow-hidden border border-slate-100">
            <form onSubmit={handleAddSectorSubmit}>
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-black text-slate-900">Ajouter un secteur</h3>
                <button type="button" onClick={() => setShowAddSector(false)} className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nom du secteur</label>
                  <input 
                    type="text" placeholder="ex: Transport & Logistique" required
                    value={newSectorLabel} onChange={e => setNewSectorLabel(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Icône (Émoji)</label>
                  <input 
                    type="text" placeholder="ex: 🚚" required
                    value={newSectorIcon} onChange={e => setNewSectorIcon(e.target.value)}
                    className="w-20 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-center outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddSector(false)}>Annuler</Button>
                <Button type="submit" size="sm">Créer</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
