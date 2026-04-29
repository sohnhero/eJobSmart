import { useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Search, MapPin, SlidersHorizontal, X, Bookmark,
  Building2, Users, Clock, ChevronDown, ChevronUp,
  LayoutGrid, List, Zap, TrendingUp,
} from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Button from '../components/ui/Button'
import Badge, { ContractBadge } from '../components/ui/Badge'
import MatchScore from '../components/ui/MatchScore'
import { jobs } from '../data/jobs'
import { sectors } from '../data/sectors'
import type { ContractType, ExperienceLevel, RemoteType } from '../data/jobs'

const contractTypes: ContractType[] = ['CDI', 'CDD', 'Intérim', 'Freelance', 'Stage', 'Alternance']
const experienceLevels: ExperienceLevel[] = ['Junior', 'Confirmé', 'Senior', 'Expert']
const remoteModes: RemoteType[] = ['Sur site', 'Télétravail', 'Hybride']

function FilterCheckbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <div
        onClick={() => onChange(!checked)}
        className={`w-4.5 w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
          checked ? 'bg-brand-600 border-brand-600' : 'border-slate-300 group-hover:border-brand-400'
        }`}
      >
        {checked && <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
      </div>
      <span className="text-sm text-slate-700">{label}</span>
    </label>
  )
}

