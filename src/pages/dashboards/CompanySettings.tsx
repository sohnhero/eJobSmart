import { useEffect, useState } from 'react'
import {
  Building2, Users, Shield, Globe,
  Upload, Save, Plus, Trash2, X, Phone,
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import Avatar from '../../components/ui/Avatar'
import SecuritySettings from '../../components/settings/SecuritySettings'
import { useToast } from '../../components/ui/Toast'
import { useAuth } from '../../context/AuthContext'
import { authService } from '../../lib/auth-service'
import { teamService } from '../../lib/services/team'
import { uploadsService } from '../../lib/services/uploads'
import { extractApiErrorMessage } from '../../lib/api'
import type { User } from '../../lib/types'

export default function CompanySettings() {
  const toast = useToast()
  const { user, refreshUser } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')

  // Profile Form State
  const [companyName, setCompanyName] = useState('')
  const [companyLogo, setCompanyLogo] = useState('')
  const [phone, setPhone] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)

  useEffect(() => {
    if (user) {
      setCompanyName(user.companyName ?? '')
      setCompanyLogo(user.companyLogo ?? '')
      setPhone(user.phone ?? '')
    }
  }, [user])

  const isTeamMember = !!user?.organizationOwner

  // Team Management State
  const [teamList, setTeamList] = useState<User[]>([])
  const [loadingTeam, setLoadingTeam] = useState(true)
  const [showAddMemberModal, setShowAddMemberModal] = useState(false)
  const [newMemberFirstName, setNewMemberFirstName] = useState('')
  const [newMemberLastName, setNewMemberLastName] = useState('')
  const [newMemberEmail, setNewMemberEmail] = useState('')
  const [inviting, setInviting] = useState(false)

  useEffect(() => {
    teamService.list().then(setTeamList).catch(() => setTeamList([])).finally(() => setLoadingTeam(false))
  }, [])

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingProfile(true)
    try {
      await authService.updateMe({ companyName, companyLogo: companyLogo || undefined, phone: phone || undefined })
      await refreshUser()
      toast.success("Profil de l'entreprise mis à jour avec succès !")
    } catch (err) {
      toast.error(extractApiErrorMessage(err))
    } finally {
      setSavingProfile(false)
    }
  }

  const handleLogoUpload = async (file: File | null) => {
    if (!file) return
    setUploadingLogo(true)
    try {
      const url = await uploadsService.uploadLogo(file)
      setCompanyLogo(url)
    } catch (err) {
      toast.error(extractApiErrorMessage(err, "Impossible de téléverser le logo"))
    } finally {
      setUploadingLogo(false)
    }
  }

  const handleDeleteMember = async (id: string, name: string) => {
    try {
      await teamService.deactivate(id)
      setTeamList(prev => prev.map(m => m._id === id ? { ...m, isActive: false } : m))
      toast.info(`Membre ${name} désactivé.`)
    } catch (err) {
      toast.error(extractApiErrorMessage(err))
    }
  }

  const handleAddMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setInviting(true)
    try {
      const created = await teamService.invite({ firstName: newMemberFirstName, lastName: newMemberLastName, email: newMemberEmail })
      setTeamList(prev => [...prev, created])
      setShowAddMemberModal(false)
      setNewMemberFirstName(''); setNewMemberLastName(''); setNewMemberEmail('')
      toast.success(`Invitation envoyée à ${newMemberEmail} !`)
    } catch (err) {
      toast.error(extractApiErrorMessage(err, "Impossible d'inviter ce membre"))
    } finally {
      setInviting(false)
    }
  }

  return (
    <DashboardLayout role="company">
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
                { id: 'team', label: "Gestion d'équipe", icon: Users },
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
                  {companyLogo ? (
                    <img src={companyLogo} alt={companyName} className="w-16 h-16 rounded-2xl object-cover" />
                  ) : (
                    <Avatar name={companyName || 'Entreprise'} size="xl" />
                  )}
                  <label className="absolute -bottom-1 -right-1 p-2 bg-white rounded-full shadow-lg border border-slate-100 text-brand-600 hover:text-brand-800 transition-colors cursor-pointer">
                    <input type="file" accept="image/png,image/jpeg" className="hidden" onChange={e => void handleLogoUpload(e.target.files?.[0] ?? null)} />
                    <Upload className="w-4 h-4" />
                  </label>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Logo de l'entreprise</h2>
                  <p className="text-sm text-slate-500 mt-1">{uploadingLogo ? 'Téléversement…' : 'PNG ou JPG'}</p>
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
                    <label className="text-xs font-bold text-slate-500 uppercase">Email du compte</label>
                    <input type="email" disabled value={user?.email ?? ''} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none text-slate-400" />
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
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">URL du logo</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="url"
                        value={companyLogo}
                        onChange={e => setCompanyLogo(e.target.value)}
                        placeholder="https://..."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button type="submit" loading={savingProfile} leftIcon={<Save className="w-4 h-4" />}>Enregistrer les modifications</Button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="card">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-slate-900">Membres de l'équipe</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isTeamMember ? "Seul le compte principal peut gérer l'équipe" : 'Donnez accès aux recruteurs de votre organisation'}
                  </p>
                </div>
                {!isTeamMember && (
                  <Button size="sm" onClick={() => setShowAddMemberModal(true)} leftIcon={<Plus className="w-4 h-4" />}>Ajouter un membre</Button>
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="px-6 py-4">Membre</th>
                      <th className="px-6 py-4">Statut</th>
                      <th className="px-6 py-4">Email</th>
                      {!isTeamMember && <th className="px-6 py-4 text-right">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loadingTeam ? (
                      <tr><td colSpan={4} className="p-8 text-center text-slate-400 text-sm">Chargement…</td></tr>
                    ) : (
                      teamList.map(member => (
                        <tr key={member._id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <Avatar name={`${member.firstName} ${member.lastName}`} size="sm" />
                              <div>
                                <p className="text-sm font-bold text-slate-800">{member.firstName} {member.lastName}</p>
                                {!member.organizationOwner && <span className="text-[10px] text-brand-600 font-semibold">Compte principal</span>}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${member.isActive ? 'text-emerald-700 bg-emerald-50' : 'text-slate-500 bg-slate-100'}`}>
                              {member.isActive ? 'Actif' : 'Désactivé'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500">{member.email}</td>
                          {!isTeamMember && (
                            <td className="px-6 py-4 text-right">
                              {member.organizationOwner && member.isActive && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteMember(member._id, `${member.firstName} ${member.lastName}`)}
                                  className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                                  title="Désactiver le membre"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </td>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'security' && <SecuritySettings />}
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
                <button type="button" onClick={() => setShowAddMemberModal(false)} className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Prénom</label>
                    <input type="text" required value={newMemberFirstName} onChange={e => setNewMemberFirstName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nom</label>
                    <input type="text" required value={newMemberLastName} onChange={e => setNewMemberLastName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Adresse email</label>
                  <input
                    type="email"
                    placeholder="email@entreprise.sn"
                    required
                    value={newMemberEmail}
                    onChange={e => setNewMemberEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
                <p className="text-[11px] text-slate-400">Un mot de passe temporaire sera généré et envoyé par email au collaborateur.</p>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddMemberModal(false)}>
                  Annuler
                </Button>
                <Button type="submit" size="sm" loading={inviting}>
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
