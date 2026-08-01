import { useEffect, useState } from 'react'
import {
  Search, MapPin, Eye, Sparkles, X, Save, Plus,
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import Badge, { StatusBadge } from '../../components/ui/Badge'
import Skeleton from '../../components/ui/Skeleton'
import { useToast } from '../../components/ui/Toast'
import { talentPoolService } from '../../lib/services/talent-pool'
import { profilesService } from '../../lib/services/profiles'
import { extractApiErrorMessage } from '../../lib/api'
import type { Profile, ProfileStatus } from '../../lib/types'

const statusOptions: ProfileStatus[] = ['Disponible', 'En poste', 'Placé', 'Inactif']

export default function AdminRhCvDatabase() {
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [profiles, setProfiles] = useState<Profile[]>([])

  const [selected, setSelected] = useState<Profile | null>(null)
  const [tagsInput, setTagsInput] = useState('')
  const [notesInput, setNotesInput] = useState('')
  const [statusInput, setStatusInput] = useState<ProfileStatus>('Disponible')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setLoading(true)
    talentPoolService.search({ skills: search ? [search] : undefined, limit: 60 })
      .then(res => setProfiles(res.items))
      .catch(() => setProfiles([]))
      .finally(() => setLoading(false))
  }, [search])

  const ownerName = (p: Profile) => {
    const u = typeof p.user === 'string' ? null : p.user
    return u ? `${u.firstName} ${u.lastName}` : 'Candidat'
  }

  const openDetail = async (p: Profile) => {
    const userId = typeof p.user === 'string' ? p.user : p.user._id
    try {
      const full = await profilesService.get(userId)
      setSelected(full)
      setTagsInput((full.internalTags ?? []).join(', '))
      setNotesInput(full.adminNotes ?? '')
      setStatusInput(full.status)
    } catch (err) {
      toast.error(extractApiErrorMessage(err, 'Impossible de charger ce profil'))
    }
  }

  const handleSaveAdmin = async () => {
    if (!selected) return
    const userId = typeof selected.user === 'string' ? selected.user : selected.user._id
    setSaving(true)
    try {
      const updated = await profilesService.adminUpdate(userId, {
        internalTags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
        adminNotes: notesInput || undefined,
        status: statusInput,
      })
      setSelected(updated)
      setProfiles(prev => prev.map(p => p._id === updated._id ? { ...p, status: updated.status } : p))
      toast.success('Dossier mis à jour')
    } catch (err) {
      toast.error(extractApiErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout role="admin-rh">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          Base Vivier de Talents <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">Base de données propriétaire eJobSmart de l'ensemble des dossiers de compétences</p>
      </div>

      <div className="card">
        {/* Search */}
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par compétence..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-4">
              <Skeleton variant="table" count={1} />
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Talent</th>
                  <th className="px-6 py-4">Expérience</th>
                  <th className="px-6 py-4">Compétences</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {profiles.map(c => (
                  <tr key={c._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-bold text-slate-800">{ownerName(c)}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {[c.city, c.country].filter(Boolean).join(', ') || '—'} {c.headline ? `· ${c.headline}` : ''}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 font-semibold">{c.experienceYears !== undefined ? `${c.experienceYears} ans` : '—'}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {c.skills.slice(0, 4).map(s => (
                          <span key={s} className="text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={c.status} /></td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => openDetail(c)} className="p-1.5 text-slate-400 hover:text-brand-600" title="Consulter le dossier"><Eye className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}

                {profiles.length === 0 && (
                  <tr><td colSpan={5} className="p-12 text-center text-slate-400 text-sm">Aucun profil trouvé.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Admin detail drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelected(null)} />
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <div className="pointer-events-auto w-screen max-w-md transform bg-white shadow-2xl transition-all duration-300 border-l border-slate-200 flex flex-col">
                <div className="px-6 py-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-slate-900">Dossier Talent</h2>
                    <p className="text-xs text-slate-400 mt-0.5">{ownerName(selected)}</p>
                  </div>
                  <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {selected.headline && <p className="text-sm font-semibold text-slate-800">{selected.headline}</p>}
                  {selected.bio && <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">{selected.bio}</p>}

                  {selected.skills.length > 0 && (
                    <div>
                      <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">Compétences</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selected.skills.map(s => <Badge key={s} variant="blue" size="sm">{s}</Badge>)}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-slate-100 space-y-4">
                    <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">Champs internes Admin RH</h4>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">Statut</label>
                      <select value={statusInput} onChange={e => setStatusInput(e.target.value as ProfileStatus)} className="input-field">
                        {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">Tags internes (séparés par des virgules)</label>
                      <input type="text" value={tagsInput} onChange={e => setTagsInput(e.target.value)} placeholder="ex: Haut potentiel, À recontacter" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">Notes internes</label>
                      <textarea rows={4} value={notesInput} onChange={e => setNotesInput(e.target.value)} className="input-field resize-none" placeholder="Notes visibles uniquement par l'équipe Admin RH..." />
                    </div>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1"><Plus className="w-3 h-3" /> Ces champs ne sont jamais visibles par le candidat ni par les recruteurs.</p>
                  </div>
                </div>

                <div className="p-4 border-t border-slate-200 bg-slate-50">
                  <Button fullWidth loading={saving} leftIcon={<Save className="w-4 h-4" />} onClick={handleSaveAdmin}>Enregistrer</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
