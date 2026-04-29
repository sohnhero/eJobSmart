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

export default function PlatformSettings() {
  const [activeTab, setActiveTab] = useState('sectors')

  const sectors = [
    { id: 1, label: 'Technologie & Numérique', icon: '💻', count: 342, status: 'Actif' },
    { id: 2, label: 'Banque & Finance', icon: '🏦', count: 218, status: 'Actif' },
    { id: 3, label: 'Santé & Pharmaceutique', icon: '🏥', count: 189, status: 'Actif' },
    { id: 4, label: 'BTP & Immobilier', icon: '🏗️', count: 156, status: 'Actif' },
  ]

  const contracts = ['CDI', 'CDD', 'Intérim', 'Freelance', 'Stage', 'Alternance']

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
                { id: 'notifications', label: 'Templates Emails', icon: Bell },
                { id: 'security', label: 'Sécurité & Accès', icon: Shield },
                { id: 'database', label: 'Maintenance DB', icon: Database },
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
                <Button size="sm" leftIcon={<Plus className="w-4 h-4" />}>Nouveau Secteur</Button>
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
                    {sectors.map(s => (
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
                            <button className="p-1.5 text-slate-400 hover:text-brand-600 transition-colors"><Edit3 className="w-4 h-4" /></button>
                            <button className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
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
                {contracts.map(c => (
                  <div key={c} className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-sm font-medium text-slate-700">{c}</span>
                    <button className="text-slate-400 hover:text-red-500"><X className="w-3 h-3" /></button>
                  </div>
                ))}
                <button className="flex items-center gap-2 px-3 py-2 border border-dashed border-slate-300 text-slate-400 rounded-xl hover:bg-slate-50 transition-colors">
                  <Plus className="w-3 h-3" />
                  <span className="text-sm font-medium">Ajouter</span>
                </button>
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
                  <Button fullWidth variant="secondary" size="sm" leftIcon={<Edit3 className="w-4 h-4" />}>Modifier le plan</Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
