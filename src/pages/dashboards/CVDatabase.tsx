import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus, Search, SlidersHorizontal, Download, Star, MapPin,
  Briefcase, Filter, X, Eye, MessageSquare, BookmarkPlus,
  ChevronDown, TrendingUp, UserCheck,
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import Badge, { StatusBadge } from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import MatchScore from '../../components/ui/MatchScore'
import { candidates } from '../../data/candidates'

const availabilities = ['Tous', 'Immédiate', 'Préavis 1 mois', 'Préavis 3 mois', 'En poste']
const experienceRanges = ['Tous', '0-2 ans', '3-5 ans', '6-10 ans', '10+ ans']
const sectors = ['Tous', 'Technologie & Numérique', 'Banque & Finance', 'Ressources Humaines', 'Santé & Pharmaceutique', 'BTP & Immobilier']

// Extended CV database with more candidates
const cvDatabase = [
  ...candidates,
  {
    id: 6, firstName: 'Khadidiatou', lastName: 'Diallo', headline: 'Responsable Marketing Digital & Growth',
    avatar: 'https://ui-avatars.com/api/?name=Khadidiatou+Diallo&background=7c3aed&color=fff&size=128',
    location: 'Dakar, Sénégal', skills: ['Marketing Digital', 'SEO', 'Analytics', 'Social Media', 'Content Strategy'],
    experienceYears: 7, availability: 'Préavis 1 mois' as const, contractTypes: ['CDI'],
    salaryExpectation: 1100000, currency: 'FCFA', matchScore: 82, sector: 'Médias & Communication', status: 'En poste' as const,
  },
  {
    id: 7, firstName: 'Aliou', lastName: 'Niang', headline: 'Ingénieur Logiciel Backend (Java/Spring)',
    avatar: 'https://ui-avatars.com/api/?name=Aliou+Niang&background=059669&color=fff&size=128',
    location: 'Dakar, Sénégal', skills: ['Java', 'Spring Boot', 'Microservices', 'PostgreSQL', 'AWS'],
    experienceYears: 5, availability: 'Immédiate' as const, contractTypes: ['CDI', 'Freelance'],
    salaryExpectation: 1300000, currency: 'FCFA', matchScore: 89, sector: 'Technologie & Numérique', status: 'Disponible' as const,
  },
  {
    id: 8, firstName: 'Rokhaya', lastName: 'Faye', headline: 'Directrice des Opérations & Supply Chain',
    avatar: 'https://ui-avatars.com/api/?name=Rokhaya+Faye&background=be185d&color=fff&size=128',
    location: 'Dakar, Sénégal', skills: ['Supply Chain', 'Logistique', 'Lean Management', 'ERP SAP', 'GPAO'],
    experienceYears: 11, availability: 'Préavis 3 mois' as const, contractTypes: ['CDI'],
    salaryExpectation: 2800000, currency: 'FCFA', matchScore: 78, sector: 'Industrie & Manufacture', status: 'En poste' as const,
  },
  {
    id: 9, firstName: 'Demba', lastName: 'Traoré', headline: 'Consultant Fiscal & Expert-Comptable',
    avatar: 'https://ui-avatars.com/api/?name=Demba+Traoré&background=d97706&color=fff&size=128',
    location: 'Abidjan, Côte d\'Ivoire', skills: ['Fiscalité', 'SYSCOHADA', 'Audit', 'Consolidation', 'IFRS'],
    experienceYears: 9, availability: 'Préavis 1 mois' as const, contractTypes: ['CDI'],
    salaryExpectation: 2000000, currency: 'FCFA', matchScore: 86, sector: 'Banque & Finance', status: 'En poste' as const,
  },
  {
    id: 10, firstName: 'Binta', lastName: 'Kouyaté', headline: 'Chargée de Communication & Relations Presse',
    avatar: 'https://ui-avatars.com/api/?name=Binta+Kouyaté&background=0891b2&color=fff&size=128',
    location: 'Conakry, Guinée', skills: ['Relations Presse', 'Community Management', 'RP', 'Rédaction', 'Événementiel'],
    experienceYears: 4, availability: 'Immédiate' as const, contractTypes: ['CDI', 'CDD'],
    salaryExpectation: 750000, currency: 'FCFA', matchScore: 74, sector: 'Médias & Communication', status: 'Disponible' as const,
  },
]

