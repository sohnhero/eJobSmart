import { useEffect, useState } from 'react'
import {
  Briefcase, SlidersHorizontal,
  Plus, Trash2, Save, X,
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { useToast } from '../../components/ui/Toast'
import { sectorsService } from '../../lib/services/sectors'
import { adminService } from '../../lib/services/admin'
import { extractApiErrorMessage } from '../../lib/api'
import type { MatchingWeights, Sector } from '../../lib/types'

const WEIGHT_LABELS: { key: keyof MatchingWeights; label: string }[] = [
  { key: 'skills', label: 'Compétences' },
  { key: 'sector', label: 'Secteur' },
  { key: 'experience', label: 'Expérience' },
  { key: 'location', label: 'Localisation' },
  { key: 'education', label: "Niveau d'études" },
  { key: 'salary', label: 'Prétention salariale' },
]

function slugify(text: string): string {
  return text.toLowerCase().trim().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function PlatformSettings() {
  const toast = useToast()
  const [activeTab, setActiveTab] = useState('sectors')

  const [sectors, setSectors] = useState<Sector[]>([])
  const [loadingSectors, setLoadingSectors] = useState(true)
  const [showAddSector, setShowAddSector] = useState(false)
  const [newSectorLabel, setNewSectorLabel] = useState('')
  const [newSectorIcon, setNewSectorIcon] = useState('💼')
  const [savingSector, setSavingSector] = useState(false)

  const [jobModerationEnabled, setJobModerationEnabled] = useState(false)
  const [weights, setWeights] = useState<MatchingWeights>({ skills: 30, sector: 20, experience: 20, location: 15, education: 10, salary: 5 })
  const [loadingSettings, setLoadingSettings] = useState(true)
  const [savingSettings, setSavingSettings] = useState(false)

  useEffect(() => {
    sectorsService.list().then(setSectors).catch(() => setSectors([])).finally(() => setLoadingSectors(false))
    adminService.getSettings().then((s) => {
      setJobModerationEnabled(s.jobModerationEnabled)
      setWeights(s.matchingWeights)
    }).catch(() => {}).finally(() => setLoadingSettings(false))
  }, [])

  const handleDeleteSector = async (id: string) => {
    try {
      await sectorsService.remove(id)
      setSectors(prev => prev.filter(s => s._id !== id))
    } catch (err) {
      toast.error(extractApiErrorMessage(err))
    }
  }

  const handleAddSectorSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSectorLabel.trim()) return
    setSavingSector(true)
    try {
      const created = await sectorsService.create({ name: newSectorLabel, slug: slugify(newSectorLabel), icon: newSectorIcon, isActive: true })
      setSectors(prev => [...prev, created])
      setShowAddSector(false)
      setNewSectorLabel('')
      setNewSectorIcon('💼')
    } catch (err) {
      toast.error(extractApiErrorMessage(err, 'Impossible de créer ce secteur'))
    } finally {
      setSavingSector(false)
    }
  }

  const handleSaveSettings = async () => {
    setSavingSettings(true)
    try {
      const updated = await adminService.updateSettings({ jobModerationEnabled, matchingWeights: weights })
      setJobModerationEnabled(updated.jobModerationEnabled)
      setWeights(updated.matchingWeights)
      toast.success('Paramètres enregistrés')
    } catch (err) {
      toast.error(extractApiErrorMessage(err))
    } finally {
      setSavingSettings(false)
    }
  }

  return (
    <DashboardLayout role="admin">
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
                { id: 'sectors', label: "Secteurs d'activité", icon: Briefcase },
                { id: 'matching', label: 'Matching & modération', icon: SlidersHorizontal },
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
                {loadingSectors ? (
                  <p className="p-8 text-center text-slate-400 text-sm">Chargement…</p>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="px-6 py-3">Secteur</th>
                        <th className="px-6 py-3">Statut</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sectors.map(s => (
                        <tr key={s._id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 flex items-center gap-3">
                            <span className="text-xl">{s.icon}</span>
                            <span className="text-sm font-semibold text-slate-800">{s.name}</span>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant={s.isActive ? 'green' : 'slate'}>{s.isActive ? 'Actif' : 'Inactif'}</Badge>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button onClick={() => handleDeleteSector(s._id)} className="p-1.5 text-slate-400 hover:text-red-600 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {sectors.length === 0 && (
                        <tr><td colSpan={3} className="p-8 text-center text-slate-400 text-sm">Aucun secteur configuré.</td></tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {activeTab === 'matching' && (
            <div className="card p-6 space-y-8">
              {loadingSettings ? (
                <p className="text-sm text-slate-400 text-center py-8">Chargement…</p>
              ) : (
                <>
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="font-bold text-slate-900">Modération des offres</h2>
                        <p className="text-xs text-slate-500 mt-1 max-w-md">Lorsqu'activée, chaque offre publiée par une entreprise ou un cabinet doit être validée par un Admin RH avant d'être visible publiquement.</p>
                      </div>
                      <div
                        onClick={() => setJobModerationEnabled(v => !v)}
                        className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer flex-shrink-0 ${jobModerationEnabled ? 'bg-brand-600' : 'bg-slate-200'}`}
                      >
                        <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${jobModerationEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100">
                    <h2 className="font-bold text-slate-900 mb-1">Pondération du moteur de matching</h2>
                    <p className="text-xs text-slate-500 mb-5">Poids relatifs utilisés pour calculer le score de compatibilité candidat/offre (normalisés automatiquement).</p>
                    <div className="space-y-5">
                      {WEIGHT_LABELS.map(({ key, label }) => (
                        <div key={key}>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-sm font-semibold text-slate-700">{label}</label>
                            <span className="text-xs font-bold text-brand-600">{weights[key]}</span>
                          </div>
                          <input
                            type="range" min="0" max="100" value={weights[key]}
                            onChange={e => setWeights(prev => ({ ...prev, [key]: Number(e.target.value) }))}
                            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-600"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-100">
                    <Button loading={savingSettings} leftIcon={<Save className="w-4 h-4" />} onClick={handleSaveSettings}>Enregistrer</Button>
                  </div>
                </>
              )}
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
                <Button type="submit" size="sm" loading={savingSector}>Créer</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
