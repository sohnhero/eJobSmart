import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, MapPin,
  Briefcase, X, Eye, MessageSquare, BookmarkPlus,
  TrendingUp, UserCheck,
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import { StatusBadge } from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import { useToast } from '../../components/ui/Toast'
import { talentPoolService } from '../../lib/services/talent-pool'
import { sectorsService } from '../../lib/services/sectors'
import { extractApiErrorMessage } from '../../lib/api'
import type { Availability, Profile, Sector } from '../../lib/types'

const availabilities: (Availability | 'Tous')[] = ['Tous', 'Immédiate', 'Préavis 1 mois', 'Préavis 3 mois', 'En poste']
const experienceRanges = ['Tous', '0-2 ans', '3-5 ans', '6-10 ans', '10+ ans']

interface CVDatabaseProps {
  role?: 'company' | 'admin'
}

export default function CVDatabase({ role = 'company' }: CVDatabaseProps) {
  const navigate = useNavigate()
  const toast = useToast()
  const [query, setQuery] = useState('')
  const [availability, setAvailability] = useState<Availability | 'Tous'>('Tous')
  const [experience, setExperience] = useState('Tous')
  const [sectorId, setSectorId] = useState('Tous')
  const [sectors, setSectors] = useState<Sector[]>([])
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [savedProfiles, setSavedProfiles] = useState<Set<string>>(new Set())
  const [requestedIds, setRequestedIds] = useState<Set<string>>(new Set())
  const [selected, setSelected] = useState<Profile | null>(null)

  useEffect(() => {
    void sectorsService.list().then(setSectors).catch(() => setSectors([]))
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    const [min, max] = experience === '0-2 ans' ? [0, 2] : experience === '3-5 ans' ? [3, 5] : experience === '6-10 ans' ? [6, 10] : experience === '10+ ans' ? [10, undefined] : [undefined, undefined]
    talentPoolService.search({
      skills: query ? [query] : undefined,
      sector: sectorId === 'Tous' ? undefined : sectorId,
      availability: availability === 'Tous' ? undefined : availability,
      experienceYearsMin: min,
      limit: 60,
    }).then((res) => {
      if (cancelled) return
      setProfiles(max !== undefined ? res.items.filter(p => (p.experienceYears ?? 0) <= max) : res.items)
    }).catch(() => { if (!cancelled) setProfiles([]) }).finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [query, sectorId, availability, experience])

  const toggleSave = (id: string) => {
    setSavedProfiles(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const requestContact = async (profile: Profile) => {
    const candidateId = typeof profile.user === 'string' ? profile.user : profile.user._id
    try {
      await talentPoolService.createRequest(candidateId, `Intéressé par votre profil "${profile.headline ?? ''}"`)
      setRequestedIds(prev => new Set(prev).add(profile._id))
      toast.success('Demande de mise en relation envoyée — un Admin RH va la valider')
    } catch (err) {
      toast.error(extractApiErrorMessage(err, "Impossible d'envoyer la demande"))
    }
  }

  const ownerName = (profile: Profile) => {
    const u = typeof profile.user === 'string' ? null : profile.user
    return u ? `${u.firstName} ${u.lastName}` : 'Candidat'
  }

  return (
    <DashboardLayout role={role}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Base CV Propriétaire</h1>
          <p className="text-slate-500 text-sm mt-0.5">{profiles.length} profils disponibles</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Profils affichés', value: profiles.length, icon: UserCheck, color: 'text-brand-600', bg: 'bg-brand-50' },
          { label: 'Disponibles', value: profiles.filter(c => c.status === 'Disponible').length, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'En poste', value: profiles.filter(c => c.status === 'En poste').length, icon: Briefcase, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Profils sauvegardés', value: savedProfiles.size, icon: BookmarkPlus, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map(stat => (
          <div key={stat.label} className="card p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xl font-black text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-400">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="card p-4 mb-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Chercher par compétence, titre..."
              value={query} onChange={e => setQuery(e.target.value)}
              className="input-field pl-9 py-2.5"
            />
            {query && <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-slate-400" /></button>}
          </div>
          <select value={availability} onChange={e => setAvailability(e.target.value as typeof availability)} className="input-field py-2.5 w-auto">
            {availabilities.map(a => <option key={a} value={a}>{a === 'Tous' ? 'Disponibilité' : a}</option>)}
          </select>
          <select value={experience} onChange={e => setExperience(e.target.value)} className="input-field py-2.5 w-auto">
            {experienceRanges.map(e => <option key={e} value={e}>{e === 'Tous' ? 'Expérience' : e}</option>)}
          </select>
          <select value={sectorId} onChange={e => setSectorId(e.target.value)} className="input-field py-2.5 w-auto">
            <option value="Tous">Secteur</option>
            {sectors.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-slate-400 text-center py-16">Chargement…</p>
      ) : (
        <>
          <p className="text-sm text-slate-500 mb-4">
            <span className="font-semibold text-slate-900">{profiles.length}</span> profil{profiles.length > 1 ? 's' : ''} correspondant{profiles.length > 1 ? 's' : ''}
          </p>

          {/* Candidates grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {profiles.map(c => (
              <div key={c._id} className="card p-5 hover:-translate-y-0.5 transition-all duration-200">
                <div className="flex items-start gap-3 mb-4">
                  <Avatar name={ownerName(c)} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{ownerName(c)}</p>
                        {c.headline && <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{c.headline}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <StatusBadge status={c.status} />
                      {c.city && <span className="text-xs text-slate-400 flex items-center gap-1"><MapPin className="w-2.5 h-2.5" />{c.city}</span>}
                    </div>
                  </div>
                </div>

                {c.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {c.skills.slice(0, 4).map(s => (
                      <span key={s} className="text-[10px] px-2 py-0.5 bg-brand-50 text-brand-700 rounded-full font-medium border border-brand-100">{s}</span>
                    ))}
                    {c.skills.length > 4 && <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full font-medium">+{c.skills.length - 4}</span>}
                  </div>
                )}

                <div className="flex items-center gap-4 text-xs text-slate-500 mb-4 pt-3 border-t border-slate-100">
                  {c.experienceYears !== undefined && <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{c.experienceYears} ans</span>}
                  {c.availability && <span className="flex items-center gap-1">{c.availability}</span>}
                  {c.salaryExpectationMax && <span className="ml-auto font-semibold text-slate-700">{c.salaryExpectationMax.toLocaleString('fr-FR')} {c.currency}</span>}
                </div>

                <div className="flex items-center gap-2">
                  <Button size="sm" className="flex-1" onClick={() => setSelected(c)}>
                    <Eye className="w-3.5 h-3.5" /> Voir profil
                  </Button>
                  <button
                    onClick={() => requestContact(c)}
                    disabled={requestedIds.has(c._id)}
                    className="p-2 rounded-lg border border-slate-200 hover:border-brand-300 hover:bg-brand-50 transition-colors disabled:opacity-50"
                    title="Demander la mise en relation"
                  >
                    <MessageSquare className="w-4 h-4 text-slate-500" />
                  </button>
                  <button
                    onClick={() => toggleSave(c._id)}
                    className={`p-2 rounded-lg border transition-colors ${savedProfiles.has(c._id) ? 'border-brand-300 bg-brand-50 text-brand-600' : 'border-slate-200 hover:border-brand-300 hover:bg-brand-50 text-slate-500'}`}
                    title="Sauvegarder"
                  >
                    <BookmarkPlus className={`w-4 h-4 ${savedProfiles.has(c._id) ? 'fill-brand-600' : ''}`} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {profiles.length === 0 && (
            <div className="card p-16 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <Search className="w-8 h-8" />
                </div>
              </div>
              <h3 className="font-semibold text-slate-900 text-lg mb-2">Aucun profil trouvé</h3>
              <p className="text-sm text-slate-500">Essayez de modifier vos critères de recherche</p>
            </div>
          )}
        </>
      )}

      {/* Candidate detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-900">Profil complet</h3>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-start gap-4 mb-5">
              <Avatar name={ownerName(selected)} size="lg" />
              <div>
                <p className="font-bold text-slate-900">{ownerName(selected)}</p>
                {selected.headline && <p className="text-sm text-slate-500 mt-0.5">{selected.headline}</p>}
                <div className="flex items-center gap-2 mt-2">
                  <StatusBadge status={selected.status} />
                </div>
              </div>
            </div>

            {selected.bio && (
              <p className="text-sm text-slate-600 bg-slate-50 rounded-xl p-3.5 mb-5 leading-relaxed">{selected.bio}</p>
            )}

            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { label: 'Localisation', value: [selected.city, selected.country].filter(Boolean).join(', ') || '—' },
                { label: 'Disponibilité', value: selected.availability || '—' },
                { label: 'Expérience', value: selected.experienceYears !== undefined ? `${selected.experienceYears} ans` : '—' },
                { label: 'Prétention salariale', value: selected.salaryExpectationMax ? `${selected.salaryExpectationMax.toLocaleString('fr-FR')} ${selected.currency}` : '—' },
              ].map(item => (
                <div key={item.label} className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400">{item.label}</p>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>

            {selected.skills.length > 0 && (
              <div className="mb-5">
                <p className="text-sm font-semibold text-slate-700 mb-2">Compétences</p>
                <div className="flex flex-wrap gap-1.5">
                  {selected.skills.map(s => (
                    <span key={s} className="text-xs px-2.5 py-1 bg-brand-50 text-brand-700 rounded-lg font-medium border border-brand-100">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {selected.contractTypesSought.length > 0 && (
              <div className="mb-5">
                <p className="text-sm font-semibold text-slate-700 mb-2">Types de contrats souhaités</p>
                <div className="flex gap-2 flex-wrap">
                  {selected.contractTypesSought.map(ct => (
                    <span key={ct} className="text-xs px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg font-medium">{ct}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button fullWidth disabled={requestedIds.has(selected._id)} onClick={() => { void requestContact(selected) }}>
                <MessageSquare className="w-4 h-4" /> {requestedIds.has(selected._id) ? 'Demande envoyée' : 'Demander la mise en relation'}
              </Button>
              <Button fullWidth variant="secondary" onClick={() => toggleSave(selected._id)}>
                <BookmarkPlus className="w-4 h-4" />
                {savedProfiles.has(selected._id) ? 'Sauvegardé' : 'Sauvegarder'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
