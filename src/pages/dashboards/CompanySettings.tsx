import { useState } from 'react'
import {
  Building2, Users, Bell, Shield, Globe, MapPin,
  Upload, Save, Plus, Trash2, X, Lock, Smartphone, Laptop,
  Mail, Phone
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import Avatar from '../../components/ui/Avatar'
import { useToast } from '../../components/ui/Toast'

interface TeamMember {
  id: number
  name: string
  role: string
  email: string
}

export default function CompanySettings() {
  const toast = useToast()
  const [activeTab, setActiveTab] = useState('profile')

  // Profile Form State
  const [companyName, setCompanyName] = useState('Sonatel Digital')
  const [sector, setSector] = useState('Télécommunications & Digital')
  const [website, setWebsite] = useState('https://sonatel.sn')
  const [location, setLocation] = useState('Dakar, Sénégal')
  const [email, setEmail] = useState('hr@sonatel.sn')
  const [phone, setPhone] = useState('+221 33 839 12 00')
  const [description, setDescription] = useState(
    "Leader des télécommunications au Sénégal, Sonatel Digital accompagne la transformation numérique de la sous-région à travers des solutions innovantes."
  )

  // Team Management State
  const [teamList, setTeamList] = useState<TeamMember[]>([
    { id: 1, name: 'Safiétou Kane', role: 'Administrateur', email: 'safietou@sonatel.sn' },
    { id: 2, name: 'Ibrahima Ndiaye', role: 'Recruteur', email: 'ibrahima@sonatel.sn' },
  ])
  const [showAddMemberModal, setShowAddMemberModal] = useState(false)
  const [newMemberName, setNewMemberName] = useState('')
  const [newMemberEmail, setNewMemberEmail] = useState('')
  const [newMemberRole, setNewMemberRole] = useState('Recruteur')

  // Notification Toggles State
  const [notifications, setNotifications] = useState({
    newAppEmail: true,
    interviewSchedule: true,
    chatMessages: true,
    monthlyReport: false,
  })

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [enable2FA, setEnable2FA] = useState(false)

  // Actions
  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Profil de l\'entreprise mis à jour avec succès !')
  }

  const handleDeleteMember = (id: number, name: string) => {
    setTeamList(prev => prev.filter(m => m.id !== id))
    toast.info(`Membre ${name} retiré de l'équipe.`)
  }

  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMemberName.trim() || !newMemberEmail.trim()) return

    const newMember: TeamMember = {
      id: Date.now(),
      name: newMemberName,
      email: newMemberEmail,
      role: newMemberRole,
    }

    setTeamList(prev => [...prev, newMember])
    setShowAddMemberModal(false)
    setNewMemberName('')
    setNewMemberEmail('')
    setNewMemberRole('Recruteur')
    toast.success(`Invitation envoyée à ${newMemberName} (${newMemberEmail}) !`)
  }

  const handleNotificationsSave = () => {
    toast.success('Préférences de notification enregistrées !')
  }

  const handleSecuritySave = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword || confirmPassword) {
      if (newPassword !== confirmPassword) {
        toast.error('Les nouveaux mots de passe ne correspondent pas.')
        return
      }
      if (newPassword.length < 6) {
        toast.warning('Le mot de passe doit contenir au moins 6 caractères.')
        return
      }
      toast.success('Mot de passe changé avec succès !')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } else {
      toast.success('Paramètres de sécurité enregistrés !')
    }
  }

  return (
    <DashboardLayout role="company" userName="Sonatel Digital" userTitle="Compte Entreprise">
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
                      ? 'bg-brand-50 text-brand-600 border-brand-600 font-bold'
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

              <form onSubmit={handleProfileSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Nom de l'entreprise</label>
                    <input 
                      type="text" 
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Secteur d'activité</label>
                    <input 
                      type="text" 
                      value={sector}
                      onChange={e => setSector(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Site Web</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="url" 
                        value={website}
                        onChange={e => setWebsite(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Siège social</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="text" 
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Email de contact</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="email" 
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Téléphone de contact</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="tel" 
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20" 
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Description de l'entreprise</label>
                  <textarea 
                    rows={4} 
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20 resize-none"
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <Button type="submit" leftIcon={<Save className="w-4 h-4" />}>Enregistrer les modifications</Button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="card">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-slate-900">Membres de l'équipe</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Donnez accès aux recruteurs et administrateurs</p>
                </div>
                <Button size="sm" onClick={() => setShowAddMemberModal(true)} leftIcon={<Plus className="w-4 h-4" />}>Ajouter un membre</Button>
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
                    {teamList.map(member => (
                       <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar name={member.name} size="sm" />
                            <p className="text-sm font-bold text-slate-800">{member.name}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">{member.role}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">{member.email}</td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            type="button"
                            onClick={() => handleDeleteMember(member.id, member.name)}
                            className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                            title="Retirer le membre"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="card p-6 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Préférences de notifications</h2>
                <p className="text-sm text-slate-500 mt-0.5">Choisissez comment vous souhaitez être notifié au quotidien</p>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                {[
                  {
                    key: 'newAppEmail',
                    title: 'Nouvelles candidatures',
                    desc: 'Recevoir un email récapitulatif pour chaque nouvelle candidature reçue.',
                  },
                  {
                    key: 'interviewSchedule',
                    title: 'Planification d\'entretiens',
                    desc: 'Recevoir des rappels pour les entretiens programmés avec les candidats.',
                  },
                  {
                    key: 'chatMessages',
                    title: 'Messages instantanés',
                    desc: 'Être notifié en direct lors d\'un nouveau message d\'un candidat.',
                  },
                  {
                    key: 'monthlyReport',
                    title: 'Rapport d\'activité mensuel',
                    desc: 'Statistiques complètes de visibilité et d\'attractivité de vos offres chaque mois.',
                  },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl gap-4">
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-slate-800">{item.title}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                    <label className="flex items-center cursor-pointer flex-shrink-0">
                      <div
                        onClick={() => 
                          setNotifications(prev => ({ 
                            ...prev, 
                            [item.key]: !prev[item.key as keyof typeof notifications] 
                          }))
                        }
                        className={`w-11 h-6 rounded-full transition-colors relative ${
                          notifications[item.key as keyof typeof notifications] ? 'bg-brand-600' : 'bg-slate-200'
                        }`}
                      >
                        <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                          notifications[item.key as keyof typeof notifications] ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                      </div>
                    </label>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <Button onClick={handleNotificationsSave} leftIcon={<Save className="w-4 h-4" />}>
                  Enregistrer les préférences
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              {/* Password change */}
              <div className="card p-6">
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-slate-900">Mot de passe</h2>
                  <p className="text-sm text-slate-500 mt-0.5">Modifiez votre mot de passe pour sécuriser l'accès</p>
                </div>

                <form onSubmit={handleSecuritySave} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Mot de passe actuel</label>
                    <input 
                      type="password" 
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20" 
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Nouveau mot de passe</label>
                      <input 
                        type="password" 
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder="Min. 6 caractères"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Confirmer le nouveau mot de passe</label>
                      <input 
                        type="password" 
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="Confirmer"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20" 
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button type="submit" leftIcon={<Save className="w-4 h-4" />}>
                      Mettre à jour la sécurité
                    </Button>
                  </div>
                </form>
              </div>

              {/* Two Factor Auth */}
              <div className="card p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h2 className="text-lg font-bold text-slate-900">Authentification à deux facteurs (2FA)</h2>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Sécurisez davantage votre compte entreprise en exigeant un code de validation à chaque connexion.
                    </p>
                  </div>
                  <label className="flex items-center cursor-pointer flex-shrink-0">
                    <div
                      onClick={() => {
                        setEnable2FA(!enable2FA)
                        toast.success(
                          !enable2FA 
                            ? 'Double facteur d\'authentification activé !' 
                            : 'Double facteur d\'authentification désactivé.'
                        )
                      }}
                      className={`w-11 h-6 rounded-full transition-colors relative ${
                        enable2FA ? 'bg-emerald-600' : 'bg-slate-200'
                      }`}
                    >
                      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        enable2FA ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </div>
                  </label>
                </div>
              </div>

              {/* Connected Devices */}
              <div className="card p-6">
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-slate-900">Appareils connectés</h2>
                  <p className="text-sm text-slate-500 mt-0.5">Sessions de connexions actives sur votre compte entreprise</p>
                </div>
                <div className="space-y-3">
                  {[
                    { device: 'macOS · Google Chrome', location: 'Dakar, Sénégal', status: 'Session active', active: true, icon: Laptop },
                    { device: 'iPhone 15 · Safari', location: 'Paris, France', status: 'Dernière connexion il y a 2 jours', active: false, icon: Smartphone },
                  ].map((session, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0">
                        <session.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">{session.device}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{session.location} · {session.status}</p>
                      </div>
                      {session.active && (
                        <span className="text-[9px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-100">
                          En cours
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowAddMemberModal(false)} />
          
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl relative z-10 overflow-hidden border border-slate-100">
            <form onSubmit={handleAddMemberSubmit}>
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-black text-slate-900">Inviter un collaborateur</h3>
                <button 
                  type="button" 
                  onClick={() => setShowAddMemberModal(false)} 
                  className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nom Complet</label>
                  <input 
                    type="text" 
                    placeholder="ex: Safiétou Kane" 
                    required
                    value={newMemberName} 
                    onChange={e => setNewMemberName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Adresse email</label>
                  <input 
                    type="email" 
                    placeholder="email@sonatel.sn" 
                    required
                    value={newMemberEmail} 
                    onChange={e => setNewMemberEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Rôle</label>
                  <select 
                    value={newMemberRole} 
                    onChange={e => setNewMemberRole(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20 cursor-pointer"
                  >
                    <option value="Administrateur">Administrateur</option>
                    <option value="Recruteur">Recruteur</option>
                    <option value="Observateur">Observateur</option>
                  </select>
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddMemberModal(false)}>
                  Annuler
                </Button>
                <Button type="submit" size="sm">
                  Envoyer l'invitation
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