export default function Jobs() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [location, setLocation] = useState(searchParams.get('location') || '')
  const [selectedContracts, setSelectedContracts] = useState<Set<string>>(new Set())
  const [selectedSectors, setSelectedSectors] = useState<Set<number>>(new Set())
  const [selectedRemote, setSelectedRemote] = useState<Set<string>>(new Set())
  const [selectedExp, setSelectedExp] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState<'recent' | 'salary' | 'popular'>('recent')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [mobileFilters, setMobileFilters] = useState(false)
  const [savedJobs, setSavedJobs] = useState<Set<number>>(new Set([5, 7]))

  const toggle = (set: Set<unknown>, val: unknown, setter: (s: Set<unknown>) => void) => {
    const next = new Set(set)
    if (next.has(val)) next.delete(val); else next.add(val)
    setter(next as never)
  }

  const filtered = useMemo(() => {
    let result = [...jobs]
    if (query) result = result.filter(j =>
      j.title.toLowerCase().includes(query.toLowerCase()) ||
      j.company.toLowerCase().includes(query.toLowerCase()) ||
      j.skills.some(s => s.toLowerCase().includes(query.toLowerCase()))
    )
    if (location) result = result.filter(j =>
      j.city.toLowerCase().includes(location.toLowerCase()) ||
      j.country.toLowerCase().includes(location.toLowerCase())
    )
    if (selectedContracts.size) result = result.filter(j => selectedContracts.has(j.contractType))
    if (selectedSectors.size) result = result.filter(j => selectedSectors.has(j.sectorId))
    if (selectedRemote.size) result = result.filter(j => selectedRemote.has(j.remoteType))
    if (selectedExp.size) result = result.filter(j => selectedExp.has(j.experienceLevel))
    if (sortBy === 'recent') result.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime())
    if (sortBy === 'salary') result.sort((a, b) => b.salaryMax - a.salaryMax)
    if (sortBy === 'popular') result.sort((a, b) => b.applicants - a.applicants)
    return result
  }, [query, location, selectedContracts, selectedSectors, selectedRemote, selectedExp, sortBy])

  const activeFilterCount = selectedContracts.size + selectedSectors.size + selectedRemote.size + selectedExp.size

  const FiltersPanel = () => (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">Filtres</h3>
        {activeFilterCount > 0 && (
          <button
            onClick={() => { setSelectedContracts(new Set()); setSelectedSectors(new Set()); setSelectedRemote(new Set()); setSelectedExp(new Set()) }}
            className="text-xs text-brand-600 hover:text-brand-800 font-medium"
          >
            Réinitialiser ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Contract Type */}
      <div>
        <h4 className="text-sm font-semibold text-slate-700 mb-3">Type de contrat</h4>
        <div className="space-y-2">
          {contractTypes.map(type => (
            <FilterCheckbox
              key={type} label={type}
              checked={selectedContracts.has(type)}
              onChange={() => toggle(selectedContracts, type, setSelectedContracts as never)}
            />
          ))}
        </div>
      </div>

      {/* Remote */}
      <div>
        <h4 className="text-sm font-semibold text-slate-700 mb-3">Mode de travail</h4>
        <div className="space-y-2">
          {remoteModes.map(mode => (
            <FilterCheckbox key={mode} label={mode} checked={selectedRemote.has(mode)} onChange={() => toggle(selectedRemote, mode, setSelectedRemote as never)} />
          ))}
        </div>
      </div>

      {/* Experience */}
      <div>
        <h4 className="text-sm font-semibold text-slate-700 mb-3">Niveau d'expérience</h4>
        <div className="space-y-2">
          {experienceLevels.map(level => (
            <FilterCheckbox key={level} label={level} checked={selectedExp.has(level)} onChange={() => toggle(selectedExp, level, setSelectedExp as never)} />
          ))}
        </div>
      </div>

      {/* Sectors */}
      <div>
        <h4 className="text-sm font-semibold text-slate-700 mb-3">Secteur d'activité</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
          {sectors.map(s => (
            <FilterCheckbox key={s.id} label={`${s.icon} ${s.name}`} checked={selectedSectors.has(s.id)} onChange={() => toggle(selectedSectors, s.id, setSelectedSectors as never)} />
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-5">Offres d'emploi</h1>

          {/* Search bar */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-2 flex flex-col sm:flex-row gap-2 focus-within:border-brand-400 transition-colors">
            <div className="flex-1 flex items-center gap-3 px-3 py-2">
              <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <input
                type="text" placeholder="Poste, compétences, entreprise..."
                value={query} onChange={e => setQuery(e.target.value)}
                className="flex-1 outline-none text-sm text-slate-800 placeholder-slate-400"
              />
              {query && <button onClick={() => setQuery('')}><X className="w-4 h-4 text-slate-400 hover:text-slate-600" /></button>}
            </div>
            <div className="flex items-center gap-3 px-3 py-2 border-t sm:border-t-0 sm:border-l border-slate-200">
              <MapPin className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <input
                type="text" placeholder="Ville ou pays..."
                value={location} onChange={e => setLocation(e.target.value)}
                className="flex-1 sm:w-36 outline-none text-sm text-slate-800 placeholder-slate-400"
              />
            </div>
            <Button className="rounded-xl">Rechercher</Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar filters - desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-22">
              <FiltersPanel />
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4 bg-white rounded-xl px-4 py-3 border border-slate-200">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileFilters(true)}
                  className="lg:hidden flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-brand-600"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filtres {activeFilterCount > 0 && <span className="bg-brand-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{activeFilterCount}</span>}
                </button>
                <span className="text-sm text-slate-500">
                  <span className="font-semibold text-slate-900">{filtered.length}</span> offre{filtered.length > 1 ? 's' : ''} trouvée{filtered.length > 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-1 border border-slate-200 rounded-lg p-1">
                  {(['recent', 'salary', 'popular'] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => setSortBy(s)}
                      className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${sortBy === s ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                    >
                      {s === 'recent' ? 'Récent' : s === 'salary' ? 'Salaire' : 'Populaire'}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-brand-100 text-brand-600' : 'text-slate-400 hover:text-slate-600'}`}>
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-lg ${viewMode === 'list' ? 'bg-brand-100 text-brand-600' : 'text-slate-400 hover:text-slate-600'}`}>
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active filter chips */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {[...selectedContracts].map(v => (
                  <button key={v} onClick={() => toggle(selectedContracts, v, setSelectedContracts as never)}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-brand-50 text-brand-700 rounded-full border border-brand-200 hover:bg-brand-100">
                    {v} <X className="w-3 h-3" />
                  </button>
                ))}
                {[...selectedRemote].map(v => (
                  <button key={v} onClick={() => toggle(selectedRemote, v, setSelectedRemote as never)}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-brand-50 text-brand-700 rounded-full border border-brand-200 hover:bg-brand-100">
                    {v} <X className="w-3 h-3" />
                  </button>
                ))}
              </div>
            )}

            {/* Jobs Grid */}
            {filtered.length === 0 ? (
              <div className="card p-16 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <Search className="w-8 h-8" />
                  </div>
                </div>
                <h3 className="font-semibold text-slate-900 text-lg mb-2">Aucune offre trouvée</h3>
                <p className="text-sm text-slate-500">Essayez de modifier vos critères de recherche</p>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-3'}>
                {filtered.map(job => (
                  <div
                    key={job.id}
                    className={`card card-premium card-hover-premium p-5 cursor-pointer relative group ${viewMode === 'list' ? 'flex items-center gap-5' : ''}`}
                    onClick={() => navigate(`/jobs/${job.id}`)}
                  >
                    {/* Action Badges */}
                    <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                      {job.isBoosted && (
                        <Badge variant="amber" size="sm" className="bg-amber-50 text-amber-700 border border-amber-100/50 backdrop-blur-sm flex items-center gap-1 px-2 shadow-sm">
                          <Zap className="w-2.5 h-2.5 fill-amber-500" />
                        </Badge>
                      )}
                      <button
                        onClick={e => { e.stopPropagation(); setSavedJobs(prev => { const n = new Set(prev); n.has(job.id) ? n.delete(job.id) : n.add(job.id); return n }) }}
                        className="p-1.5 bg-white/80 backdrop-blur-sm rounded-lg border border-slate-100 shadow-sm hover:scale-110 transition-all hover:bg-white"
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${savedJobs.has(job.id) ? 'fill-brand-600 text-brand-600' : 'text-slate-300'}`} />
                      </button>
                    </div>

                    {viewMode === 'list' ? (
                      <>
                        <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center p-2.5 flex-shrink-0 group-hover:shadow-md transition-shadow">
                          <img src={job.companyLogo} alt={job.company} className="w-full h-full object-contain" />
                        </div>
                        <div className={`flex-1 min-w-0 ${job.isBoosted ? 'pr-20' : 'pr-10'}`}>
                          <h3 className="font-bold text-slate-900 text-sm group-hover:text-brand-600 transition-colors line-clamp-1">{job.title}</h3>
                          <p className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-slate-400" />{job.company}</p>
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            <ContractBadge type={job.contractType} />
                            <Badge variant="slate" className="bg-slate-50 text-slate-600 border border-slate-100">{job.remoteType}</Badge>
                            <Badge variant="slate" className="bg-slate-50 text-slate-600 border border-slate-100"><MapPin className="w-2.5 h-2.5" />{job.city}</Badge>
                          </div>
                        </div>
                        <div className="hidden md:flex flex-col items-end gap-2 ml-auto flex-shrink-0">
                          <MatchScore score={Math.floor(70 + Math.random() * 25)} />
                          <p className="text-[10px] font-bold text-slate-900">
                            {job.salaryMax.toLocaleString('fr-FR')} <span className="text-slate-400">{job.currency}</span>
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-start gap-4 mb-5">
                          <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center p-2 flex-shrink-0 group-hover:shadow-md transition-shadow">
                            <img src={job.companyLogo} alt={job.company} className="w-full h-full object-contain" />
                          </div>
                          <div className={`min-w-0 pt-0.5 ${job.isBoosted ? 'pr-16' : ''}`}>
                            <h3 className="font-bold text-slate-900 text-sm leading-tight line-clamp-2 group-hover:text-brand-600 transition-colors">{job.title}</h3>
                            <p className="text-[11px] font-medium text-slate-500 mt-1 flex items-center gap-1"><Building2 className="w-3 h-3 text-slate-400" />{job.company}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          <ContractBadge type={job.contractType} />
                          <Badge variant="slate" className="bg-slate-50 text-slate-600 border border-slate-100">{job.remoteType}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-5">
                          <div className="flex items-center gap-2 text-slate-500">
                            <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
                              <MapPin className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-[10px] font-medium truncate">{job.city}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-500">
                            <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
                              <Users className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-[10px] font-medium">{job.applicants}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Salaire</p>
                            <p className="text-xs font-bold text-slate-900">
                              {job.salaryMin.toLocaleString('fr-FR')} — {job.salaryMax.toLocaleString('fr-FR')}
                              <span className="text-[10px] font-medium text-slate-400 ml-1">{job.currency}</span>
                            </p>
                          </div>
                          <MatchScore score={Math.floor(70 + job.id * 3 % 25)} size="sm" />
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filters drawer */}
      {mobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setMobileFilters(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-y-0 right-0 w-80 bg-white shadow-2xl overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-slate-200 px-5 py-4 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Filtres</h3>
              <button onClick={() => setMobileFilters(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5">
              <FiltersPanel />
            </div>
            <div className="sticky bottom-0 p-4 bg-white border-t border-slate-200">
              <Button fullWidth onClick={() => setMobileFilters(false)}>
                Voir {filtered.length} résultat{filtered.length > 1 ? 's' : ''}
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
