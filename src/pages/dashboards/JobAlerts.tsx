import { useState, useEffect } from 'react'
import {
  Bell, Plus, Trash2, Edit3,
  Search, MapPin, Briefcase, Filter,
  CheckCircle, Mail, Smartphone, X
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { sectors } from '../../data/sectors'

interface AlertItem {
  id: number
  label: string
  sector: string
  location: string
  contract: string
  frequency: string
  channels: string[]
  status: boolean
}

export default function JobAlerts() {
  const [alerts, setAlerts] = useState<AlertItem[]>(() => {
    const saved = localStorage.getItem('job_alerts_list')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        // ignore
      }
    }
    return [
      { id: 1, label: 'React Developer', sector: 'Tech', location: 'Dakar', contract: 'CDI', frequency: 'Quotidienne', channels: ['Email', 'Push'], status: true },
      { id: 2, label: 'UX Designer Senior', sector: 'Tech', location: 'Télétravail', contract: 'Tous', frequency: 'Hebdomadaire', channels: ['Email'], status: true },
      { id: 3, label: 'Chef de Projet BTP', sector: 'BTP', location: 'Sénégal', contract: 'Freelance', frequency: 'Instantanée', channels: ['Push'], status: false },
    ]
  })

  useEffect(() => {
    localStorage.setItem('job_alerts_list', JSON.stringify(alerts))
    const hasActive = alerts.some(a => a.status)
    localStorage.setItem('alerts_configured', hasActive ? 'true' : 'false')
  }, [alerts])

  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newAlertLabel, setNewAlertLabel] = useState('')
  const [newAlertSector, setNewAlertSector] = useState('Tech')
  const [newAlertLocation, setNewAlertLocation] = useState('Dakar')
  const [newAlertContract, setNewAlertContract] = useState('CDI')
  const [newAlertFrequency, setNewAlertFrequency] = useState('Quotidienne')
  const [newAlertChannels, setNewAlertChannels] = useState<string[]>(['Email'])

  const handleToggleStatus = (id: number) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: !a.status } : a))
  }

  const handleDeleteAlert = (id: number) => {
    setAlerts(prev => prev.filter(a => a.id !== id))
  }

  const handleCreateAlertSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAlertLabel.trim()) return

    const newAlert: AlertItem = {
      id: Date.now(),
      label: newAlertLabel,
      sector: newAlertSector,
      location: newAlertLocation,
      contract: newAlertContract,
      frequency: newAlertFrequency,
      channels: newAlertChannels,
      status: true
    }

    setAlerts(prev => [newAlert, ...prev])
    setShowCreateModal(false)
    // Reset values
    setNewAlertLabel('')
    setNewAlertSector('Tech')
    setNewAlertLocation('Dakar')
    setNewAlertContract('CDI')
    setNewAlertFrequency('Quotidienne')
    setNewAlertChannels(['Email'])
  }

  const handleChannelToggle = (channel: string) => {
    setNewAlertChannels(prev => 
      prev.includes(channel) ? prev.filter(c => c !== channel) : [...prev, channel]
    )
  }

  return (
    <DashboardLayout role="candidate" userName="Amadou Diallo">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Mes Alertes Emploi</h1>
          <p className="text-slate-500 text-sm mt-0.5">Soyez le premier informé dès qu'une offre correspond à vos critères</p>
        </div>
        <Button size="sm" onClick={() => setShowCreateModal(true)} leftIcon={<Plus className="w-4 h-4" />}>
          Créer une alerte
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main: Alerts List */}
        <div className="lg:col-span-2 space-y-4">
          {alerts.map(alert => (
            <div key={alert.id} className={`card p-5 transition-all border-l-4 ${alert.status ? 'border-l-brand-600' : 'border-l-slate-200'}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${alert.status ? 'bg-brand-50 text-brand-600' : 'bg-slate-100 text-slate-400'}`}>
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg ${alert.status ? 'text-slate-900' : 'text-slate-400'}`}>{alert.label}</h3>
                    <p className="text-xs text-slate-400">{alert.frequency} · {alert.channels.join(', ')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleDeleteAlert(alert.id)}
                    className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div 
                    onClick={() => handleToggleStatus(alert.id)}
                    className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${alert.status ? 'bg-brand-600' : 'bg-slate-200'}`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${alert.status ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-500">
                  <Briefcase className="w-3 h-3" /> {alert.sector}
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-500">
                  <MapPin className="w-3 h-3" /> {alert.location}
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-500">
                  <Filter className="w-3 h-3" /> {alert.contract}
                </div>
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
        </div>

        {/* Sidebar: Channels & Tips */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-bold text-slate-900 mb-4">Canaux de réception</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Mail className="w-4 h-4" /></div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Email</p>
                    <p className="text-[10px] text-slate-400">amadou@gmail.com</p>
                  </div>
                </div>
                <Badge variant="green">Vérifié</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Smartphone className="w-4 h-4" /></div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Notifications Push</p>
                    <p className="text-[10px] text-slate-400">Sur iPhone 15 Pro</p>
                  </div>
                </div>
                <button className="text-xs font-bold text-brand-600 hover:underline">Désactiver</button>
              </div>
            </div>
          </div>

          <div className="card p-6 bg-gradient-to-br from-brand-900 to-brand-700 text-white">
            <h3 className="font-bold mb-2">Conseil d'expert 💡</h3>
            <p className="text-xs text-blue-100 leading-relaxed">
              Les candidats qui répondent dans les premières 24h ont 2x plus de chances d'être contactés. Activez les notifications <strong>Instantanées</strong> pour vos secteurs prioritaires.
            </p>
          </div>
        </div>
      </div>

      {/* Create Alert Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative z-10 overflow-hidden border border-slate-100">
            <form onSubmit={handleCreateAlertSubmit}>
              {/* Header */}
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-black text-slate-900">Créer une alerte emploi</h3>
                <button type="button" onClick={() => setShowCreateModal(false)} className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Titre de l'alerte</label>
                  <input 
                    type="text" 
                    placeholder="ex: React Developer, Chef de Projet..."
                    required
                    value={newAlertLabel}
                    onChange={e => setNewAlertLabel(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Secteur</label>
                    <select 
                      value={newAlertSector}
                      onChange={e => setNewAlertSector(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20 cursor-pointer"
                    >
                      {sectors.map(s => (
                        <option key={s.id} value={s.name}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Localisation</label>
                    <input 
                      type="text" 
                      placeholder="ex: Dakar, Télétravail..."
                      value={newAlertLocation}
                      onChange={e => setNewAlertLocation(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Contrat souhaité</label>
                    <select 
                      value={newAlertContract}
                      onChange={e => setNewAlertContract(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20 cursor-pointer"
                    >
                      <option value="CDI">CDI</option>
                      <option value="CDD">CDD</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Stage">Stage</option>
                      <option value="Alternance">Alternance</option>
                      <option value="Tous">Tous</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Fréquence</label>
                    <select 
                      value={newAlertFrequency}
                      onChange={e => setNewAlertFrequency(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20 cursor-pointer"
                    >
                      <option value="Instantanée">Instantanée</option>
                      <option value="Quotidienne">Quotidienne</option>
                      <option value="Hebdomadaire">Hebdomadaire</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Canaux de notification</label>
                  <div className="flex gap-4">
                    {['Email', 'Push'].map(ch => (
                      <label key={ch} className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                        <input 
                          type="checkbox"
                          checked={newAlertChannels.includes(ch)}
                          onChange={() => handleChannelToggle(ch)}
                          className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                        />
                        {ch}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowCreateModal(false)}>Annuler</Button>
                <Button type="submit" size="sm">Enregistrer</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
