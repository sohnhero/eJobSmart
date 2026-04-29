import { useState } from 'react'
import {
  Settings, Building2, Users, Bell,
  Shield, Globe, Mail, Phone, MapPin,
  Upload, Save, Plus, Trash2,
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import Avatar from '../../components/ui/Avatar'

export default function CompanySettings() {
  const [activeTab, setActiveTab] = useState('profile')

  const team = [
    { id: 1, name: 'Safiétou Kane', role: 'Administrateur', email: 'safietou@sonatel.sn' },
    { id: 2, name: 'Ibrahima Ndiaye', role: 'Recruteur', email: 'ibrahima@sonatel.sn' },
  ]

  return (
    <DashboardLayout role="company" userName="Sonatel Digital">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900">Paramètres du compte</h1>
        <p className="text-slate-500 text-sm mt-0.5">Gérez les informations de votre entreprise et les accès de votre équipe</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="card overflow-hidden">
            <nav className="flex flex-col">
              {[
                { id: 'profile', label: 'Profil Entreprise', icon: Building2 },
                { id: 'team', label: 'Gestion d\'équipe', icon: Users },
                { id: 'notifications', label: 'Notifications', icon: Bell },
                { id: 'security', label: 'Sécurité', icon: Shield },
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
          {activeTab === 'profile' && (
            <div className="card p-6">
              <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-100">
                <div className="relative">
                  <Avatar name="Sonatel Digital" size="xl" />
                  <button className="absolute -bottom-1 -right-1 p-2 bg-white rounded-full shadow-lg border border-slate-100 text-brand-600 hover:text-brand-800 transition-colors">
                    <Upload className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Logo de l'entreprise</h2>
                  <p className="text-sm text-slate-500 mt-1">PNG, JPG ou SVG. Max 2MB.</p>
                </div>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Nom de l'entreprise</label>
                    <input type="text" defaultValue="Sonatel Digital" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Secteur d'activité</label>
                    <input type="text" defaultValue="Télécommunications & Digital" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Site Web</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="url" defaultValue="https://sonatel.sn" className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Siège social</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="text" defaultValue="Dakar, Sénégal" className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Description de l'entreprise</label>
                  <textarea rows={4} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20 resize-none">Leader des télécommunications au Sénégal, Sonatel Digital accompagne la transformation numérique de la sous-région à travers des solutions innovantes.</textarea>
                </div>

                <div className="flex justify-end pt-4">
                  <Button leftIcon={<Save className="w-4 h-4" />}>Enregistrer les modifications</Button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="card">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-bold text-slate-900">Membres de l'équipe</h2>
                <Button size="sm" leftIcon={<Plus className="w-4 h-4" />}>Ajouter un membre</Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="px-6 py-4">Membre</th>
                      <th className="px-6 py-4">Rôle</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {team.map(member => (
                      <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar name={member.name} size="sm" />
                            <p className="text-sm font-bold text-slate-800">{member.name}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">{member.role}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">{member.email}</td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
