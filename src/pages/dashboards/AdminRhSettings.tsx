import { useEffect, useState } from 'react'
import { User, Shield, Save, Phone } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import SecuritySettings from '../../components/settings/SecuritySettings'
import { useToast } from '../../components/ui/Toast'
import { useAuth } from '../../context/AuthContext'
import { authService } from '../../lib/auth-service'
import { extractApiErrorMessage } from '../../lib/api'

export default function AdminRhSettings() {
  const toast = useToast()
  const { user, refreshUser } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName)
      setLastName(user.lastName)
      setPhone(user.phone ?? '')
    }
  }, [user])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await authService.updateMe({ firstName, lastName, phone: phone || undefined })
      await refreshUser()
      toast.success('Profil mis à jour avec succès !')
    } catch (err) {
      toast.error(extractApiErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout role="admin-rh">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900">Paramètres du compte</h1>
        <p className="text-slate-500 text-sm mt-0.5">Gérez vos informations personnelles et la sécurité de votre compte</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="lg:w-64 flex-shrink-0">
          <div className="card overflow-hidden">
            <nav className="flex flex-col">
              {[
                { id: 'profile', label: 'Mon profil', icon: User },
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

        <div className="flex-1 space-y-6">
          {activeTab === 'profile' && (
            <div className="card p-6">
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Prénom</label>
                    <input
                      type="text" value={firstName} onChange={e => setFirstName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Nom</label>
                    <input
                      type="text" value={lastName} onChange={e => setLastName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Email du compte</label>
                    <input type="email" disabled value={user?.email ?? ''} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none text-slate-400" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Téléphone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Button type="submit" loading={saving} leftIcon={<Save className="w-4 h-4" />}>Enregistrer les modifications</Button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'security' && <SecuritySettings />}
        </div>
      </div>
    </DashboardLayout>
  )
}