export default function CVDatabase() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [availability, setAvailability] = useState('Tous')
  const [experience, setExperience] = useState('Tous')
  const [sector, setSector] = useState('Tous')
  const [savedProfiles, setSavedProfiles] = useState<Set<number>>(new Set([1, 3]))
  const [selectedCandidate, setSelectedCandidate] = useState<typeof cvDatabase[0] | null>(null)

  const filtered = cvDatabase.filter(c => {
    if (query && !`${c.firstName} ${c.lastName}`.toLowerCase().includes(query.toLowerCase())
      && !c.headline.toLowerCase().includes(query.toLowerCase())
      && !c.skills.some(s => s.toLowerCase().includes(query.toLowerCase()))) return false
    if (availability !== 'Tous' && c.availability !== availability) return false
    if (sector !== 'Tous' && c.sector !== sector) return false
    if (experience !== 'Tous') {
      const yr = c.experienceYears
      if (experience === '0-2 ans' && yr > 2) return false
      if (experience === '3-5 ans' && (yr < 3 || yr > 5)) return false
      if (experience === '6-10 ans' && (yr < 6 || yr > 10)) return false
      if (experience === '10+ ans' && yr < 10) return false
    }
    return true
  })

  const toggleSave = (id: number) => {
    setSavedProfiles(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <DashboardLayout role="company" userName="Sonatel Digital" userTitle="Compte Entreprise">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Base CV Propriétaire</h1>
          <p className="text-slate-500 text-sm mt-0.5">{cvDatabase.length} profils disponibles · Accès illimité inclus dans votre plan Business</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" leftIcon={<Download className="w-4 h-4" />}>
            Exporter
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Profils totaux', value: cvDatabase.length, icon: UserCheck, color: 'text-brand-600', bg: 'bg-brand-50' },
          { label: 'Disponibles', value: cvDatabase.filter(c => c.status === 'Disponible').length, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'En veille', value: cvDatabase.filter(c => c.status === 'En poste').length, icon: Briefcase, color: 'text-amber-600', bg: 'bg-amber-50' },
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
              placeholder="Chercher par nom, compétence, titre..."
              value={query} onChange={e => setQuery(e.target.value)}
              className="input-field pl-9 py-2.5"
            />
            {query && <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-slate-400" /></button>}
          </div>
          <select value={availability} onChange={e => setAvailability(e.target.value)} className="input-field py-2.5 w-auto">
            {availabilities.map(a => <option key={a} value={a}>{a === 'Tous' ? 'Disponibilité' : a}</option>)}
          </select>
          <select value={experience} onChange={e => setExperience(e.target.value)} className="input-field py-2.5 w-auto">
            {experienceRanges.map(e => <option key={e} value={e}>{e === 'Tous' ? 'Expérience' : e}</option>)}
          </select>
          <select value={sector} onChange={e => setSector(e.target.value)} className="input-field py-2.5 w-auto">
            {sectors.map(s => <option key={s} value={s}>{s === 'Tous' ? 'Secteur' : s}</option>)}
          </select>
        </div>
      </div>

      <p className="text-sm text-slate-500 mb-4">
        <span className="font-semibold text-slate-900">{filtered.length}</span> profil{filtered.length > 1 ? 's' : ''} correspondant{filtered.length > 1 ? 's' : ''}
      </p>

      {/* Candidates grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map(c => (
          <div key={c.id} className="card p-5 hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-start gap-3 mb-4">
              <Avatar name={`${c.firstName} ${c.lastName}`} size="md" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{c.firstName} {c.lastName}</p>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{c.headline}</p>
                  </div>
                  <MatchScore score={c.matchScore || 80} size="sm" showLabel={false} />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <StatusBadge status={c.status} />
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5" />{c.location}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {c.skills.slice(0, 4).map(s => (
                <span key={s} className="text-[10px] px-2 py-0.5 bg-brand-50 text-brand-700 rounded-full font-medium border border-brand-100">{s}</span>
              ))}
              {c.skills.length > 4 && <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full font-medium">+{c.skills.length - 4}</span>}
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500 mb-4 pt-3 border-t border-slate-100">
              <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{c.experienceYears} ans</span>
              <span className="flex items-center gap-1">{c.availability}</span>
              <span className="ml-auto font-semibold text-slate-700">{c.salaryExpectation.toLocaleString('fr-FR')} {c.currency}</span>
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" className="flex-1" onClick={() => setSelectedCandidate(c)}>
                <Eye className="w-3.5 h-3.5" /> Voir profil
              </Button>
              <button
                onClick={() => navigate('/dashboard/company/messages')}
                className="p-2 rounded-lg border border-slate-200 hover:border-brand-300 hover:bg-brand-50 transition-colors"
                title="Contacter"
              >
                <MessageSquare className="w-4 h-4 text-slate-500" />
              </button>
              <button
                onClick={() => toggleSave(c.id)}
                className={`p-2 rounded-lg border transition-colors ${savedProfiles.has(c.id) ? 'border-brand-300 bg-brand-50 text-brand-600' : 'border-slate-200 hover:border-brand-300 hover:bg-brand-50 text-slate-500'}`}
                title="Sauvegarder"
              >
                <BookmarkPlus className={`w-4 h-4 ${savedProfiles.has(c.id) ? 'fill-brand-600' : ''}`} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="card p-16 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="font-semibold text-slate-900 text-lg mb-2">Aucun profil trouvé</h3>
          <p className="text-sm text-slate-500">Essayez de modifier vos critères de recherche</p>
        </div>
      )}

      {/* Candidate detail modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedCandidate(null)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-900">Profil complet</h3>
              <button onClick={() => setSelectedCandidate(null)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-start gap-4 mb-5">
              <Avatar name={`${selectedCandidate.firstName} ${selectedCandidate.lastName}`} size="lg" />
              <div>
                <p className="font-bold text-slate-900">{selectedCandidate.firstName} {selectedCandidate.lastName}</p>
                <p className="text-sm text-slate-500 mt-0.5">{selectedCandidate.headline}</p>
                <div className="flex items-center gap-2 mt-2">
                  <StatusBadge status={selectedCandidate.status} />
                  <MatchScore score={selectedCandidate.matchScore || 80} size="sm" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { label: 'Localisation', value: selectedCandidate.location },
                { label: 'Disponibilité', value: selectedCandidate.availability },
                { label: 'Expérience', value: `${selectedCandidate.experienceYears} ans` },
                { label: 'Prétention salariale', value: `${selectedCandidate.salaryExpectation.toLocaleString('fr-FR')} ${selectedCandidate.currency}` },
              ].map(item => (
                <div key={item.label} className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400">{item.label}</p>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mb-5">
              <p className="text-sm font-semibold text-slate-700 mb-2">Compétences</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedCandidate.skills.map(s => (
                  <span key={s} className="text-xs px-2.5 py-1 bg-brand-50 text-brand-700 rounded-lg font-medium border border-brand-100">{s}</span>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <p className="text-sm font-semibold text-slate-700 mb-2">Types de contrats souhaités</p>
              <div className="flex gap-2">
                {selectedCandidate.contractTypes.map(ct => (
                  <span key={ct} className="text-xs px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg font-medium">{ct}</span>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button fullWidth onClick={() => { navigate('/dashboard/company/messages'); setSelectedCandidate(null) }}>
                <MessageSquare className="w-4 h-4" /> Contacter
              </Button>
              <Button fullWidth variant="secondary" onClick={() => { toggleSave(selectedCandidate.id); }}>
                <BookmarkPlus className="w-4 h-4" />
                {savedProfiles.has(selectedCandidate.id) ? 'Sauvegardé' : 'Sauvegarder'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
