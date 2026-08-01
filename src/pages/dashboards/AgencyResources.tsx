import { useEffect, useState } from 'react'
import {
  UserPlus, Search,
  MapPin, Briefcase,
  FileText, X, Trash2,
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import { useToast } from '../../components/ui/Toast'
import { agencyResourcesService } from '../../lib/services/agency-resources'
import { extractApiErrorMessage } from '../../lib/api'
import type { AgencyResource, Availability, ProfileStatus } from '../../lib/types'

const statusOptions: ProfileStatus[] = ['Disponible', 'En poste', 'Placé', 'Inactif']
const availabilityOptions: Availability[] = ['Immédiate', 'Préavis 1 mois', 'Préavis 3 mois', 'En poste']

const statusBadgeVariant = (status: ProfileStatus) => status === 'Disponible' ? 'green' : status === 'Placé' ? 'slate' : status === 'Inactif' ? 'red' : 'amber'

export default function AgencyResources() {
  const toast = useToast()
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'Tous les statuts' | ProfileStatus>('Tous les statuts')
  const [resources, setResources] = useState<AgencyResource[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedResource, setSelectedResource] = useState<AgencyResource | null>(null)

  const [showAddModal, setShowAddModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [newFirstName, setNewFirstName] = useState('')
  const [newLastName, setNewLastName] = useState('')
  const [newHeadline, setNewHeadline] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newExp, setNewExp] = useState('')
  const [newAvailability, setNewAvailability] = useState<Availability | ''>('')
  const [newStatus, setNewStatus] = useState<ProfileStatus>('Disponible')
  const [newSkills, setNewSkills] = useState('')

  const load = () => {
    setLoading(true)
    agencyResourcesService.mine({ q: query || undefined, status: statusFilter === 'Tous les statuts' ? undefined : statusFilter, limit: 50 })
      .then(res => setResources(res.items))
      .catch(() => setResources([]))
      .finally(() => setLoading(false))
  }

  useEffect(load, [query, statusFilter])

  const resetForm = () => {
    setNewFirstName(''); setNewLastName(''); setNewHeadline(''); setNewEmail(''); setNewPhone('')
    setNewExp(''); setNewAvailability(''); setNewStatus('Disponible'); setNewSkills('')
  }

  const handleDeleteResource = async (id: string) => {
    try {
      await agencyResourcesService.remove(id)
      setResources(prev => prev.filter(r => r._id !== id))
    } catch (err) {
      toast.error(extractApiErrorMessage(err))
    }
  }

  const handleAddResourceSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFirstName.trim() || !newLastName.trim()) return
    setSaving(true)
    try {
      const created = await agencyResourcesService.create({
        firstName: newFirstName,
        lastName: newLastName,
        headline: newHeadline || undefined,
        email: newEmail || undefined,
        phone: newPhone || undefined,
        experienceYears: newExp ? Number(newExp) : undefined,
        availability: newAvailability || undefined,
        status: newStatus,
        skills: newSkills.split(',').map(s => s.trim()).filter(Boolean),
      })
      setResources(prev => [created, ...prev])
      setShowAddModal(false)
      resetForm()
      toast.success('Ressource ajoutée au portefeuille')
    } catch (err) {
      toast.error(extractApiErrorMessage(err, "Impossible d'ajouter cette ressource"))
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout role="agency">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Portefeuille RH</h1>
          <p className="text-slate-500 text-sm mt-0.5">Gérez vos talents et suivez leur statut de placement</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => setShowAddModal(true)} leftIcon={<UserPlus className="w-4 h-4" />}>
            Ajouter une ressource
          </Button>
        </div>
      </div>

      <div className="card">
        {/* Search & Filter */}
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher une ressource..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as typeof statusFilter)}
              className="bg-white border border-slate-200 rounded-xl text-sm px-4 py-2 outline-none cursor-pointer"
            >
              <option value="Tous les statuts">Tous les statuts</option>
              {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Ressource</th>
                <th className="px-6 py-4">Spécialité & Exp</th>
                <th className="px-6 py-4">Disponibilité</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-400 text-sm">Chargement…</td></tr>
              ) : resources.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-400 text-sm">Aucune ressource dans le portefeuille</td></tr>
              ) : (
                resources.map(res => (
                  <tr key={res._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={`${res.firstName} ${res.lastName}`} size="sm" />
                        <p className="text-sm font-bold text-slate-800">{res.firstName} {res.lastName}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-700 font-medium">{res.headline ?? '—'}</p>
                      {res.experienceYears !== undefined && (
                        <p className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Briefcase className="w-3 h-3" /> {res.experienceYears} ans d'expérience
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-slate-500">{res.availability ?? '—'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={statusBadgeVariant(res.status)}>{res.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => setSelectedResource(res)} title="Voir le dossier" className="p-2 text-slate-400 hover:text-brand-600 transition-colors">
                          <FileText className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteResource(res._id)} title="Supprimer" className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Talent Detail Drawer */}
      {selectedResource && (
        <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedResource(null)} />

            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <div className="pointer-events-auto w-screen max-w-md transform bg-white shadow-2xl transition-all duration-300 border-l border-slate-200 flex flex-col">
                <div className="px-6 py-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-slate-900">Dossier Ressource</h2>
                    <p className="text-xs text-slate-400 mt-0.5">{selectedResource.headline}</p>
                  </div>
                  <button onClick={() => setSelectedResource(null)} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  <div className="flex items-center gap-4">
                    <Avatar name={`${selectedResource.firstName} ${selectedResource.lastName}`} size="lg" />
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">{selectedResource.firstName} {selectedResource.lastName}</h3>
                      {selectedResource.experienceYears !== undefined && <p className="text-xs text-slate-500">{selectedResource.experienceYears} ans d'expérience</p>}
                      <div className="flex flex-col gap-0.5 mt-1 text-xs text-slate-400">
                        {selectedResource.email && <span>Email: {selectedResource.email}</span>}
                        {selectedResource.phone && <span>Tél: {selectedResource.phone}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Disponibilité</p>
                      <p className="text-sm font-black text-brand-600 mt-0.5">{selectedResource.availability ?? '—'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Statut</p>
                      <Badge variant={statusBadgeVariant(selectedResource.status)} className="mt-0.5">{selectedResource.status}</Badge>
                    </div>
                  </div>

                  {selectedResource.notes && (
                    <div>
                      <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">Notes internes</h4>
                      <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                        {selectedResource.notes}
                      </p>
                    </div>
                  )}

                  {selectedResource.skills.length > 0 && (
                    <div>
                      <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2.5">Compétences</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedResource.skills.map(s => (
                          <span key={s} className="px-2.5 py-1 bg-brand-50 text-brand-700 text-xs font-semibold rounded-lg border border-brand-100">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-slate-200 bg-slate-50">
                  <Button fullWidth onClick={() => setSelectedResource(null)}>Fermer le dossier</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Resource Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />

          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative z-10 overflow-hidden border border-slate-100 max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleAddResourceSubmit}>
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between sticky top-0">
                <h3 className="font-black text-slate-900">Ajouter un candidat</h3>
                <button type="button" onClick={() => setShowAddModal(false)} className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Prénom</label>
                    <input type="text" required value={newFirstName} onChange={e => setNewFirstName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nom</label>
                    <input type="text" required value={newLastName} onChange={e => setNewLastName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Titre du poste / Spécialité</label>
                  <input type="text" placeholder="ex: Chef de Projet, UX Designer..." value={newHeadline} onChange={e => setNewHeadline(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Email</label>
                    <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Téléphone</label>
                    <input type="tel" value={newPhone} onChange={e => setNewPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Années d'expérience</label>
                    <input type="number" min="0" value={newExp} onChange={e => setNewExp(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Disponibilité</label>
                    <select value={newAvailability} onChange={e => setNewAvailability(e.target.value as Availability)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20 cursor-pointer">
                      <option value="">—</option>
                      {availabilityOptions.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Statut initial</label>
                  <select value={newStatus} onChange={e => setNewStatus(e.target.value as ProfileStatus)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20 cursor-pointer">
                    {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Compétences (séparées par des virgules)</label>
                  <input type="text" placeholder="React, Node.js, TypeScript" value={newSkills} onChange={e => setNewSkills(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20" />
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddModal(false)}>Annuler</Button>
                <Button type="submit" size="sm" loading={saving}>Créer la ressource</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
