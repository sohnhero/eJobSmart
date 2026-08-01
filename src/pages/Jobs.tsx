import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Search, MapPin, SlidersHorizontal, X, Bookmark,
  Building2, Users, ChevronDown, ChevronUp,
  LayoutGrid, List, Zap, TrendingUp,
} from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Button from '../components/ui/Button'
import Badge, { ContractBadge } from '../components/ui/Badge'
import MatchScore from '../components/ui/MatchScore'
import { jobsService } from '../lib/services/jobs'
import { sectorsService } from '../lib/services/sectors'
import { extractApiErrorMessage } from '../lib/api'
import type { ContractType, ExperienceLevel, Job, RemoteType, Sector } from '../lib/types'

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
  const [selectedSectors, setSelectedSectors] = useState<Set<string>>(new Set())
  const [selectedRemote, setSelectedRemote] = useState<Set<string>>(new Set())
  const [selectedExp, setSelectedExp] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState<'recent' | 'salary' | 'popular'>('recent')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [mobileFilters, setMobileFilters] = useState(false)
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set())

  const [jobs, setJobs] = useState<Job[]>([])
  const [sectors, setSectors] = useState<Sector[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    void sectorsService.list().then(setSectors).catch(() => setSectors([]))
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    jobsService
      .list({
        q: query || undefined,
        sector: selectedSectors.size ? [...selectedSectors] : undefined,
        contractType: selectedContracts.size ? ([...selectedContracts] as ContractType[]) : undefined,
        limit: 100,
      })
      .then((res) => {
        if (!cancelled) setJobs(res.items)
      })
      .catch((err) => {
        if (!cancelled) setError(extractApiErrorMessage(err, 'Impossible de charger les offres'))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, selectedSectors, selectedContracts])

  const toggle = (set: Set<unknown>, val: unknown, setter: (s: Set<unknown>) => void) => {
    const next = new Set(set)
    if (next.has(val)) next.delete(val); else next.add(val)
    setter(next as never)
  }

  const filtered = useMemo(() => {
    let result = [...jobs]
    if (location) result = result.filter(j =>
      j.city.toLowerCase().includes(location.toLowerCase()) ||
      j.country.toLowerCase().includes(location.toLowerCase())
    )
    if (selectedRemote.size) result = result.filter(j => selectedRemote.has(j.remoteType))
    if (selectedExp.size) result = result.filter(j => selectedExp.has(j.experienceLevel))
    if (sortBy === 'recent') result.sort((a, b) => new Date(b.postedAt ?? b.createdAt).getTime() - new Date(a.postedAt ?? a.createdAt).getTime())
    if (sortBy === 'salary') result.sort((a, b) => (b.salaryMax ?? 0) - (a.salaryMax ?? 0))
    if (sortBy === 'popular') result.sort((a, b) => b.applicantsCount - a.applicantsCount)
    return result
  }, [jobs, location, selectedRemote, selectedExp, sortBy])

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
            <FilterCheckbox key={s._id} label={`${s.icon ?? ''} ${s.name}`} checked={selectedSectors.has(s._id)} onChange={() => toggle(selectedSectors, s._id, setSelectedSectors as never)} />
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Header */}
      <section className="relative overflow-hidden py-16" style={{ background: 'linear-gradient(135deg, #0F1E3A 0%, #0F3B95 60%, #2563EB 100%)' }}>
        <div className="absolute inset-0 bg-hero-pattern opacity-10" />
        <div className="absolute top-20 right-0 w-[400px] h-[400px] rounded-full opacity-10 blur-3xl" style={{ background: '#39D5F4' }} />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-5 blur-3xl" style={{ background: '#2563EB' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center z-10">
          <div className="max-w-3xl mb-8 mx-auto">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-heading font-black tracking-widest uppercase border border-cyan-400/30" style={{ backgroundColor: 'rgba(57,213,244,0.1)', color: '#39D5F4' }}>
              Offres d'emploi
            </span>
            <h1 className="text-3xl md:text-4xl font-heading font-black text-white mt-4 tracking-tight">
              Trouvez l'opportunité de vos rêves
            </h1>
          </div>

          {/* Search bar */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-2 flex flex-col sm:flex-row gap-2 w-full max-w-4xl mx-auto shadow-xl shadow-brand-900/10 border border-white/20 text-left">
            <div className="flex-1 flex items-center gap-3 px-3 py-1.5">
              <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input
                type="text" placeholder="Poste, compétences, entreprise..."
                value={query} onChange={e => setQuery(e.target.value)}
                className="flex-1 outline-none text-sm bg-transparent text-slate-800 placeholder-slate-400"
              />
              {query && <button onClick={() => setQuery('')} className="p-1"><X className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600" /></button>}
            </div>
            <div className="flex items-center gap-3 px-3 py-1.5 border-t sm:border-t-0 sm:border-l border-slate-200/60">
              <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input
                type="text" placeholder="Ville ou pays..."
                value={location} onChange={e => setLocation(e.target.value)}
                className="flex-1 sm:w-44 outline-none text-sm bg-transparent text-slate-800 placeholder-slate-400"
              />
              {location && <button onClick={() => setLocation('')} className="p-1"><X className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600" /></button>}
            </div>
            <Button className="rounded-xl bg-gradient-to-r from-brand-600 to-blue-600 px-6 h-11">Rechercher</Button>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-[-2px] left-0 right-0 pointer-events-none">
          <svg className="w-full block" viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 0C1200 40 960 60 720 60C480 60 240 40 0 0L0 60Z" fill="#F8FAFC" stroke="#F8FAFC" strokeWidth="1.5" />
          </svg>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
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
                <div className="hidden sm:flex items-center gap-1">
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
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="card p-5 h-48 animate-pulse bg-slate-100" />
                ))}
              </div>
            ) : error ? (
              <div className="card p-16 text-center">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            ) : filtered.length === 0 ? (
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
                    key={job._id}
                    className={`card card-premium card-hover-premium p-5 cursor-pointer relative group ${viewMode === 'list' ? 'sm:flex sm:items-center sm:gap-5' : ''}`}
                    onClick={() => navigate(`/jobs/${job._id}`)}
                  >
                    {/* Action Badges */}
                    <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                      {job.isBoosted && (
                        <Badge variant="amber" size="sm" className="bg-amber-50 text-amber-700 border border-amber-100/50 backdrop-blur-sm flex items-center gap-1 px-2 shadow-sm">
                          <Zap className="w-2.5 h-2.5 fill-amber-500" />
                        </Badge>
                      )}
                      <button
                        onClick={e => { e.stopPropagation(); setSavedJobs(prev => { const n = new Set(prev); n.has(job._id) ? n.delete(job._id) : n.add(job._id); return n }) }}
                        className="p-1.5 bg-white/80 backdrop-blur-sm rounded-lg border border-slate-100 shadow-sm hover:scale-110 transition-all hover:bg-white"
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${savedJobs.has(job._id) ? 'fill-brand-600 text-brand-600' : 'text-slate-300'}`} />
                      </button>
                    </div>

                    {viewMode === 'list' ? (
                      <>
                        <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center p-2.5 flex-shrink-0 group-hover:shadow-md transition-shadow overflow-hidden">
                          {job.companyLogo ? <img src={job.companyLogo} alt={job.companyName} className="w-full h-full object-contain" /> : <Building2 className="w-6 h-6 text-slate-300" />}
                        </div>
                        <div className={`flex-1 min-w-0 ${job.isBoosted ? 'sm:pr-20 pr-12' : 'sm:pr-10 pr-6'}`}>
                          <h3 className="font-bold text-slate-900 text-sm group-hover:text-brand-600 transition-colors line-clamp-1">{job.title}</h3>
                          <p className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-slate-400" />{job.companyName}</p>
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            <ContractBadge type={job.contractType} />
                            <Badge variant="slate" className="bg-slate-50 text-slate-600 border border-slate-100">{job.remoteType}</Badge>
                            <Badge variant="slate" className="bg-slate-50 text-slate-600 border border-slate-100"><MapPin className="w-2.5 h-2.5" />{job.city}</Badge>
                          </div>
                        </div>
                        {job.isSalaryVisible && job.salaryMax && (
                          <div className="hidden md:flex flex-col items-end gap-2 ml-auto flex-shrink-0">
                            <p className="text-[10px] font-bold text-slate-900">
                              {job.salaryMax.toLocaleString('fr-FR')} <span className="text-slate-400">{job.currency}</span>
                            </p>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="flex items-start gap-4 mb-5">
                          <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center p-2 flex-shrink-0 group-hover:shadow-md transition-shadow overflow-hidden">
                            {job.companyLogo ? <img src={job.companyLogo} alt={job.companyName} className="w-full h-full object-contain" /> : <Building2 className="w-5 h-5 text-slate-300" />}
                          </div>
                          <div className={`min-w-0 pt-0.5 ${job.isBoosted ? 'pr-16' : ''}`}>
                            <h3 className="font-bold text-slate-900 text-sm leading-tight line-clamp-2 group-hover:text-brand-600 transition-colors">{job.title}</h3>
                            <p className="text-[11px] font-medium text-slate-500 mt-1 flex items-center gap-1"><Building2 className="w-3 h-3 text-slate-400" />{job.companyName}</p>
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
                            <span className="text-[10px] font-medium">{job.applicantsCount}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                          {job.isSalaryVisible && job.salaryMin && job.salaryMax ? (
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Salaire</p>
                              <p className="text-xs font-bold text-slate-900">
                                {job.salaryMin.toLocaleString('fr-FR')} — {job.salaryMax.toLocaleString('fr-FR')}
                                <span className="text-[10px] font-medium text-slate-400 ml-1">{job.currency}</span>
                              </p>
                            </div>
                          ) : <span />}
                          {job.isFeatured && <TrendingUp className="w-4 h-4 text-amber-500" />}
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
