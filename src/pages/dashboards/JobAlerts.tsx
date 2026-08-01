import { useState, useEffect } from 'react'
import {
  Bell, Plus, Trash2,
  MapPin, Briefcase, Filter,
  Mail, X
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../components/ui/Toast'
import { jobAlertsService } from '../../lib/services/job-alerts'
import { sectorsService } from '../../lib/services/sectors'
import { extractApiErrorMessage } from '../../lib/api'
import type { ContractType, JobAlert, Sector } from '../../lib/types'

const contractOptions: ContractType[] = ['CDI', 'CDD', 'Freelance', 'Stage', 'Alternance', 'Intérim']

export default function JobAlerts() {
  const { user } = useAuth()
  const toast = useToast()
  const [alerts, setAlerts] = useState<JobAlert[]>([])
  const [sectors, setSectors] = useState<Sector[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    jobAlertsService.list().then(setAlerts).catch(() => setAlerts([])).finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    void sectorsService.list().then(setSectors).catch(() => setSectors([]))
  }, [])

  const sectorName = (id: string) => sectors.find(s => s._id === id)?.name ?? id

  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [newAlertLabel, setNewAlertLabel] = useState('')
  const [newAlertKeywords, setNewAlertKeywords] = useState('')
  const [newAlertSectors, setNewAlertSectors] = useState<string[]>([])
  const [newAlertCity, setNewAlertCity] = useState('')
  const [newAlertContracts, setNewAlertContracts] = useState<ContractType[]>([])

  const handleToggleStatus = async (alert: JobAlert) => {
    try {
      const updated = await jobAlertsService.update(alert._id, { isActive: !alert.isActive })
      setAlerts(prev => prev.map(a => a._id === alert._id ? updated : a))
    } catch (err) {
      toast.error(extractApiErrorMessage(err))
    }
  }

  const handleDeleteAlert = async (id: string) => {
    try {
      await jobAlertsService.remove(id)
      setAlerts(prev => prev.filter(a => a._id !== id))
    } catch (err) {
      toast.error(extractApiErrorMessage(err))
    }
  }

  const resetForm = () => {
    setNewAlertLabel(''); setNewAlertKeywords(''); setNewAlertSectors([]); setNewAlertCity(''); setNewAlertContracts([])
  }

  const handleCreateAlertSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const created = await jobAlertsService.create({
        name: newAlertLabel || undefined,
        keywords: newAlertKeywords || undefined,
        sectors: newAlertSectors,
        contractTypes: newAlertContracts,
        city: newAlertCity || undefined,
      })
      setAlerts(prev => [created, ...prev])
      setShowCreateModal(false)
      resetForm()
      toast.success('Alerte créée avec succès !')
    } catch (err) {
      toast.error(extractApiErrorMessage(err, "Impossible de créer l'alerte"))
    } finally {
      setSaving(false)
    }
  }

  const toggleContract = (ct: ContractType) => {
    setNewAlertContracts(prev => prev.includes(ct) ? prev.filter(c => c !== ct) : [...prev, ct])
  }
  const toggleSector = (id: string) => {
    setNewAlertSectors(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])
  }

  return (
    <DashboardLayout role="candidate">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Mes Alertes Emploi</h1>
          <p className="text-slate-500 text-sm mt-0.5">Soyez informé dès qu'une offre correspond à vos critères</p>
        </div>
        <Button size="sm" onClick={() => setShowCreateModal(true)} leftIcon={<Plus className="w-4 h-4" />}>
          Créer une alerte
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main: Alerts List */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="card p-12 text-center text-slate-400 text-sm">Chargement…</div>
          ) : (
            <>
              {alerts.map(alert => (
                <div key={alert._id} className={`card p-5 transition-all border-l-4 ${alert.isActive ? 'border-l-brand-600' : 'border-l-slate-200'}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${alert.isActive ? 'bg-brand-50 text-brand-600' : 'bg-slate-100 text-slate-400'}`}>
                        <Bell className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className={`font-bold text-lg ${alert.isActive ? 'text-slate-900' : 'text-slate-400'}`}>{alert.name || alert.keywords || 'Alerte sans nom'}</h3>
                        <p className="text-xs text-slate-400">Résumé hebdomadaire par email</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleDeleteAlert(alert._id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div
                        onClick={() => handleToggleStatus(alert)}
                        className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${alert.isActive ? 'bg-brand-600' : 'bg-slate-200'}`}
                      >
                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${alert.isActive ? 'translate-x-5' : 'translate-x-0.5'}`} />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {alert.sectors.map(s => (
                      <div key={typeof s === 'string' ? s : s._id} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-500">
                        <Briefcase className="w-3 h-3" /> {typeof s === 'string' ? sectorName(s) : s.name}
                      </div>
                    ))}
                    {alert.city && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-500">
                        <MapPin className="w-3 h-3" /> {alert.city}
                      </div>
                    )}
                    {alert.contractTypes.map(ct => (
                      <div key={ct} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-500">
                        <Filter className="w-3 h-3" /> {ct}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {alerts.length === 0 && (
                <div className="card p-12 text-center">
                  <Bell className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <h3 className="font-bold text-slate-900 text-lg mb-2">Aucune alerte configurée</h3>
                  <p className="text-sm text-slate-500 mb-6">Ne manquez plus aucune opportunité. Créez votre première alerte dès maintenant.</p>
                  <Button onClick={() => setShowCreateModal(true)} leftIcon={<Plus className="w-4 h-4" />}>Créer une alerte</Button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-bold text-slate-900 mb-4">Canal de réception</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Mail className="w-4 h-4" /></div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Email</p>
                  <p className="text-[10px] text-slate-400">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6 bg-gradient-to-br from-brand-900 to-brand-700 text-white">
            <h3 className="font-bold mb-2">Comment ça marche ?</h3>
            <p className="text-xs text-blue-100 leading-relaxed">
              Chaque semaine, un résumé des offres correspondant à vos alertes actives vous est envoyé par email.
            </p>
          </div>
        </div>
      </div>

      {/* Create Alert Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />

          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative z-10 overflow-hidden border border-slate-100 max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleCreateAlertSubmit}>
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between sticky top-0">
                <h3 className="font-black text-slate-900">Créer une alerte emploi</h3>
                <button type="button" onClick={() => setShowCreateModal(false)} className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Nom de l'alerte</label>
                  <input
                    type="text"
                    placeholder="ex: React Developer, Chef de Projet..."
                    value={newAlertLabel}
                    onChange={e => setNewAlertLabel(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Mots-clés</label>
                  <input
                    type="text"
                    placeholder="ex: React, Node.js..."
                    value={newAlertKeywords}
                    onChange={e => setNewAlertKeywords(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Localisation</label>
                  <input
                    type="text"
                    placeholder="ex: Dakar"
                    value={newAlertCity}
                    onChange={e => setNewAlertCity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Secteurs</label>
                  <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                    {sectors.map(s => (
                      <button type="button" key={s._id} onClick={() => toggleSector(s._id)}
                        className={`text-xs px-2.5 py-1.5 rounded-lg font-medium border transition-colors ${newAlertSectors.includes(s._id) ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-600 border-slate-200'}`}>
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Types de contrat</label>
                  <div className="flex flex-wrap gap-1.5">
                    {contractOptions.map(ct => (
                      <button type="button" key={ct} onClick={() => toggleContract(ct)}
                        className={`text-xs px-2.5 py-1.5 rounded-lg font-medium border transition-colors ${newAlertContracts.includes(ct) ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-600 border-slate-200'}`}>
                        {ct}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowCreateModal(false)}>Annuler</Button>
                <Button type="submit" size="sm" loading={saving}>Enregistrer</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
